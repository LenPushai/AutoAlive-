import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { leadSchema } from '@/lib/validators'
import { DEALER_ID } from '@/config/dealer'

// GET /api/leads
export async function GET() {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('leads')
    .select('*, vehicles(make, model, year)')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/leads
export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const body = await request.json()

  const parsed = leadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  // Cast at the insert boundary only: the placeholder Database type
  // (src/types/database.ts) resolves inserts to `never`. Real generated types
  // remove this cast (US-AA-037). The rest of the file is fully type-checked.
  const { data, error } = await (supabase.from('leads') as any)
    .insert({ ...parsed.data, dealer_id: DEALER_ID })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
