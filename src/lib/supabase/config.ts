/**
 * Single source of truth for the Supabase project URL and anon key.
 *
 * These come from NEXT_PUBLIC_* env vars (now set on Vercel for Production and
 * Preview — US-AA-036). The fallback constants below are deliberate and mirror
 * the rationale in src/config/dealer.ts: NEXT_PUBLIC_* values are inlined at
 * build time, and a build that runs without them would ship
 * createBrowserClient(undefined, undefined) into the browser, throwing on every
 * public page and breaking lead capture. On the public storefront a missing
 * build-time var must never take the site down, so we fall back to the known
 * project values rather than crash.
 *
 * The anon key is public by design — it is shipped in the browser bundle either
 * way — so this fallback is a deployment-resilience measure, not a secret leak.
 * The service-role key is NOT here; it stays env-only in src/lib/supabase/admin.ts.
 *
 * This file is the ONLY place these literals may appear. Rotating the key or
 * enforcing env-only configuration is a follow-up to this ticket.
 */
export const SUPABASE_URL: string =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aujxwbbsjdyqxzkelybp.supabase.co'

export const SUPABASE_ANON_KEY: string =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1anh3YmJzamR5cXh6a2VseWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MjI5NjAsImV4cCI6MjA4NzE5ODk2MH0.uG1QtrjHwUCRO6man4fciFmxJKA3utavftcpc0IEHak'
