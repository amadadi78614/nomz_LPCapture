# Daisy Cup registration — 27 October 2026

Source: organiser-supplied Daisy Cup poster and confirmation of Diadem, OSHEE,
and Game & Grind as partners.

- Catalogue slug: daisy-cup-2026
- Date: 28 November 2026, 08:00–22:00 Africa/Johannesburg
- Venue: Padel 24, Nelspruit
- Ladies doubles; one entry contains two players
- Price: 80000 ZAR cents per pair; capacity: 24 pair bookings
- Advertised prize pool: R6,000 & more
- Detailed format/draw/rules were not supplied; the registration states they
  will be communicated by LP and gives its support email before payment.
- Registration route: /register?event=daisy-cup
- Payments use the existing shared checkout. Live checkout reports Payfast
  setup pending; FNB EFT is available and requires manual bank verification.
  Do not advertise active card payments until Payfast is configured and tested.
- Orders and pair details are available through /admin/orders, separate from
  the older expression-of-interest records at /admin/registrations.

Validation: production build passed. Transaction-rolled-back database tests
confirmed R800 server-authoritative price despite a supplied lower client price,
24 successful pair reservations, and rejection of the 25th reservation. No test
order, payment, or outbound email was retained. Existing Ladies data check passed.
