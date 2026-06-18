# Lowveld Padel Platform — Architecture

Static brochure → daily-visit sports platform. Design DNA: **F1** (liveries, control-room data), **Premier League** (table discipline, form guides), **ESPN** (editorial density, scores-first homepage), **LIV Golf** (franchise glamour, bold condensed type).

---

## 1. The daily-visit loop (why users come back)

| Day | Driver | Surface |
|---|---|---|
| Matchnights (2×/wk) | Point-by-point live scoring | Live Match Centre + ticker |
| Day after | Results, table movement, MVP race shifts | Home, Standings, Rankings |
| Mid-week | Power rankings drop (weekly editorial event), news, LP Rating changes | News Centre, Rankings |
| Always | "What's my rating / where's my team" vanity loop | Player profile, Franchise hub |

Every page carries the **Live Spine** — a persistent broadcast ticker pinned to the top of the app. Live state is never more than one glance away, on any route. That's the signature element and the retention engine.

## 2. UX architecture

```
Live Ticker (persistent, realtime, all routes)
Top bar (desktop) / Bottom tab bar (mobile): Home · Live · Tables · Players · More
│
├── / .................... ESPN-style home: hero → live cards → news mosaic
│                          → twin tables (M/L) → results/fixtures → MVP race → sponsor rail
├── /live ................ Match Centre hub (Live | Fixtures | Results tabs)
├── /match/:id ........... Single match: full scoreboard, set history, serve dot,
│                          tiebreak banners, momentum strip, on-court pairs, sponsor rail
├── /standings ........... Real-time PL-style tables, qualification zones, form guide
├── /players ............. Directory: search, league filter, LP Rating sort, tier badges
├── /player/:id .......... Profile: rating + tier, KPIs, season form bars, franchise link
├── /franchises .......... Grid with live table position per franchise
├── /franchise/:id ....... Franchise hub: livery hero, record, form, squad, schedule
├── /rankings ............ Power Rankings (editorial) | MVP Leaderboard | LP Rating top-15
├── /news ................ News Centre: kicker/tag taxonomy, match reports, analysis
├── /sponsors ............ Sponsor Centre: tier packages, current partners, partner CTA
└── /more ................ Role entry points + secondary nav
     ├── /admin ............... Umpire console (live scoring)
     ├── /captain ............. Team sheets, pair selection, availability
     ├── /commissioner ........ League control room
     └── /sponsor-analytics ... Partner exposure dashboard
```

Mobile-first: one-hand bottom nav, 44px touch targets, sticky ticker, PWA installable (manifest + service worker, offline shell, ready for push notifications via FCM later).

## 3. React component tree

```
<App>
├── <LiveTicker>            subscribes to all live matches (signature spine)
├── <TopBar> / <BottomNav>
└── <Routes>
    ├── Home ──────────── <Hero> <LiveScoreCard×n> <NewsMosaic> <StandingsTable×2>
    │                     <ResultCard> <FixtureRow> <MvpSpotlight> <SponsorRail>
    ├── MatchCentre ───── <Tabs> → LiveScoreCard | FixtureRow | ResultCard
    ├── MatchPage ─────── <Scoreboard> <MomentumStrip> <OnCourtPairs> <SponsorRail>
    ├── Standings ─────── <LeagueTabs> <StandingsTable> (pos badges, form, qual zone)
    ├── Players ───────── <SearchFilter> <PlayerCard×n> (tier from lpRating.tier)
    ├── PlayerProfile ─── <RatingHero> <KpiGrid> <StatBars> <FranchiseLink>
    ├── FranchiseHub ──── <LiveryHero> <SquadGrid> <ScheduleMixed>
    ├── Rankings ──────── <PowerBoard> | <MvpBoard> | <LpBoard>
    ├── NewsCentre ────── <TagTabs> <NewsCard×n>
    ├── SponsorCentre ─── <TierCards> <PartnerGrid> <PartnerCTA>
    └── Dashboards
        ├── AdminDashboard ──────── <ScoringConsole> (big-button, undo, TB-aware)
        ├── CaptainDashboard ────── <PairSelector> <AvailabilityList>
        ├── CommissionerDashboard ─ <KpiGrid> <OpsQueue> <ResultApprovals> <FormatGovernance>
        └── SponsorAnalytics ────── <KpiGrid> <ImpressionsChart> <PlacementMix> <ReportExport>
```

Hooks: `useLiveMatch(matchId)` — single subscription point for all live UI.
Libs: `scoringEngine` (pure reducer), `lpRating` (Elo), `supabase` (data layer + demo fallback).

## 4. Realtime scoring engine

**Server-authoritative, event-sourced, deterministic.**

```
Umpire tap (+point)
   │ insert match_events (match_id, seq, {winner})        ← append-only audit log
   ▼
Edge Function `lp-score` (DB webhook on match_events)
   │ replays event log through the SAME reducer used client-side
   │ writes matches.live_state (jsonb) + status
   ▼
Supabase Realtime (postgres_changes on matches)
   ▼
Every viewer: ticker, match page, home cards re-render — one UPDATE, all clients.
```

- **One reducer, everywhere.** `scoringEngine.js` is pure `state + event → state`; the umpire console, Edge Function, and viewers all run identical logic. Determinism = perfect sync, and **undo** is simply "delete last event, replay".
- **Official LP format is encoded in the engine**: sets 1–2 to 6 games, 7-point tiebreak at 6–6 (win by 2); **set 3 is always a 10-point match tiebreaker, win by 2**; golden point at deuce (configurable per season via `seasons.rules`).
- `match_events` doubles as the analytics source: momentum strips, points-won splits, tiebreak records, clutch stats.
- Demo mode: with no `VITE_SUPABASE_URL`, the same engine runs a local simulation loop, so the whole platform demos offline.

## 5. LP Rating (the league's number)

Doubles-adapted Elo (`src/lib/lpRating.js`):
- Pair rating = mean of both players; expected score = standard Elo curve (÷400).
- K = 32, ×1.15 for straight-sets wins, ×0.85 when decided by the match tiebreak.
- Both players in a pair receive the full delta — padel is won as a pair.
- New players: 1400 start, K doubled for first 5 matches (provisional).
- Tiers for the UI: Rising < 1350 ≤ Contender < 1450 ≤ Advanced < 1550 ≤ Pro < 1700 ≤ Elite.
- Every change written to `rating_history` → profile sparklines, "biggest climbers" editorial.

## 6. Standings & MVP

- `lp_standings` SQL view aggregates final matches → never drifts, always realtime-fresh. Win = 3 pts; tie-break: set diff, then game diff.
- MVP points (in `mvp_points`, awarded by trigger/Edge Function on final): **3** per match win, **1** per set won, **2** bonus for winning a deciding match tiebreak.
- Power Rankings are deliberately editorial (commissioner-published weekly) — a recurring content event, not a formula.

## 7. Sponsor exposure & analytics

- `SponsorRail` renders on Home, Match pages, Standings; every render logs to `sponsor_impressions`, every tap to `sponsor_clicks` (placement-tagged).
- Sponsor role (RLS-scoped) sees only their own data in `/sponsor-analytics`: impressions trend (matchnight spikes), CTR, placement mix, season-to-date report export.
- This converts "logo on a poster" into **measured media** — the core of the commercial pitch.

## 8. Monetisation

| Stream | Mechanism | Where |
|---|---|---|
| Sponsor tiers | Title / Gold R25k / Silver R12.5k / Community R5k per season, sold on measured exposure | Sponsor Centre + Analytics |
| Franchise fees & auction | Season auction (existing LP auction engine plugs in), franchise licensing | Commissioner dashboard |
| Player registration | Season registration via platform; payment link (PayFast/Yoco) at signup | Registration flow (Phase 2) |
| Matchnight commerce | Sponsor-funded "Player of the Night" votes, courtside F&B partner placements | Live Match Centre |
| Premium stats (later) | LP Rating history, advanced pair analytics behind player login | Player profiles |

## 9. Security model (RLS summary)

| Role | Can |
|---|---|
| Public/anon | Read everything published; write impressions/clicks only |
| Player | Above + own profile |
| Captain | Submit team sheets & availability for own franchise |
| Umpire | Insert match_events, update matches |
| Commissioner | Fixtures, results approval, news, power rankings |
| Sponsor | Read own exposure data only |
| Admin | Full ops |

## 10. Rollout

1. **Phase 1 (this repo):** deploy to Vercel in demo mode — full UX live immediately at lowveldpadel.co.za.
2. **Phase 2:** provision Supabase, run `supabase/schema.sql`, set `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`, deploy `lp-score` Edge Function, migrate Season 3 squads/fixtures from the existing registration sheet.
3. **Phase 3:** auth flows (captain/umpire/commissioner invites), push notifications (match start, set won, final), Player of the Night voting.
4. **Phase 4:** Season 4 auction module integration, premium stats, ladies/mens Finals Night live hub.
