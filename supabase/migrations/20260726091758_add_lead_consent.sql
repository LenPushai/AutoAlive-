-- US-AA-043: POPIA consent capture on leads
-- Applied via the Supabase SQL editor; recorded here per the migrations workflow.
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS consent_given boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS consent_timestamp timestamptz;
