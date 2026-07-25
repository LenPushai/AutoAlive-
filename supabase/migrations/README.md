# Migrations

Empty by design (US-AA-037). The project was reset to a **schema-of-record**
model because the original migrations were corrupted and stale — see
`../legacy/README.md`.

## Source of truth

- **`../schema.sql`** — the live schema, dumped from Supabase. This is the
  authoritative description of the database.
- **`src/types/database.ts`** — TypeScript types generated from the same live
  schema. The app's Supabase clients are typed against it.

## Workflow for future schema changes

Keep `schema.sql` and the generated types in lockstep with the live DB:

1. Write a migration here as `YYYYMMDDHHMMSS_short_description.sql` (use
   `npx supabase migration new <name>` to get the timestamped filename).
2. Apply it (e.g. `npx supabase db push`, or run it against the project).
3. **Re-dump** the schema-of-record:
   `npx supabase db dump --linked --schema public -f supabase/schema.sql`
4. **Re-generate** the types:
   `npx supabase gen types typescript --linked --schema public > src/types/database.ts`
5. Commit the migration **and** the updated `schema.sql` **and** `database.ts`
   together, so a reviewer can diff the change against the recorded schema.

`supabase db dump` needs Docker (or use the `pg_dump` session-pooler fallback);
`gen types` uses the Management API and needs only `supabase login`.

## Notes

- `supabase/.temp/` is CLI scratch and is gitignored.
- There is no committed seed. The old dev seed was retired to `../legacy/`.
