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

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = url && anon ? createClient(url, anon) : null;
export const isLive = Boolean(supabase);

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
