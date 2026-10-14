create table public.lp_catalog (
 id uuid primary key default gen_random_uuid(), slug text unique not null,
 title text not null check(length(title) between 3 and 160), kind text not null check(kind in ('event','product')),
 description text not null default '', price_cents integer check(price_cents>0),
 capacity integer not null default 0 check(capacity>=0), published boolean not null default false,
 event_at timestamptz, venue text, entry_type text not null default 'individual' check(entry_type in ('individual','pair','youth','product')),
 divisions text[] not null default '{}', rules text not null default '', image_url text,
 fulfilment text not null default 'Collection arrangements TBC',
 created_at timestamptz not null default now(),
 check(not published or (price_cents>0 and capacity>0 and (kind='product' or (event_at is not null and length(coalesce(venue,''))>2 and length(rules)>5))))
);
create table public.lp_orders (
 id uuid primary key default gen_random_uuid(), reference text unique not null,
 token_hash text unique not null, request_key uuid unique not null,
 customer_name text not null, email text not null, mobile text not null,
 total_cents integer not null check(total_cents>0), method text not null check(method in ('eft','payfast')),
 status text not null default 'pending' check(status in ('pending','paid','expired','payment_review','cancelled')),
 expires_at timestamptz not null, paid_at timestamptz, pf_payment_id text unique,
 payment_note text, verified_by uuid, email_status text not null default 'not_sent',
 created_at timestamptz not null default now()
);
create table public.lp_order_items (
 id uuid primary key default gen_random_uuid(), order_id uuid not null references public.lp_orders(id),
 catalog_id uuid not null references public.lp_catalog(id), title text not null, kind text not null,
 quantity integer not null check(quantity between 1 and 20), unit_cents integer not null check(unit_cents>0),
 details jsonb not null default '{}', fulfilment_status text not null default 'pending' check(fulfilment_status in ('pending','confirmed','ready','dispatched','completed','cancelled'))
);
create index lp_order_items_catalog on public.lp_order_items(catalog_id,order_id);
create index lp_order_items_order on public.lp_order_items(order_id);
create index lp_orders_status on public.lp_orders(status,expires_at);
create table public.lp_checkout_limits (bucket text primary key, attempts integer not null, expires_at timestamptz not null);
alter table public.lp_catalog enable row level security;
alter table public.lp_orders enable row level security;
alter table public.lp_order_items enable row level security;
alter table public.lp_checkout_limits enable row level security;
revoke all on public.lp_catalog,public.lp_orders,public.lp_order_items,public.lp_checkout_limits from anon,authenticated;
grant select on public.lp_catalog to anon,authenticated;
grant insert,update on public.lp_catalog to authenticated;
grant select on public.lp_orders,public.lp_order_items to authenticated;
grant all on public.lp_catalog,public.lp_orders,public.lp_order_items,public.lp_checkout_limits to service_role;
create policy catalog_public on public.lp_catalog for select to anon,authenticated using(published or exists(select 1 from public.app_admin_users a where a.user_id=(select auth.uid()) and a.access_level='admin'));
create policy catalog_admin_insert on public.lp_catalog for insert to authenticated with check(exists(select 1 from public.app_admin_users a where a.user_id=(select auth.uid()) and a.access_level='admin'));
create policy catalog_admin_update on public.lp_catalog for update to authenticated using(exists(select 1 from public.app_admin_users a where a.user_id=(select auth.uid()) and a.access_level='admin')) with check(exists(select 1 from public.app_admin_users a where a.user_id=(select auth.uid()) and a.access_level='admin'));
create policy orders_admin_read on public.lp_orders for select to authenticated using(exists(select 1 from public.app_admin_users a where a.user_id=(select auth.uid()) and a.access_level='admin'));
create policy items_admin_read on public.lp_order_items for select to authenticated using(exists(select 1 from public.app_admin_users a where a.user_id=(select auth.uid()) and a.access_level='admin'));

create function public.lp_checkout_limit(p_bucket text) returns boolean language plpgsql security invoker set search_path='' as $$
declare n integer;
begin
 insert into public.lp_checkout_limits(bucket,attempts,expires_at) values(p_bucket,1,now()+interval '1 hour')
 on conflict(bucket) do update set attempts=case when lp_checkout_limits.expires_at<now() then 1 else lp_checkout_limits.attempts+1 end,
 expires_at=case when lp_checkout_limits.expires_at<now() then now()+interval '1 hour' else lp_checkout_limits.expires_at end returning attempts into n;
 return n<=15;
end $$;

create function public.lp_create_order(p_request uuid,p_hash text,p_customer jsonb,p_method text,p_items jsonb) returns jsonb language plpgsql security invoker set search_path='' as $$
declare o public.lp_orders; c public.lp_catalog; line jsonb; q integer; used integer; total integer:=0; count_lines integer:=0; expected integer;
begin
 perform pg_advisory_xact_lock(hashtextextended(p_request::text,0));
 select * into o from public.lp_orders where request_key=p_request;
 if found then
  if o.token_hash<>p_hash then raise exception 'Order retry token does not match'; end if;
  return jsonb_build_object('id',o.id,'reference',o.reference,'total_cents',o.total_cents,'status',o.status,'expires_at',o.expires_at);
 end if;
 if p_method not in ('eft','payfast') or jsonb_typeof(p_items)<>'array' or jsonb_array_length(p_items) not between 1 and 20 then raise exception 'Invalid checkout'; end if;
 if length(coalesce(p_customer->>'name',''))<2 or coalesce(p_customer->>'email','') !~ '^[^ @]+@[^ @]+\.[^ @]+$' or length(coalesce(p_customer->>'mobile',''))<8 then raise exception 'Complete your contact details'; end if;
 -- Deterministic locks serialize all reservations touching the same catalogue rows.
 perform id from public.lp_catalog where id in (select (value->>'id')::uuid from jsonb_array_elements(p_items)) order by id for update;
 for line in select value from jsonb_array_elements(p_items) loop
  select * into c from public.lp_catalog where id=(line->>'id')::uuid;
  if not found or not c.published or c.price_cents is null or (c.kind='event' and (c.event_at is null or c.event_at<=now())) then raise exception 'An item is no longer available for checkout'; end if;
  q:=(line->>'quantity')::integer;
  if q is null or q<1 or q>20 or (c.kind='event' and q<>1) then raise exception 'Invalid quantity'; end if;
  if c.kind='event' then
   expected:=case when c.entry_type='pair' then 2 else 1 end;
   if jsonb_array_length(coalesce(line->'details'->'participants','[]'))<>expected or coalesce(line->'details'->>'rulesAccepted','false')<>'true' then raise exception 'Complete each event registration and accept its rules'; end if;
   if cardinality(c.divisions)>0 and not(coalesce(line->'details'->>'division','')=any(c.divisions)) then raise exception 'Choose a valid division'; end if;
   if exists(select 1 from jsonb_array_elements(line->'details'->'participants') p where length(coalesce(p->>'name',''))<2 or length(coalesce(p->>'level',''))<1 or coalesce(p->>'dob','') !~ '^\d{4}-\d{2}-\d{2}$') then raise exception 'Complete participant details'; end if;
   if c.entry_type='youth' or exists(select 1 from jsonb_array_elements(line->'details'->'participants') p where (p->>'dob')::date>current_date-interval '18 years') then
    if length(coalesce(line->'details'->>'guardianName',''))<2 or length(coalesce(line->'details'->>'guardianMobile',''))<8 or coalesce(line->'details'->>'guardianConsent','false')<>'true' then raise exception 'Guardian details and consent are required'; end if;
   end if;
  end if;
  total:=total+c.price_cents*q; count_lines:=count_lines+1;
 end loop;
 if total>20000000 then raise exception 'Order exceeds online checkout limit'; end if;
 -- Aggregate repeated product/event lines before checking availability.
 for c in select * from public.lp_catalog where id in(select (value->>'id')::uuid from jsonb_array_elements(p_items)) loop
  select coalesce(sum(i.quantity),0) into used from public.lp_order_items i join public.lp_orders r on r.id=i.order_id where i.catalog_id=c.id and (r.status='paid' or (r.status='pending' and r.expires_at>now()));
  select sum((value->>'quantity')::integer) into q from jsonb_array_elements(p_items) where (value->>'id')::uuid=c.id;
  if used+q>c.capacity then raise exception 'Insufficient stock or event places for %',c.title; end if;
 end loop;
 insert into public.lp_orders(reference,token_hash,request_key,customer_name,email,mobile,total_cents,method,expires_at)
 values('LP-'||upper(substr(replace(gen_random_uuid()::text,'-',''),1,12)),p_hash,p_request,p_customer->>'name',lower(p_customer->>'email'),p_customer->>'mobile',total,p_method,now()+case when p_method='eft' then interval '24 hours' else interval '30 minutes' end) returning * into o;
 for line in select value from jsonb_array_elements(p_items) loop
  select * into c from public.lp_catalog where id=(line->>'id')::uuid;
  insert into public.lp_order_items(order_id,catalog_id,title,kind,quantity,unit_cents,details) values(o.id,c.id,c.title,c.kind,(line->>'quantity')::integer,c.price_cents,coalesce(line->'details','{}')||jsonb_build_object('eventAt',c.event_at,'venue',c.venue,'fulfilment',c.fulfilment,'rules',c.rules));
 end loop;
 return jsonb_build_object('id',o.id,'reference',o.reference,'total_cents',o.total_cents,'status',o.status,'expires_at',o.expires_at);
end $$;

create function public.lp_settle_order(p_id uuid,p_amount integer,p_pf text default null,p_admin uuid default null,p_note text default null) returns text language plpgsql security invoker set search_path='' as $$
declare o public.lp_orders; result text;
begin
 select * into o from public.lp_orders where id=p_id for update;
 if not found or o.total_cents<>p_amount then raise exception 'Order or amount mismatch'; end if;
 if p_admin is not null and not exists(select 1 from public.app_admin_users where user_id=p_admin and access_level='admin') then raise exception 'Admin access required'; end if;
 if p_admin is null and (p_pf is null or o.method<>'payfast') then raise exception 'Payment verification required'; end if;
 if p_admin is not null and o.method<>'eft' then raise exception 'Only EFT can be manually verified'; end if;
 if o.status in ('paid','payment_review') then
  if p_pf is not null and o.pf_payment_id is distinct from p_pf then raise exception 'Different payment already recorded'; end if;
  return o.status;
 end if;
 result:=case when o.status='pending' and o.expires_at>now() then 'paid' else 'payment_review' end;
 update public.lp_orders set status=result,paid_at=now(),pf_payment_id=p_pf,verified_by=p_admin,payment_note=p_note where id=p_id;
 return result;
end $$;
revoke all on function public.lp_checkout_limit(text),public.lp_create_order(uuid,text,jsonb,text,jsonb),public.lp_settle_order(uuid,integer,text,uuid,text) from public,anon,authenticated;
grant execute on function public.lp_checkout_limit(text),public.lp_create_order(uuid,text,jsonb,text,jsonb),public.lp_settle_order(uuid,integer,text,uuid,text) to service_role;
insert into public.lp_catalog(slug,title,kind,description,price_cents,entry_type) values
 ('ubuntu-event-01','Ubuntu — Event 01','event','R250 per player per event. Date and venue TBC.',25000,'individual'),
 ('mens-franchise-s4','Men’s Franchise League — Season 4','event','February/March 2027 target. Exact dates and fees TBC.',null,'individual'),
 ('kruger-cup-2','Kruger Cup 2','event','November 2026 target. Men’s and women’s divisions. Exact date and fees TBC.',null,'pair'),
 ('youth-cup','Youth Cup','event','Boys and girls: U10, U11, U15, U19. Entry format and age cut-off TBC.',null,'youth'),
 ('franchise-cup','LP Franchise Cup','event','Two-day cup for existing franchise players. Format and dates TBC.',null,'individual');
