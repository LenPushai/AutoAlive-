-- US-AA-051: guard the public enquiry write path at RLS
-- Applied via the Supabase SQL editor; recorded here per the migrations workflow.
--
-- Root cause: two permissive, anon-reachable INSERT policies on leads were OR'd
-- together. "Allow public lead insert" WITH CHECK (true) always passed, which
-- made the source check in "Public can submit enquiries" decorative since day
-- one — a crafted anon POST could insert with consent_given=false or against a
-- sold vehicle. This consolidates to a single guarded TO anon policy.
DROP POLICY IF EXISTS "Allow public lead insert"   ON public.leads;
DROP POLICY IF EXISTS "Public can submit enquiries" ON public.leads;

CREATE POLICY "Public can submit enquiries" ON public.leads
  FOR INSERT TO anon
  WITH CHECK (
    source = 'website'
    AND consent_given = true
    AND (
      vehicle_id IS NULL
      OR vehicle_id IN (SELECT id FROM public.vehicles WHERE status IN ('available', 'reserved'))
    )
  );
