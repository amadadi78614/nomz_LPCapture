-- Lowveld Padel public registration intake.
-- Public clients submit through the submit-registration Edge Function only.

create extension if not exists pgcrypto;

create table if not exists public.app_registrations (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  event_code text not null check (event_code in ('kruger-cup-2026', 'ubuntu-challenge-01')),
  registration_type text not null check (registration_type in ('pair', 'individual')),
  division text,
  pair_name text,
  participants jsonb not null,
  primary_name text not null,
  primary_email text,
  primary_mobile text not null,
  is_minor boolean not null default false,
  popia_consent boolean not null,
  rules_accepted boolean not null default false,
  registration_status text not null default 'pending_review'
    check (registration_status in ('pending_review','approved','waitlisted','declined','cancelled')),
  payment_status text not null default 'pending'
    check (payment_status in ('pending','proof_uploaded','paid','failed','refunded','waived')),
  payment_amount_cents integer not null default 0 check (payment_amount_cents >= 0),
  source text not null default 'website',
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (jsonb_typeof(participants) = 'array'),
  check (jsonb_array_length(participants) between 1 and 2),
  check (popia_consent),
  check (event_code <> 'kruger-cup-2026' or rules_accepted),
  check (event_code <> 'kruger-cup-2026' or payment_amount_cents = 80000)
);

create index if not exists app_registrations_event_status_idx
  on public.app_registrations(event_code, registration_status, submitted_at desc);
create index if not exists app_registrations_payment_status_idx
  on public.app_registrations(payment_status, submitted_at desc);

alter table public.app_registrations enable row level security;
revoke all on public.app_registrations from anon, authenticated;

comment on table public.app_registrations is
  'Private registration intake. Only trusted server code and authorised admin tooling may access rows.';
