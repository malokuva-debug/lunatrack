/**
 * Supabase integration – optional.
 *
 * Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
 * to enable cloud sync. If not set, the app runs fully local.
 */

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isSupabaseConfigured = !!(supabaseUrl && supabaseKey)

// Lazy-load to avoid importing the heavy bundle in local mode
let _supabase: import('@supabase/supabase-js').SupabaseClient | null = null

export async function getSupabase() {
  if (!isSupabaseConfigured) return null
  if (_supabase) return _supabase

  const { createClient } = await import('@supabase/supabase-js')
  _supabase = createClient(supabaseUrl!, supabaseKey!)
  return _supabase
}

// ─── Auth helpers ─────────────────────────────────────────────────────────────

export async function signIn(email: string, password: string) {
  const sb = await getSupabase()
  if (!sb) throw new Error('Supabase not configured')
  return sb.auth.signInWithPassword({ email, password })
}

export async function signUp(email: string, password: string) {
  const sb = await getSupabase()
  if (!sb) throw new Error('Supabase not configured')
  return sb.auth.signUp({ email, password })
}

export async function signOut() {
  const sb = await getSupabase()
  if (!sb) return
  return sb.auth.signOut()
}

export async function getSession() {
  const sb = await getSupabase()
  if (!sb) return null
  const { data } = await sb.auth.getSession()
  return data.session
}

// ─── Sync helpers (scaffold) ──────────────────────────────────────────────────
// Implement these to push/pull data from Supabase when the user is authenticated.

export async function syncToCloud(_userId: string, _data: unknown) {
  // TODO: upsert cycle data to Supabase
  console.info('[Supabase] syncToCloud – not yet implemented')
}

export async function syncFromCloud(_userId: string) {
  // TODO: pull cycle data from Supabase
  console.info('[Supabase] syncFromCloud – not yet implemented')
  return null
}
