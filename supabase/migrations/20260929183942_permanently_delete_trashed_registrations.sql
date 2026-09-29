grant delete on public.app_registrations to authenticated;
create policy "admins permanently delete trashed registrations"
on public.app_registrations for delete to authenticated
using (deleted_at is not null
  and lower((select auth.jwt()) ->> 'email') = 'admin@lowveldpadel.co.za'
  and exists (
  select 1 from public.app_admin_users a
  where a.user_id = (select auth.uid()) and a.access_level = 'admin'
    and lower(a.email) = 'admin@lowveldpadel.co.za'
));
