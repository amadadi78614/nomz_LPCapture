# LP shop launch

The shop is published as a range enquiry page until real products are approved.
No speculative prices, stock, affiliate codes or supplier agreements are published.

## Direct products
Create a product in /admin/orders > Manage products. Confirm supplier permission,
landed cost, selling price, stock allocation, photos, size guide, collection timing
and returns information. Put collection location and timing in fulfilment; put
product-specific sizing and returns information in rules. Use description for
pre-order deadlines and lead times when applicable. Only publish a confirmed offer.

Each size/colour must have a separate catalogue row and explicit SKU title.
For grouped selectors, add each SKU slug to productInfo in src/commerce/shop.js:
{category:'LP Apparel',group:'LP match shirt',option:'Black / Medium',sizeGuide:'Verified measurements...',deadline:'Confirmed closing date...'}.
Group only variants of the same product. The selected catalogue ID reaches checkout,
so server pricing and capacity validation remain authoritative.
Categories can be assigned explicitly in productInfo; fallback title classification
covers apparel, rackets/bags and essentials.

## Affiliates
Add only approved offers to partnerOffers in src/commerce/shop.js, using the exact
issued HTTPS tracking URL, retailer name, product title and verified description.
No affiliate commissions or approvals have been obtained as part of this launch.
Partner offers never enter LP's cart. Partner checkout handles delivery and returns.

## Launch status
Product catalogue had no products at implementation. Eight enquiry cards are public,
explicitly not paid pre-orders. Enquiry buttons open the customer's email client;
no customer data is stored until they choose to send the enquiry.
Payfast live configuration was detected earlier; a successful real payment and
automatic confirmation still need end-to-end verification. No real charge was made.
