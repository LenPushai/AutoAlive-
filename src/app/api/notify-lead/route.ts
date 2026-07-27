import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
// NOTE: the shared Resend client (src/lib/email/client.ts) constructs at module
// load and throws if RESEND_API_KEY is unset, which would break `next build`
// when the key is absent. Import it lazily inside the handler so it only
// evaluates at request time (key present), never at build.

// Dev sender. NOTE: src/lib/email/client.ts EMAIL_FROM
// ('Auto Alive <noreply@autoalive.co.za>') is aspirational — that domain is
// NOT verified in Resend, so it cannot be used to send. Until a domain is
// verified we send from the shared Resend dev sender.
const FROM = 'Auto Alive <onboarding@resend.dev>'

// POST /api/notify-lead
// Target of a Supabase Database Webhook on leads INSERT (US-AA-042). Public
// route; its only auth is the shared secret. Fires post-commit and out-of-band,
// so a failed send can never affect the lead insert that already committed.
export async function POST(request: NextRequest) {
  // Shared-secret gate — the route's only authentication.
  const secret = process.env.WEBHOOK_SECRET
  if (!secret || request.headers.get('x-webhook-secret') !== secret) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const record = body?.record

  // Only new-lead inserts are actionable; anything else is a no-op success
  // (return 200 so the webhook does not retry).
  if (body?.type !== 'INSERT' || body?.table !== 'leads' || !record) {
    return NextResponse.json({ ok: true, skipped: 'not a leads insert' })
  }

  // Only website enquiries notify; seed/dealer/other-source inserts stay silent.
  if (record.source !== 'website') {
    return NextResponse.json({ ok: true, skipped: 'non-website source' })
  }

  // Optional vehicle enrichment — best-effort. Must NEVER fail the response
  // (same isolation rule as the send below); omit the line if absent or on error.
  let vehicleLine = ''
  if (record.vehicle_id) {
    try {
      const admin = createAdminClient()
      const { data: v } = await admin
        .from('vehicles')
        .select('make, model, year')
        .eq('id', record.vehicle_id)
        .single()
      if (v) vehicleLine = `Vehicle: ${v.year} ${v.make} ${v.model}\n`
    } catch (e) {
      console.error('[notify-lead] vehicle enrichment failed', {
        lead_id: record.id,
        error: (e as Error)?.message,
      })
    }
  }

  const name = `${record.first_name ?? ''} ${record.last_name ?? ''}`.trim()
  const subject = `New website lead - ${name || 'Unknown'}`
  // Plain-text body, adapted from templates.ts:newEnquiryEmail. ASCII-only
  // (no em-dashes) so the content is codepage-proof across mail clients.
  const text =
    `Name: ${name || '-'}\n` +
    `Phone: ${record.phone ?? '-'}\n` +
    `Email: ${record.email || '-'}\n` +
    vehicleLine +
    `Notes: ${record.notes || '-'}\n` +
    `Source: ${record.source}\n` +
    `Received: ${record.created_at ?? ''}\n`

  // Failure isolation + no silent failures (US-AA-046/048): the lead is already
  // committed. The send is best-effort — on failure we still return 200 so the
  // webhook does not retry and double-send, but we always log a structured line.
  try {
    const { resend } = await import('@/lib/email/client')
    const { error } = await resend.emails.send({
      from: FROM,
      to: process.env.NOTIFY_EMAIL!,
      subject,
      text,
    })
    if (error) {
      console.error('[notify-lead] resend send failed', {
        lead_id: record.id,
        error: error.message,
      })
    }
  } catch (e) {
    console.error('[notify-lead] resend threw', {
      lead_id: record.id,
      error: (e as Error)?.message,
    })
  }

  // ML-first seam (US-AA-054 candidate): a future enquiry_events telemetry insert
  // slots in here, post-send, so notification latency never blocks the response.
  // TODO(US-AA-054): record enquiry_event. Not built here.

  return NextResponse.json({ ok: true })
}
