import { createClient } from '@supabase/supabase-js'
import { env } from '../config/env.js'

let supabaseClient

export function getSupabase() {
  if (!supabaseClient) {
    if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
      throw new Error('Supabase environment variables are not configured.')
    }

    supabaseClient = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })
  }

  return supabaseClient
}
