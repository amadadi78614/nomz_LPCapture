drop policy catalog_public on public.lp_catalog;
create policy catalog_public on public.lp_catalog for select to anon,authenticated using(published);
create policy catalog_admin_read on public.lp_catalog for select to authenticated using(exists(select 1 from public.app_admin_users a where a.user_id=(select auth.uid()) and a.access_level='admin'));
