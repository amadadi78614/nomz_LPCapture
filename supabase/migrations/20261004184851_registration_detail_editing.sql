-- Existing admin UPDATE RLS continues to enforce allowlist membership and admin access.
grant update (participants,pair_name,division,primary_name,primary_email,primary_mobile,is_minor) on public.app_registrations to authenticated;
