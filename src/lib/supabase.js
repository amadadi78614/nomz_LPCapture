// ============================================================
// DATA LAYER — Supabase in production, deterministic local demo
// when env vars are absent (so the repo runs out of the box).
//
// Production realtime model:
//   matches.live_state  -> denormalised engine state (jsonb),
//                          updated by the umpire console on
//                          every point. Clients subscribe via
//                          postgres_changes and re-render.
//   match_events        -> append-only point log (undo/replay,
//                          analytics, momentum, audit).
// ============================================================
import { createClient } from '@supabase/supabase-js';
import { newMatch, applyPoint } from './scoringEngine';
import { FIXTURES } from '../data/seed';

// The URL and publishable key are intentionally safe to ship to browsers.
// All sensitive access remains protected by RLS and server-side credentials.
const url = import.meta.env.VITE_SUPABASE_URL || 'https://xkxmnljalxqjovokfmub.supabase.co';
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_U6nbcH9-z7u_mth63-isbw_QwuVIWyr';

export const supabase = url && anon ? createClient(url, anon) : null;
export const isLive = Boolean(supabase);

/**
 * Submit a public competition registration through the server-side Edge
 * Function. The browser never receives database write credentials and public
 * users cannot read registration records.
 */
export async function submitRegistration(payload) {
  if (!supabase) {
    throw new Error('Registration service is not connected yet. Please try again shortly.');
  }

  const { data, error } = await supabase.functions.invoke('submit-registration', {
    body: payload,
  });

  if (error) {
    throw new Error(error.message || 'We could not submit your registration.');
  }
  if (!data?.ok || !data?.reference) {
    throw new Error(data?.error || 'We could not submit your registration.');
  }
  return data;
}

export async function adminSignIn(email, password) {
  if (!supabase) throw new Error('Admin service is unavailable.');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function adminSignOut() {
  if (supabase) await supabase.auth.signOut();
}

export async function getAdminSession() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function hasAdminAccess() {
  if (!supabase) return false;
  const { data, error } = await supabase.from('app_admin_users').select('user_id').maybeSingle();
  return !error && Boolean(data);
}

export async function listRegistrations() {
  if (!supabase) throw new Error('Admin service is unavailable.');
  const { data, error } = await supabase.from('app_registrations')
    .select('id,reference,event_code,registration_type,division,pair_name,participants,primary_name,primary_email,primary_mobile,is_minor,registration_status,payment_status,payment_amount_cents,confirmation_email_status,submitted_at,deleted_at,updated_at')
    .order('submitted_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function updateRegistration(id, changes) {
  if (!supabase) throw new Error('Admin service is unavailable.');
  const allowed = ['registration_status', 'payment_status'];
  const safe = Object.fromEntries(Object.entries(changes).filter(([key]) => allowed.includes(key)));
  const { data, error } = await supabase.from('app_registrations').update({ ...safe, updated_at: new Date().toISOString() }).eq('id', id).select('registration_status,payment_status,updated_at').single();
  if (error) throw error;
  return data;
}

// ------------------------------------------------------------
// LOCAL DEMO ENGINE — simulates two live courts so the Match
// Centre, ticker and dashboards are fully demonstrable.
// ------------------------------------------------------------
const demoMatches = new Map();
const listeners = new Map();

function seedDemo() {
  FIXTURES.filter((f) => f.status === 'live').forEach((f, idx) => {
    let st = newMatch();
    // Fast-forward each live court to a different, interesting position.
    const points = idx === 0 ? 52 : 38;
    for (let i = 0; i < points; i++) {
      st = applyPoint(st, { winner: Math.sin(i * 2.4 + idx) > -0.2 ? 'home' : 'away' });
      if (st.winner) break;
    }
    demoMatches.set(f.id, st);
  });
}
seedDemo();

let demoTimer = null;
function tickDemo() {
  for (const [id, st] of demoMatches) {
    if (st.winner) continue;
    const next = applyPoint(st, { winner: Math.random() > 0.48 ? 'home' : 'away' });
    demoMatches.set(id, next);
    (listeners.get(id) || []).forEach((cb) => cb(next));
  }
}
function ensureDemoLoop() {
  if (!demoTimer) demoTimer = setInterval(tickDemo, 3500);
}

// ------------------------------------------------------------
// PUBLIC API used by hooks/pages
// ------------------------------------------------------------
export function getLiveState(matchId) {
  return demoMatches.get(matchId) || newMatch();
}

/** Subscribe to a live match. Returns unsubscribe fn. */
export function subscribeMatch(matchId, cb) {
  if (supabase) {
    const channel = supabase
      .channel(`match:${matchId}`)
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'matches', filter: `id=eq.${matchId}` },
        (payload) => cb(payload.new.live_state))
      .subscribe();
    return () => supabase.removeChannel(channel);
  }
  ensureDemoLoop();
  const arr = listeners.get(matchId) || [];
  arr.push(cb);
  listeners.set(matchId, arr);
  cb(getLiveState(matchId));
  return () => listeners.set(matchId, (listeners.get(matchId) || []).filter((f) => f !== cb));
}

/** Umpire console: record a point (writes event + denormalised state). */
export async function recordPoint(matchId, winner, prevState) {
  const next = applyPoint(prevState, { winner });
  if (supabase) {
    await supabase.from('match_events').insert({ match_id: matchId, event_type: 'point', payload: { winner } });
    await supabase.from('matches').update({ live_state: next, status: next.winner ? 'final' : 'live' }).eq('id', matchId);
  } else {
    demoMatches.set(matchId, next);
    (listeners.get(matchId) || []).forEach((cb) => cb(next));
  }
  return next;
}

export async function undoPoint(matchId, events, opts) {
  // Production: delete last event row, replay server-side (RPC lp_replay_match).
  if (supabase) {
    await supabase.rpc('lp_undo_last_point', { p_match_id: matchId });
    return null;
  }
  return null;
}

// Reversible removal; existing RLS limits writes to administrators.
export async function trashRegistration(id, trashed) {
  if (!supabase) throw new Error('Registration service is unavailable.');
  const { data, error } = await supabase.from('app_registrations').update({deleted_at: trashed ? new Date().toISOString() : null}).eq('id', id).select('id,deleted_at').single();
  if (error) throw new Error('Could not update this entry. Check your admin access and refresh before retrying.');
  return data;
}

export async function permanentlyDeleteRegistration(id) {
  if (!supabase) throw new Error('Registration service is unavailable.');
  const { data, error } = await supabase.from('app_registrations')
    .delete().eq('id', id).not('deleted_at', 'is', null).select('id').single();
  if (error || !data) throw new Error('Could not permanently delete this entry. It must still be in trash and you must have admin access. Refresh and try again.');
  return data;
}

export async function updateRegistrationDetails(id, changes, expectedUpdatedAt) {
  const allowed = ['participants','pair_name','division','primary_name','primary_email','primary_mobile','is_minor'];
  const safe = Object.fromEntries(Object.entries(changes).filter(([key])=>allowed.includes(key)));
  let query = supabase.from('app_registrations').update({...safe,updated_at:new Date().toISOString()}).eq('id',id).is('deleted_at',null);
  if (expectedUpdatedAt) query=query.eq('updated_at',expectedUpdatedAt);
  const {data,error}=await query.select('participants,pair_name,division,primary_name,primary_email,primary_mobile,is_minor,updated_at').single();
  if(error||!data)throw new Error('Could not save. The entry may have changed or your account may lack edit access. Cancel, refresh and try again.');
  return data;
}
