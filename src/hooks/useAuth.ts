import { useState, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { Database } from '../types/supabase'

type UserProfile = Database['public']['Tables']['user_profiles']['Row']

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  async function fetchProfile(userId: string) {
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    setProfile(data ?? null)
  }

  useEffect(() => {
    let mounted = true

    // Escuta mudanças na autenticação (isso cobre o carregamento inicial e login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        
        console.log('Auth Event:', event)
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          setLoading(true)
          let resolved: UserProfile | null = null

          // Retry up to 3x — guards against transient Navigator Lock errors from HMR
          for (let attempt = 0; attempt < 3; attempt++) {
            if (!mounted) return
            const { data, error } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle()

            if (!error) { resolved = data; break }
            console.warn(`Profile fetch attempt ${attempt + 1} failed:`, error.message)
            if (attempt < 2) await new Promise(r => setTimeout(r, 600))
          }

          if (mounted) {
            setProfile(resolved)
            setLoading(false)
          }
        } else {
          if (mounted) {
            setProfile(null)
            setLoading(false)
          }
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password })

  const signOut = () => supabase.auth.signOut()

  return { user, session, profile, loading, signIn, signOut }
}
