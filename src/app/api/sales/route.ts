import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// GET /api/sales
export async function GET() {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('sales')
    .select('*, vehicles(make, model, year), leads(first_name, last_name), sale_verifications(*)')
    .order('sale_date', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/sales — record a sale
export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const body = await request.json()

  // TODO: Validate, create sale + init verification record
  // TODO: Update vehicle status to 'sold' (Layer 1)
  // TODO: Update lead status to 'won' (Layer 3)

  return NextResponse.json({ message: 'TODO' }, { status: 201 })
}
