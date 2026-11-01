-- FNB transfers are checked by hand, so a 24-hour hold released paid-for places.
-- Hold EFT reservations for 72 hours (PayFast stays at 30 minutes). Rewrites only
-- the interval inside the live lp_create_order definition.
do $$
begin
  execute replace(pg_get_functiondef('public.lp_create_order'::regproc), $q$interval '24 hours'$q$, $q$interval '72 hours'$q$);
end $$;
