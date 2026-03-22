import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

export function createClient() {
  return createBrowserClient<Database>(
    "https://aujxwbbsjdyqxzkelybp.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1anh3YmJzamR5cXh6a2VseWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MjI5NjAsImV4cCI6MjA4NzE5ODk2MH0.uG1QtrjHwUCRO6man4fciFmxJKA3utavftcpc0IEHak"
  )
}
