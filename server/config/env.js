import dotenv from 'dotenv'

dotenv.config()

function read(name, fallback = '') {
  return process.env[name] ?? fallback
}

export const env = {
  nodeEnv: read('NODE_ENV', 'development'),
  port: Number(read('PORT', '4000')),
  frontendOrigin: read('FRONTEND_ORIGIN', 'http://localhost:5173'),
  supabaseUrl: read('SUPABASE_URL'),
  supabaseServiceRoleKey: read('SUPABASE_SERVICE_ROLE_KEY'),
  premkuApiKey: read('PREMKU_API_KEY'),
  premkuBaseUrl: read('PREMKU_BASE_URL', 'https://premku.com/api'),
  adminDefaultUsername: read('ADMIN_DEFAULT_USERNAME', 'admin'),
  adminDefaultPassword: read('ADMIN_DEFAULT_PASSWORD', 'admin'),
  adminSessionDays: Number(read('ADMIN_SESSION_DAYS', '7')),
}

export function assertServerEnv() {
  const required = [
    ['SUPABASE_URL', env.supabaseUrl],
    ['SUPABASE_SERVICE_ROLE_KEY', env.supabaseServiceRoleKey],
    ['PREMKU_API_KEY', env.premkuApiKey],
  ].filter(([, value]) => !value)

  if (required.length) {
    const names = required.map(([name]) => name).join(', ')
    throw new Error(`Missing required server environment variables: ${names}`)
  }
}
