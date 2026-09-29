alter table public.app_registrations add column if not exists deleted_at timestamptz;
grant update (deleted_at) on public.app_registrations to authenticated;
