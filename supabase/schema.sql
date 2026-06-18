-- ============================================================
-- LOWVELD PADEL PLATFORM — SUPABASE SCHEMA (Season 3+)
-- Postgres 15 · Run in SQL editor or supabase db push
-- ============================================================

-- ---------- ENUMS ----------
create type league_t as enum ('mens', 'ladies');
create type match_status_t as enum ('scheduled', 'live', 'suspended', 'final', 'walkover');
create type role_t as enum ('fan', 'player', 'captain', 'owner', 'umpire', 'commissioner', 'admin', 'sponsor');
create type sponsor_tier_t as enum ('title', 'gold', 'silver', 'community');
create type news_status_t as enum ('draft', 'published');

-- ---------- IDENTITY & ROLES ----------
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text not null,
  phone text,
  avatar_url text,
  created_at timestamptz default now()
);

create table user_roles (
  user_id uuid references profiles on delete cascade,
  role role_t not null,
  franchise_id text,                 -- scoped roles: captain/owner of a franchise, sponsor of a sponsor_id
  sponsor_id uuid,
  primary key (user_id, role, coalesce(franchise_id, ''), coalesce(sponsor_id, '00000000-0000-0000-0000-000000000000'::uuid))
);

create or replace function lp_has_role(p_role role_t) returns boolean
language sql stable security definer as $$
  select exists (select 1 from user_roles where user_id = auth.uid() and role = p_role);
$$;

-- ---------- LEAGUE STRUCTURE ----------
create table seasons (
  id text primary key,               -- 's3'
  name text not null,
  year int not null,
  status text not null default 'active',
  rules jsonb not null default '{
    "set_games": 6, "set_tb_at": 6, "set_tb_to": 7,
    "third_set": "match_tiebreak_10", "win_by": 2,
    "golden_point": true, "league_points_win": 3
  }'::jsonb
);

create table franchises (
  id text primary key,               -- slug: 'sonic-viboras'
  name text not null,
  league league_t not null,
  logo_url text,
  livery_hex text,                   -- F1-style stripe colour
  owner_profile_id uuid references profiles,
  venue text default 'Mbombela Padel Club',
  founded int,
  bio text
);

create table players (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles,
  display_name text not null,
  league league_t not null,
  lp_rating int not null default 1400,
  matches_played int not null default 0,
  created_at timestamptz default now()
);

create table franchise_players (        -- season contracts (auction outcomes)
  season_id text references seasons,
  franchise_id text references franchises,
  player_id uuid references players,
  is_captain boolean default false,
  auction_price numeric(10,2),
  primary key (season_id, franchise_id, player_id)
);

-- ---------- FIXTURES & MATCHES ----------
create table fixtures (                  -- a tie between two franchises on a matchnight
  id uuid primary key default gen_random_uuid(),
  season_id text references seasons not null,
  league league_t not null,
  round int not null,
  home_franchise text references franchises not null,
  away_franchise text references franchises not null,
  court text,
  starts_at timestamptz not null,
  status match_status_t not null default 'scheduled'
);

create table matches (                   -- a doubles rubber within a fixture
  id uuid primary key default gen_random_uuid(),
  fixture_id uuid references fixtures on delete cascade not null,
  rubber_no int not null default 1,
  home_pair uuid[] not null,             -- [player_id, player_id]
  away_pair uuid[] not null,
  status match_status_t not null default 'scheduled',
  live_state jsonb,                      -- denormalised engine state — REALTIME PAYLOAD
  final_sets jsonb,                      -- [[6,4],[3,6],[10,7]]
  winner text check (winner in ('home','away')),
  started_at timestamptz,
  ended_at timestamptz
);
alter publication supabase_realtime add table matches;

create table match_events (              -- append-only point log (audit / undo / analytics)
  id bigint generated always as identity primary key,
  match_id uuid references matches on delete cascade not null,
  seq int not null,
  event_type text not null default 'point',  -- point | undo | suspend | resume | walkover
  payload jsonb not null,                    -- { "winner": "home" }
  recorded_by uuid references profiles,
  created_at timestamptz default now(),
  unique (match_id, seq)
);
alter publication supabase_realtime add table match_events;

-- ---------- RATINGS ----------
create table rating_history (
  id bigint generated always as identity primary key,
  player_id uuid references players not null,
  match_id uuid references matches not null,
  rating_before int not null,
  delta int not null,
  rating_after int not null,
  created_at timestamptz default now()
);

-- ---------- CONTENT ----------
create table news_articles (
  id uuid primary key default gen_random_uuid(),
  kicker text, title text not null, body text not null,
  tag text, hero_url text,
  status news_status_t default 'draft',
  author_id uuid references profiles,
  published_at timestamptz
);

-- ---------- SPONSORS & EXPOSURE ----------
create table sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tier sponsor_tier_t not null,
  logo_url text, url text, blurb text,
  contract_start date, contract_end date, fee numeric(12,2),
  active boolean default true
);

create table sponsor_impressions (
  id bigint generated always as identity primary key,
  sponsor_id uuid references sponsors not null,
  placement text not null,                -- home_rail | match_rail | standings | news
  session_id text,
  created_at timestamptz default now()
);
create index on sponsor_impressions (sponsor_id, created_at);

create table sponsor_clicks (
  id bigint generated always as identity primary key,
  sponsor_id uuid references sponsors not null,
  placement text not null,
  session_id text,
  created_at timestamptz default now()
);

-- ---------- MVP & POWER RANKINGS ----------
create table mvp_points (
  id bigint generated always as identity primary key,
  player_id uuid references players not null,
  match_id uuid references matches not null,
  points int not null,                    -- 3 win, 1 per set, 2 deciding-TB bonus
  reason text,
  created_at timestamptz default now()
);

create table power_rankings (
  season_id text references seasons,
  league league_t,
  week int,
  rank int,
  franchise_id text references franchises,
  movement int default 0,
  note text,
  primary key (season_id, league, week, rank)
);

-- ============================================================
-- VIEWS — standings, leaderboards (always fresh, zero drift)
-- ============================================================
create or replace view lp_standings as
with results as (
  select f.season_id, f.league,
         f.home_franchise as franchise_id,
         case when m.winner = 'home' then 1 else 0 end as won,
         (select coalesce(sum((s->>0)::int > (s->>1)::int)::int, 0) from jsonb_array_elements(m.final_sets) s) as sets_for,
         (select coalesce(sum((s->>1)::int > (s->>0)::int)::int, 0) from jsonb_array_elements(m.final_sets) s) as sets_against,
         (select coalesce(sum((s->>0)::int), 0) from jsonb_array_elements(m.final_sets) s) as games_for,
         (select coalesce(sum((s->>1)::int), 0) from jsonb_array_elements(m.final_sets) s) as games_against
  from matches m join fixtures f on f.id = m.fixture_id
  where m.status = 'final'
  union all
  select f.season_id, f.league, f.away_franchise,
         case when m.winner = 'away' then 1 else 0 end,
         (select coalesce(sum((s->>1)::int > (s->>0)::int)::int, 0) from jsonb_array_elements(m.final_sets) s),
         (select coalesce(sum((s->>0)::int > (s->>1)::int)::int, 0) from jsonb_array_elements(m.final_sets) s),
         (select coalesce(sum((s->>1)::int), 0) from jsonb_array_elements(m.final_sets) s),
         (select coalesce(sum((s->>0)::int), 0) from jsonb_array_elements(m.final_sets) s)
  from matches m join fixtures f on f.id = m.fixture_id
  where m.status = 'final'
)
select season_id, league, franchise_id,
       count(*) as played, sum(won) as won, count(*) - sum(won) as lost,
       sum(sets_for) as sets_for, sum(sets_against) as sets_against,
       sum(games_for) as games_for, sum(games_against) as games_against,
       sum(won) * 3 as points
from results
group by season_id, league, franchise_id
order by points desc, (sum(sets_for) - sum(sets_against)) desc, (sum(games_for) - sum(games_against)) desc;

create or replace view lp_mvp_leaderboard as
select p.id, p.display_name, p.league, sum(mp.points) as mvp_points
from mvp_points mp join players p on p.id = mp.player_id
group by p.id, p.display_name, p.league
order by mvp_points desc;

-- ============================================================
-- RPCs — server-authoritative scoring
-- ============================================================
-- Record a point: insert event with next seq; an Edge Function
-- ('lp-score') replays the event log through the SAME reducer
-- as the client (shared JS) and writes matches.live_state, so
-- every viewer gets the new state via realtime in one UPDATE.
create or replace function lp_next_seq(p_match_id uuid) returns int
language sql as $$
  select coalesce(max(seq), 0) + 1 from match_events where match_id = p_match_id;
$$;

create or replace function lp_undo_last_point(p_match_id uuid) returns void
language plpgsql security definer as $$
begin
  if not (lp_has_role('umpire') or lp_has_role('admin') or lp_has_role('commissioner')) then
    raise exception 'not authorised';
  end if;
  delete from match_events
  where id = (select id from match_events where match_id = p_match_id and event_type = 'point'
              order by seq desc limit 1);
  -- Edge Function 'lp-score' is triggered by webhook to replay & rewrite live_state.
end $$;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table profiles enable row level security;
alter table user_roles enable row level security;
alter table franchises enable row level security;
alter table players enable row level security;
alter table franchise_players enable row level security;
alter table fixtures enable row level security;
alter table matches enable row level security;
alter table match_events enable row level security;
alter table rating_history enable row level security;
alter table news_articles enable row level security;
alter table sponsors enable row level security;
alter table sponsor_impressions enable row level security;
alter table sponsor_clicks enable row level security;
alter table mvp_points enable row level security;
alter table power_rankings enable row level security;
alter table seasons enable row level security;

-- Public read of all league content (it IS the product)
create policy "public read" on seasons for select using (true);
create policy "public read" on franchises for select using (true);
create policy "public read" on players for select using (true);
create policy "public read" on franchise_players for select using (true);
create policy "public read" on fixtures for select using (true);
create policy "public read" on matches for select using (true);
create policy "public read" on match_events for select using (true);
create policy "public read" on rating_history for select using (true);
create policy "public read" on mvp_points for select using (true);
create policy "public read" on power_rankings for select using (true);
create policy "published news" on news_articles for select using (status = 'published' or lp_has_role('admin') or lp_has_role('commissioner'));
create policy "active sponsors" on sponsors for select using (active = true or lp_has_role('admin'));

-- Profiles: self + admins
create policy "own profile" on profiles for select using (id = auth.uid() or lp_has_role('admin'));
create policy "update own" on profiles for update using (id = auth.uid());
create policy "own roles" on user_roles for select using (user_id = auth.uid() or lp_has_role('admin'));

-- Scoring: umpires/admins only
create policy "umpire score" on match_events for insert
  with check (lp_has_role('umpire') or lp_has_role('admin') or lp_has_role('commissioner'));
create policy "ops update matches" on matches for update
  using (lp_has_role('umpire') or lp_has_role('admin') or lp_has_role('commissioner'));

-- League ops: commissioner/admin
create policy "ops fixtures" on fixtures for all
  using (lp_has_role('commissioner') or lp_has_role('admin'));
create policy "ops news" on news_articles for all
  using (lp_has_role('commissioner') or lp_has_role('admin'));
create policy "ops power" on power_rankings for all
  using (lp_has_role('commissioner') or lp_has_role('admin'));
create policy "ops sponsors" on sponsors for all using (lp_has_role('admin'));

-- Exposure tracking: anyone can write (anon analytics), sponsors read own
create policy "track imp" on sponsor_impressions for insert with check (true);
create policy "track clk" on sponsor_clicks for insert with check (true);
create policy "sponsor reads own imp" on sponsor_impressions for select
  using (lp_has_role('admin') or lp_has_role('commissioner')
         or exists (select 1 from user_roles ur where ur.user_id = auth.uid() and ur.role = 'sponsor' and ur.sponsor_id = sponsor_impressions.sponsor_id));
create policy "sponsor reads own clk" on sponsor_clicks for select
  using (lp_has_role('admin') or lp_has_role('commissioner')
         or exists (select 1 from user_roles ur where ur.user_id = auth.uid() and ur.role = 'sponsor' and ur.sponsor_id = sponsor_clicks.sponsor_id));
