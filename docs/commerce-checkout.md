# LP shared checkout

Routes: /register (confirmed event entries), /shop (published products), /cart,
/admin/orders (allowlisted administrators). Existing registration profiles and
expressions of interest remain at /admin/registrations.

## Operational setup

1. Sign in at /admin/orders using an existing authorised LP administrator.
2. Edit the seeded event drafts. Ubuntu is R250 per player/event. Confirm dates,
   venue, eligibility/rules, divisions and total capacity before publishing.
3. Add confirmed product variants, each with its own code, retail price, total
   stock allocation and collection arrangements. Only use authorised imagery.
   No supplier costs are stored in the public catalogue. Supplier onboarding,
   settlements and automated sliding markup are not implemented by this change.
4. A customer can enter several events and add products, then create one order.
   The server validates availability and prices and snapshots each line.
5. FNB EFT orders show one reference and a 24-hour reservation. Check the actual
   FNB deposit, then enter its amount and reconciliation note in Orders Admin.
   This is manual EFT reconciliation, not a connection to the bank's API.
6. Fulfil/confirm each paid item separately. Payments after expiry are flagged
   payment_review for personal resolution; do not automatically allocate stock.
   Refunds, partial payments and split settlements require manual handling.

## Payfast activation (not enabled at delivery)

Set server-side Supabase Edge Function secrets only:
- PAYFAST_MERCHANT_ID
- PAYFAST_MERCHANT_KEY
- PAYFAST_PASSPHRASE (match Payfast Developer Settings)
- LP_PAYFAST_MODE (sandbox for testing, live only after verification)

Do not put these in VITE variables, GitHub source, public forms or chat.
Use a separate staging project/catalogue for sandbox payments. Test a combined
order, cancellation, duplicate ITNs, incorrect signatures/amounts, and late ITNs.
A sandbox payment must never be treated as a real customer payment.
Notify URL: https://xkxmnljalxqjovokfmub.supabase.co/functions/v1/payfast-notify
Return/cancel URLs are generated per order under https://www.lowveldpadel.co.za/cart.
Only a validated COMPLETE ITN marks payment; browser redirects cannot mark paid.
Official integration reference: https://developers.payfast.co.za/documentation

## Emails

Order-receipt emails use the existing RESEND_API_KEY and LP_CONFIRMATION_FROM
secrets when configured. Email acceptance is recorded as sent; this does not
prove inbox delivery. Missing configuration records not_sent. The receipt page
always shows its status and provides print/save. No automatic payment-received
email is implemented yet. Provider delivery should be verified with a real
owner-approved test before advertising email confirmations.

## Data and access

lp_catalog: public published listings; allowlisted admin editing.
lp_orders / lp_order_items: service writes, allowlisted admin reads only.
lp_checkout_limits: service-only, deliberately no public RLS policy.
The public checkout uses a publishable application key, IP-based attempt limits,
and server-only database functions. Each receipt requires an independent 256-bit
capability, stored hashed in the database, with the original in the customer's
browser. Do not log or share receipt tokens. They expose the order to the holder.
The cart lasts up to two hours in sessionStorage to survive the existing full-page
navigation guard. Clear shared-device carts. Order references/tokens persist in
localStorage; customers can print their receipt and contact LP if changing device.
An interrupted checkout can be recovered by request key and capability.

## Validation on 14 October 2026

Production build passed. Transaction-rolled-back SQL fixtures passed combined
order totals, price tampering, duplicate retries, stock limits, guardian checks,
payment amount checks, EFT settlement, repeat settlement, and catalogue publish
constraints. Anonymous catalogue access works; anonymous order reads, direct
payment edits and direct checkout RPC access are denied. Live Payfast money
movement has not been tested. No real customer order or payment was made.
