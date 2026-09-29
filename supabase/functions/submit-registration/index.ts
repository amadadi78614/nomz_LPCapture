import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const allowedOrigins = new Set([
  'https://lowveldpadel.co.za',
  'https://www.lowveldpadel.co.za',
  'http://localhost:5173',
]);

function cors(origin: string | null) {
  const safeOrigin = origin && allowedOrigins.has(origin) ? origin : 'https://www.lowveldpadel.co.za';
  return {
    'Access-Control-Allow-Origin': safeOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
    'Vary': 'Origin',
  };
}

const clean = (value: unknown, max = 120) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const emailOk = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const phoneOk = (value: string) => /^[+()\d\s-]{8,20}$/.test(value);
const reply = (body: unknown, status: number, headers: Record<string, string>) =>
  new Response(JSON.stringify(body), { status, headers });

function reference(prefix: string) {
  const day = new Date().toISOString().slice(2, 10).replaceAll('-', '');
  const token = crypto.randomUUID().replaceAll('-', '').slice(0, 6).toUpperCase();
  return `${prefix}-${day}-${token}`;
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get('origin');
  const headers = cors(origin);
  if (req.method === 'OPTIONS') return new Response('ok', { headers });
  if (req.method !== 'POST') return reply({ ok: false, error: 'Method not allowed.' }, 405, headers);
  if (origin && !allowedOrigins.has(origin)) return reply({ ok: false, error: 'Origin not allowed.' }, 403, headers);

  try {
    const body = await req.json();
    const event = clean(body.event, 40);
    let row: Record<string, unknown>;

    if (event === 'kruger-cup-2026') {
      const division = clean(body.division, 20);
      const players = Array.isArray(body.players) ? body.players.slice(0, 2).map((p: Record<string, unknown>) => ({
        name: clean(p.name), mobile: clean(p.mobile, 20), email: clean(p.email, 160).toLowerCase(), level: clean(p.level, 30),
      })) : [];
      if (!['championship', 'challenger', 'unsure'].includes(division) || players.length !== 2 ||
          players.some((p) => p.name.length < 3 || !phoneOk(p.mobile) || !emailOk(p.email) || !p.level) ||
          body.popiaConsent !== true || body.rulesAccepted !== true) {
        return reply({ ok: false, error: 'Please complete all required pair details correctly.' }, 400, headers);
      }
      row = {
        reference: reference('KC'), event_code: event, registration_type: 'pair', division,
        pair_name: clean(body.pairName, 80) || null, participants: players,
        primary_name: players[0].name, primary_email: players[0].email, primary_mobile: players[0].mobile,
        popia_consent: true, rules_accepted: true, payment_amount_cents: 80000,
      };
    } else if (event === 'ubuntu-challenge-01') {
      const p = body.player || {};
      const player = {
        name: clean(p.name, 80), surname: clean(p.surname, 80), mobile: clean(p.mobile, 20),
        dateOfBirth: clean(p.dateOfBirth, 10), gender: clean(p.gender, 20), team: clean(p.team, 80),
      };
      if (player.name.length < 2 || player.surname.length < 2 || !phoneOk(player.mobile) ||
          !/^\d{4}-\d{2}-\d{2}$/.test(player.dateOfBirth) || !['Male', 'Female'].includes(player.gender) ||
          !player.team || body.popiaConsent !== true) {
        return reply({ ok: false, error: 'Please complete all required player details correctly.' }, 400, headers);
      }
      row = {
        reference: reference('UB'), event_code: event, registration_type: 'individual', participants: [player],
        primary_name: `${player.name} ${player.surname}`, primary_mobile: player.mobile,
        is_minor: body.isMinor === true, popia_consent: true, payment_amount_cents: 0,
      };
    } else {
      return reply({ ok: false, error: 'This registration is not open.' }, 400, headers);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    const { error } = await supabase.from('app_registrations').insert(row);
    if (error) {
      console.error('registration_insert_failed', { code: error.code });
      return reply({ ok: false, error: 'Registration could not be saved. Please try again.' }, 500, headers);
    }
    return reply({ ok: true, reference: row.reference, status: 'pending_review' }, 201, headers);
  } catch {
    return reply({ ok: false, error: 'Invalid registration request.' }, 400, headers);
  }
});
