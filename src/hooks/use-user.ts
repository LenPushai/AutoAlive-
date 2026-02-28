'use client'

import { useEffect, useState } from 'react'
import { useSupabase } from './use-supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export function useUser() {
  const supabase = useSupabase()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  return { user, loading }
}
