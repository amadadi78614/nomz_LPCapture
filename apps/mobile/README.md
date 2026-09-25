# Lowveld Padel Mobile

Expo SDK 57 application for Android and iPhone. It currently runs in demo mode with verified Ladies Season 2 data and becomes Supabase-backed when environment variables are configured.

## Run

```bash
npm install
npm run typecheck
npm start
```

Scan the QR code with Expo Go, or launch an emulator. Copy `.env.example` to `.env` only after a Supabase project has been provisioned. Never commit secret or service-role keys.

## Current MVP

- LP-branded mobile home
- Ladies Season 2 playoff field
- Matchweek 5 verified results
- Match Centre with results/playoff modes
- Competition archive
- Supabase-ready passwordless player login
- Android and iOS identifiers

## Next milestone

Provision Supabase, apply the reviewed mobile schema, import current LP competition data, then add captain line-ups and administrator result entry.
