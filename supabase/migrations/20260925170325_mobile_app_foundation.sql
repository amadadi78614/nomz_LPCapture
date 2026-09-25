-- Lowveld Padel mobile foundation.
-- This migration intentionally uses app_* tables so it can coexist with the
-- current website schema while data is migrated and verified.

create extension if not exists pgcrypto;
create schema if not exists private;

create table public.app_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  phone text,
  avatar_url text,
  linked_player_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.app_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('player','captain','umpire','commissioner','admin')),
  team_id text,
  created_at timestamptz not null default now()
);
create unique index app_roles_unique_scope
  on public.app_roles (user_id, role, coalesce(team_id, ''));
create index app_roles_user_idx on public.app_roles(user_id);

create table public.app_competitions (
  id text primary key,
  name text not null,
  category text not null check (category in ('ladies','mens','legacy','supercup','event')),
  season_label text not null,
  status text not null check (status in ('draft','registration','active','playoffs','complete','archived')),
  is_current boolean not null default false,
  rules jsonb not null default '{}'::jsonb,
  starts_on date,
  ends_on date,
  created_at timestamptz not null default now()
);
create unique index app_one_current_competition
  on public.app_competitions(is_current) where is_current;

create table public.app_teams (
  id text primary key,
  name text not null,
  short_name text,
  logo_url text,
  primary_color text,
  secondary_color text,
  active boolean not null default true
);

create table public.app_competition_teams (
  competition_id text not null references public.app_competitions(id) on delete cascade,
  team_id text not null references public.app_teams(id),
  position int,
  played int not null default 0,
  won int not null default 0,
  lost int not null default 0,
  points int not null default 0,
  points_for int not null default 0,
  points_against int not null default 0,
  sets_for int not null default 0,
  sets_against int not null default 0,
  qualified boolean not null default false,
  primary key (competition_id, team_id)
);

create table public.app_fixtures (
  id uuid primary key default gen_random_uuid(),
  competition_id text not null references public.app_competitions(id) on delete cascade,
  stage text not null default 'regular',
  round_label text,
  home_team_id text not null references public.app_teams(id),
  away_team_id text not null references public.app_teams(id),
  venue text,
  starts_at timestamptz,
  status text not null default 'scheduled' check (status in ('scheduled','live','final','postponed','cancelled')),
  home_points int,
  away_points int,
  verified_by uuid references auth.users(id),
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  check (home_team_id <> away_team_id)
);
create index app_fixtures_competition_start_idx
  on public.app_fixtures(competition_id, starts_at desc);

create table public.app_news (
  id uuid primary key default gen_random_uuid(),
  competition_id text references public.app_competitions(id) on delete set null,
  kicker text,
  title text not null,
  summary text not null,
  body text,
  hero_url text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  published_at timestamptz,
  author_id uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table public.app_player_availability (
  fixture_id uuid not null references public.app_fixtures(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null check (status in ('available','unavailable','unsure')),
  note text,
  updated_at timestamptz not null default now(),
  primary key (fixture_id, user_id)
);

create or replace function private.app_has_role(requested_role text, requested_team text default null)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select (select auth.uid()) is not null and exists (
    select 1 from public.app_roles r
    where r.user_id = (select auth.uid())
      and r.role = requested_role
      and (requested_team is null or r.team_id = requested_team)
  );
$$;
revoke all on function private.app_has_role(text, text) from public;
grant usage on schema private to authenticated;
grant execute on function private.app_has_role(text, text) to authenticated;

alter table public.app_profiles enable row level security;
alter table public.app_roles enable row level security;
alter table public.app_competitions enable row level security;
alter table public.app_teams enable row level security;
alter table public.app_competition_teams enable row level security;
alter table public.app_fixtures enable row level security;
alter table public.app_news enable row level security;
alter table public.app_player_availability enable row level security;

revoke all on public.app_profiles, public.app_roles, public.app_competitions,
  public.app_teams, public.app_competition_teams, public.app_fixtures,
  public.app_news, public.app_player_availability from anon, authenticated;

grant select on public.app_competitions, public.app_teams,
  public.app_competition_teams, public.app_fixtures, public.app_news to anon, authenticated;
grant select, insert, update on public.app_profiles to authenticated;
grant select on public.app_roles to authenticated;
grant select, insert, update on public.app_player_availability to authenticated;
grant insert, update on public.app_fixtures to authenticated;
grant insert, update on public.app_news to authenticated;

create policy "public competitions" on public.app_competitions for select
  to anon, authenticated using (status <> 'draft');
create policy "public teams" on public.app_teams for select
  to anon, authenticated using (active);
create policy "public competition standings" on public.app_competition_teams for select
  to anon, authenticated using (true);
create policy "public fixtures" on public.app_fixtures for select
  to anon, authenticated using (true);
create policy "published news" on public.app_news for select
  to anon, authenticated using (status = 'published');

create policy "read own profile" on public.app_profiles for select
  to authenticated using ((select auth.uid()) = user_id or private.app_has_role('admin'));
create policy "create own profile" on public.app_profiles for insert
  to authenticated with check ((select auth.uid()) = user_id);
create policy "update own profile" on public.app_profiles for update
  to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "read own roles" on public.app_roles for select
  to authenticated using ((select auth.uid()) = user_id or private.app_has_role('admin'));

create policy "ops create fixtures" on public.app_fixtures for insert
  to authenticated with check (private.app_has_role('commissioner') or private.app_has_role('admin'));
create policy "ops update fixtures" on public.app_fixtures for update
  to authenticated using (private.app_has_role('commissioner') or private.app_has_role('admin'))
  with check (private.app_has_role('commissioner') or private.app_has_role('admin'));
create policy "ops create news" on public.app_news for insert
  to authenticated with check (private.app_has_role('commissioner') or private.app_has_role('admin'));
create policy "ops update news" on public.app_news for update
  to authenticated using (private.app_has_role('commissioner') or private.app_has_role('admin'))
  with check (private.app_has_role('commissioner') or private.app_has_role('admin'));

create policy "read own availability" on public.app_player_availability for select
  to authenticated using (
    (select auth.uid()) = user_id or private.app_has_role('commissioner') or
    private.app_has_role('admin') or private.app_has_role('captain')
  );
create policy "create own availability" on public.app_player_availability for insert
  to authenticated with check ((select auth.uid()) = user_id);
create policy "update own availability" on public.app_player_availability for update
  to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

insert into public.app_competitions (id, name, category, season_label, status, is_current, rules, starts_on)
values ('ladies-s2-2026', 'Ladies Franchise League', 'ladies', 'Season 2 · 2026', 'playoffs', true,
  '{"qualification_places":4,"tiebreakers":["points","set_difference","game_difference","head_to_head"]}'::jsonb,
  '2026-08-19');

insert into public.app_teams (id, name, short_name, primary_color) values
  ('backhand-blossoms','Backhand Blossoms','Blossoms','#23c98b'),
  ('lunar-lillies','Lunar Lillies','Lillies','#637dff'),
  ('phoenix-flames','Phoenix Flames','Flames','#ff704c'),
  ('net-novas','Net Novas','Novas','#5da9ff'),
  ('arctic-angels','Arctic Angels','Angels','#62e8ff'),
  ('desert-roses','Desert Roses','Roses','#ed6a9e');

insert into public.app_competition_teams
  (competition_id, team_id, position, played, won, lost, points, qualified)
values
  ('ladies-s2-2026','backhand-blossoms',1,5,4,1,53,true),
  ('ladies-s2-2026','lunar-lillies',2,5,3,2,44,true),
  ('ladies-s2-2026','phoenix-flames',3,5,4,1,39,true),
  ('ladies-s2-2026','net-novas',4,5,3,2,35,true),
  ('ladies-s2-2026','arctic-angels',5,5,2,3,31,false),
  ('ladies-s2-2026','desert-roses',6,5,0,5,14,false);
