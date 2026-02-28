import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// PATCH /api/sales/verify — update verification layers
export async function PATCH(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const body = await request.json()

  // TODO: Update specific verification layer
  // TODO: Check for anomalies
  // TODO: If all 5 layers complete, mark as fully verified

  return NextResponse.json({ message: 'TODO' })
}
