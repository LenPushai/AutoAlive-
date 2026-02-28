import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// POST /api/upload — upload vehicle photos to Supabase Storage
export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${crypto.randomUUID()}.${fileExt}`

  const { data, error } = await supabase.storage
    .from('vehicle-photos')
    .upload(fileName, file)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: { publicUrl } } = supabase.storage
    .from('vehicle-photos')
    .getPublicUrl(data.path)

  return NextResponse.json({ url: publicUrl })
}
