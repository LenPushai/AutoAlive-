import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const MAX_BYTES = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

// POST /api/upload — upload a vehicle photo to Supabase Storage (admin only)
export async function POST(request: NextRequest) {
  // Auth guard: only a signed-in dashboard user may upload. /api routes are not
  // covered by the /dashboard middleware, so we check the session here.
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authorised' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Please upload a JPG or PNG image.' }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'That image is too large — please use a JPG or PNG under 5MB.' }, { status: 400 })
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${crypto.randomUUID()}.${fileExt}`

  // Write with the service-role client so the upload does not depend on
  // storage.objects RLS. The service-role key is read server-side only in
  // src/lib/supabase/admin.ts (SUPABASE_SERVICE_ROLE_KEY) and is never bundled
  // to the browser. This route runs on the server only.
  const admin = createAdminClient()
  const { data, error } = await admin.storage
    .from('vehicle-photos')
    .upload(fileName, file, { contentType: file.type })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: { publicUrl } } = admin.storage
    .from('vehicle-photos')
    .getPublicUrl(data.path)

  return NextResponse.json({ url: publicUrl })
}
