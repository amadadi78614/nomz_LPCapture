# LP shop preparation

Public /shop is a coming-soon page, not a functioning checkout. No products, partner affiliations or stock availability are claimed.

## Local supplier / resale
Obtain supplier name, authorised product descriptions and images, brand, SKU, size/colour variants, unit cost inclusive of any supplier tax, confirmed stock, fulfilment lead time, return/warranty terms and collection/delivery costs. Publish only approved retail prices and customer-facing data. Keep costs, margins and supplier terms server-side.

Sliding pricing helper: scripts/price-supplier-product.mjs. Bands are inclusive upper cost limits in cents and a percentage markup on cost, applied to the entire unit cost. Final null limit covers all higher costs. No commercial rates are configured yet. Confirm whether this cost-band interpretation is intended, rather than quantity discounts, before use. Markup is not gross margin. Add payment, packaging and fulfilment costs to the pricing decision; do not promise profit from markup alone.

## Payment setup pending
FNB account holder: LOWVELD PADEL (PTY)LTD
Bank: FNB
Account type: Gold Business Account
Account number: 63112387097
Branch code: 250955
Source: user-supplied FNB account confirmation dated 28 September 2026. Letter was read, not independently authenticated through FNB.

When checkout is implemented, generate a unique order reference and a server-calculated total; reserve/recheck stock. EFT stays pending until an authorised administrator checks actual bank receipt. Uploaded proof is not payment verification. No payments are requested for TBC fees or unpublished products.

Payfast needs server-side credentials and passphrase, signed checkout, verified and idempotent ITN processing (merchant, reference, amount, signature and Payfast validation), order status and stock updates, cancellation/retry flow and confirmation email. Returning to a success URL must not mark an order paid. Sandbox tests precede live activation. No secrets belong in the browser, git or this document.

## Affiliates
Separate retailer referral links from LP-sold products. Obtain approval and tracked URLs before publishing. Disclose commission. Retailer handles its checkout, delivery and returns. No Adidas or other brand partnership is currently asserted.

## Upcoming registrations
Registration Centre shows planned competitions, not open registration forms for the new events. Men's Franchise S4: Feb/Mar 2027 target; Kruger Cup 2: November 2026 target, men/women; Youth Cup: November 2026 target, boys/girls U10/U11/U15/U19; Franchise Cup: proposed two-day event with current league players. Exact dates and fees TBC. Youth entry unit and age cutoff, franchise cup divisions, rules and venue remain unconfirmed. Ubuntu existing profile registration remains open without a payment request.
