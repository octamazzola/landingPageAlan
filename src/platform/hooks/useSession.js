import { useEffect, useState } from 'react'
import { demoMode, isSupabaseConfigured, supabase } from '../lib/supabase'

export function useSession() {
  const [session, setSession] = useState(demoMode ? { user: { id: 'demo-user', email: 'admin@visualpromptstudio.demo' } } : null)
  const [loading, setLoading] = useState(!demoMode && isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured || demoMode) { setLoading(false); return }
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false) })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession))
    return () => listener.subscription.unsubscribe()
  }, [])

  return { session, loading }
}
