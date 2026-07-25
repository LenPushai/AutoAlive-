# Legacy SQL — retired, reference only (do NOT run)

These three files were the original hand-written schema/seed. They are kept for
historical intent **only**. They are not executable and not trustworthy as a
description of the live database. The schema-of-record is **`../schema.sql`**
(dumped from the live Supabase project). Generated types live in
`src/types/database.ts`.

## Why they were retired (US-AA-037)

**1. Corrupted — not executable.** Every single-quote in a string literal is
doubled (`''available''`, `''00000000-…''`, `USING (status = ''available'')`),
a mechanical artifact of the PowerShell generator (`supabase-setup.ps1`). The
DDL structure is intact and readable, but the files will not parse as SQL. They
are mechanically repairable (`sed "s/''/'/g"` — no data here contains a real
apostrophe), but there is no reason to: see below.

**2. Stale — they do not match live.** Even repaired, these files describe an
older schema than what is deployed. Confirmed divergences against `schema.sql`:

- `leads.status` CHECK is live `('new','contacted','test_drive','negotiating',
  'won','lost')` — the legacy migration had `qualified` instead of `test_drive`.
  (The admin kanban's `test_drive` column is correct against live.)
- `leads.source` CHECK is live `('website','autotrader','carscoza','facebook',
  'tiktok','instagram','walkin','googleads','other')` — broader than the legacy
  set, and different from `src/config/constants.ts` (which still lists
  `whatsapp`/`phone`/`referral`, none of which exist live).
- `leads` RLS was changed live during US-AA-034 (public INSERT kept, public
  SELECT removed) — not reflected in the legacy `00002_rls_policies.sql`.

Because they are both corrupted and stale, they are superseded entirely by the
live dump. Do not resurrect them as migrations.

## Files

- `00001_initial_schema.sql` — original tables/indexes/triggers/functions
- `00002_rls_policies.sql` — original RLS policies
- `seed.sql` — original development seed data (also stale)
