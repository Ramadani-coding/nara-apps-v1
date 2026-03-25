import { AppError } from '../lib/AppError.js'
import { getSupabase } from '../lib/supabase.js'
import { premkuClient } from './premkuClient.js'

export async function getProviderProfile() {
  const supabase = getSupabase()
  const response = await premkuClient.profile()
  const profile = response.data

  const { data, error } = await supabase
    .from('provider_accounts')
    .upsert(
      {
        provider_name: 'premku',
        api_key_encrypted: 'configured-in-env',
        username: profile.username,
        whatsapp: profile.whatsapp,
        saldo: profile.saldo,
        registered_at_provider: profile.registered_at,
        last_profile_sync_at: new Date().toISOString(),
        is_active: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'provider_name' },
    )
    .select('*')
    .single()

  if (error) {
    throw new AppError(500, 'PROFILE_SYNC_FAILED', 'Gagal menyimpan profil provider.', error)
  }

  return data
}
