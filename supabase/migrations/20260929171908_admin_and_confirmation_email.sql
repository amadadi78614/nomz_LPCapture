-- Authenticated access for the private LP registration dashboard.
-- The first administrator is provisioned separately after their email is confirmed.

create table if not exists public.app_admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  access_level text not null default 'admin' check (access_level in ('viewer','admin')),
  created_at timestamptz not null default now()
);

alter table public.app_admin_users enable row level security;
revoke all on public.app_admin_users from anon, authenticated;
grant select on public.app_admin_users to authenticated;
create policy "admins read own access" on public.app_admin_users for select to authenticated
  using ((select auth.uid()) = user_id);

alter table public.app_registrations
  add column if not exists confirmation_email_status text not null default 'not_sent'
    check (confirmation_email_status in ('not_sent','sent','failed','not_applicable')),
  add column if not exists confirmation_email_sent_at timestamptz,
  add column if not exists confirmation_email_error text;

grant select on public.app_registrations to authenticated;
grant update (registration_status, payment_status, updated_at) on public.app_registrations to authenticated;

create policy "admins read registrations" on public.app_registrations for select to authenticated
  using (exists (
    select 1 from public.app_admin_users a where a.user_id = (select auth.uid())
  ));

create policy "admins update registrations" on public.app_registrations for update to authenticated
  using (exists (
    select 1 from public.app_admin_users a
    where a.user_id = (select auth.uid()) and a.access_level = 'admin'
  ))
  with check (exists (
    select 1 from public.app_admin_users a
    where a.user_id = (select auth.uid()) and a.access_level = 'admin'
  ));
