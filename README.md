# Lowveld Padel — League Platform

Broadcast-grade sports platform for the Lowveld Padel Franchise League (LPFL).
React + Vite + Supabase Realtime. Mobile-first PWA.

**Design language:** F1 livery system × Premier League tables × ESPN editorial × LIV Golf event energy. Dark "night court" theme, Saira Condensed display type, per-franchise livery stripes, persistent Live Spine ticker.

---

## Quick start (demo mode — no backend needed)

```bash
npm install
npm run dev
```

Without Supabase env vars the app runs a **deterministic local live-match simulator** (two courts ticking every 3.5s) so every screen — Live Match Centre, scoreboards, momentum, ticker — is fully demonstrable offline. Ideal for the stakeholder demo.

## Production mode (Supabase)

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor (tables, views, RPCs, RLS, realtime publication).
3. Create `.env`:

```
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-ANON-KEY
```

4. `npm run build` → deploy `dist/` to Vercel (SPA rewrite all routes → `/index.html`).

## Routes

| Route | Screen |
|---|---|
| `/` | ESPN-style homepage (hero, live cards, news mosaic, twin tables, MVP spotlight) |
| `/live` | Live Match Centre (Live / Fixtures / Results) |
| `/match/:id` | Full broadcast scoreboard + momentum + on-court pairs |
| `/standings` | Real-time Men's & Ladies tables (qual zone, form) |
| `/players` `/player/:id` | Player directory + profiles (LP Rating, KPIs) |
| `/franchises` `/franchise/:slug` | Franchise hubs with livery heroes |
| `/rankings` | Power Rankings / MVP Leaderboard / LP Ratings |
| `/news` | News Centre |
| `/sponsors` | Sponsor Centre (tiers + partner CTA) |
| `/admin` | Umpire scoring console (big-tap, TB-aware, undo) |
| `/captain` | Captain dashboard (pair selection, availability) |
| `/commissioner` | League ops (approvals, governance, KPIs) |
| `/sponsor-analytics` | Sponsor exposure analytics (impressions, CTR, placements) |

## Scoring format (encoded in `src/lib/scoringEngine.js`)

- Best of 3. Sets 1–2 to 6 games; **7-point tiebreak at 6–6** (win by 2).
- **Set 3 is always a 10-point match tiebreaker** (win by 2).
- Golden point at deuce (configurable in `seasons.rules`).
- Engine is a pure event-sourced reducer: `match_events` replayed → `live_state`. Undo = drop last event + replay.

## LP Rating (`src/lib/lpRating.js`)

Doubles Elo: pair = mean rating, K=32 (×2 provisional first 5), ×1.15 straight-sets, ×0.85 match-TB decider, both partners receive full delta. Start 1400. Tiers: Rising < 1350 ≤ Contender < 1450 ≤ Advanced < 1550 ≤ Pro < 1700 ≤ Elite.

## Repo map

```
src/
  lib/        scoringEngine.js · lpRating.js · supabase.js (realtime + demo loop)
  data/       seed.js (14 franchises, 84 players, fixtures, sponsors, news)
  components/ ui.jsx (ticker, scorecards, tables, sponsor rail)
  pages/      public.jsx · dashboards.jsx
  styles/     tokens.css (design system + livery vars) · global.css
supabase/     schema.sql (full schema, views, RPCs, RLS, realtime)
docs/         ARCHITECTURE.md (UX architecture, component tree, realtime flow,
              monetisation model, rollout phases)
public/       manifest.webmanifest · sw.js · logos/
```

## Rollout

1. **Now:** deploy demo mode to lowveldpadel.co.za — full platform visible day one.
2. **Backend:** provision Supabase, run schema, deploy `lp-score` Edge Function.
3. **Engagement:** auth, push notifications, fan voting.
4. **Commerce:** auction module, Finals Night hub, PayFast/Yoco registration.
