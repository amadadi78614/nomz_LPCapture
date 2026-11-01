# Daisy Cup fixes (2 Nov 2026)

## What changed
| Area | Fix |
|---|---|
| Registration form | Guardian section only appears when a player is under 18 (adults were ticking it). Cellphone for both players. "Both players are ladies" check on ladies events. "X of 24 places left". Payment wording leads with PayFast. |
| Registration page | Open events first; closed and coming-soon events fold away, so the Daisy form is on the first screen. |
| Checkout | PayFast (card or instant EFT) first and selected by default; FNB transfer second, with the 72-hour hold stated. |
| Navigation | "Enter Daisy Cup" replaces the finished Kruger Cup link (desktop and phone). Desktop menu cut from 14 to 9 items; the rest are on More. Change `FEATURED` in `src/components/SiteNavigation.jsx` when the next event opens. |
| More page | Grouped (Enter and shop, Events, League, Community, About). Organiser tools (captain, commissioner, umpire console, sponsor analytics) no longer listed publicly; their URLs still work. |
| WhatsApp previews | `lowveldpadel.co.za/daisy-cup` shows the Daisy poster, date and price when shared, then opens registration. Site-wide preview tags added. |
| Admin orders | Partner cellphones and the ladies confirmation shown; "Send confirmation email" on paid orders. |
| Emails | New "You're in" email when payment is confirmed (PayFast automatically, EFT when you confirm the bank receipt). |
| Booking function | New `availability` action (counts only). Stores player cellphones and the ladies confirmation. |
| Database | EFT reservations held 72 hours instead of 24 (`20261102000000_eft_hold_72_hours.sql`). |
| Repo | Removed 4 unused page files and stopped tracking `node_modules` (2,884 files). |

## Deploy, in this order
1. Database: run `supabase/migrations/20261102000000_eft_hold_72_hours.sql` (or ask Claude to apply it).
2. Functions: `supabase functions deploy commerce` and `supabase functions deploy payfast-notify` (keep their current JWT settings).
3. Email: add function secrets `RESEND_API_KEY` and `LP_CONFIRMATION_FROM` (e.g. `Lowveld Padel <entries@lowveldpadel.co.za>`, domain verified in Resend). Without them no emails are sent, which is why none have gone out so far.
4. Site: commit and push to `main`; GitHub Pages deploys it.
5. Admin → Orders: press "Send confirmation email" on the 5 paid Daisy Cup pairs.
