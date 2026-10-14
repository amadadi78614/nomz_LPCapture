alter table public.lp_catalog drop constraint lp_catalog_check;
alter table public.lp_catalog add constraint lp_catalog_publish_ready check(not published or (price_cents is not null and price_cents>0 and capacity>0 and (kind='product' or (event_at is not null and length(coalesce(venue,''))>2 and length(rules)>5))));
create or replace function public.lp_settle_order(p_id uuid,p_amount integer,p_pf text default null,p_admin uuid default null,p_note text default null) returns text language plpgsql security invoker set search_path='' as $$
declare o public.lp_orders; result text;
begin
 perform id from public.lp_catalog where id in(select catalog_id from public.lp_order_items where order_id=p_id) order by id for update;
 select * into o from public.lp_orders where id=p_id for update;
 if not found or o.total_cents<>p_amount then raise exception 'Order or amount mismatch'; end if;
 if p_admin is not null and not exists(select 1 from public.app_admin_users where user_id=p_admin and access_level='admin') then raise exception 'Admin access required'; end if;
 if p_admin is null and (p_pf is null or o.method<>'payfast') then raise exception 'Payment verification required'; end if;
 if p_admin is not null and o.method<>'eft' then raise exception 'Only EFT can be manually verified'; end if;
 if o.status in ('paid','payment_review') then
  if p_pf is not null and o.pf_payment_id is distinct from p_pf then raise exception 'Different payment already recorded'; end if;
  return o.status;
 end if;
 result:=case when o.status='pending' and o.expires_at>clock_timestamp() then 'paid' else 'payment_review' end;
 update public.lp_orders set status=result,paid_at=now(),pf_payment_id=p_pf,verified_by=p_admin,payment_note=p_note where id=p_id;
 return result;
end $$;
