import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient<any>(
    "https://aujxwbbsjdyqxzkelybp.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1anh3YmJzamR5cXh6a2VseWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MjI5NjAsImV4cCI6MjA4NzE5ODk2MH0.uG1QtrjHwUCRO6man4fciFmxJKA3utavftcpc0IEHak",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component — read-only
          }
        },
      },
    }
  )
}
