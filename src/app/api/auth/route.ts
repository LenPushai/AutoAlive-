import { NextResponse } from 'next/server'

// Auth callback handler (if needed for Supabase Auth)
export async function GET() {
  return NextResponse.json({ message: 'Auth endpoint' })
}
