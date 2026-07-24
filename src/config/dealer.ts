/**
 * Single source of truth for the Auto Alive dealer id.
 *
 * The fallback constant below is deliberate (US-AA-032). NEXT_PUBLIC_* values are
 * inlined at build time, and this project has already shipped builds where the
 * Vercel env vars were absent — that is why the Supabase credentials ended up
 * hardcoded. On the lead-capture path a missing build-time env var must never
 * cost a lead, so we fall back to the known dealer id rather than send a null
 * dealer_id and lose the enquiry.
 *
 * This file is the ONLY place the literal may appear. Removing the fallback and
 * enforcing env-only configuration is tracked in US-AA-036 (env discipline).
 */
export const DEALER_ID: string =
  process.env.NEXT_PUBLIC_DEALER_ID || '00000000-0000-0000-0000-000000000001'
