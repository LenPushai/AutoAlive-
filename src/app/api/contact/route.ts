import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { enquirySchema } from '@/lib/validators'
import { resend, EMAIL_FROM } from '@/lib/email/client'
import { newEnquiryEmail, enquiryConfirmationEmail } from '@/lib/email/templates'
import { vehicleTitle } from '@/lib/utils'

// POST /api/contact — public enquiry form submission
export async function POST(request: NextRequest) {
  const body = await request.json()
  const parsed = enquirySchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const supabase = await createServerSupabaseClient()
  const { data: enquiry } = parsed

  // Create lead in CRM
  const { error } = await supabase.from('leads').insert({
    first_name: enquiry.first_name,
    last_name: enquiry.last_name,
    email: enquiry.email ?? null,
    phone: enquiry.phone,
    vehicle_id: enquiry.vehicle_id ?? null,
    source: 'website',
    status: 'new',
    notes: enquiry.message ?? null,
    dealer_id: '', // TODO: real dealer_id
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // TODO: Send notification emails via Resend

  return NextResponse.json({ success: true }, { status: 201 })
}
