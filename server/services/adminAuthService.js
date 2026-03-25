import bcrypt from 'bcryptjs'
import { env } from '../config/env.js'
import { AppError } from '../lib/AppError.js'
import { randomToken, sha256 } from '../lib/crypto.js'
import { getSupabase } from '../lib/supabase.js'

async function ensureDefaultAdmin() {
  const supabase = getSupabase()
  const { data: existingUser } = await supabase
    .from('admin_users')
    .select('*')
    .eq('username', env.adminDefaultUsername)
    .maybeSingle()

  if (existingUser) return existingUser

  const passwordHash = await bcrypt.hash(env.adminDefaultPassword, 10)
  const { data, error } = await supabase
    .from('admin_users')
    .insert({
      username: env.adminDefaultUsername,
      password_hash: passwordHash,
      role: 'admin',
      is_active: true,
    })
    .select('*')
    .single()

  if (error) {
    throw new AppError(500, 'ADMIN_BOOTSTRAP_FAILED', 'Gagal membuat admin default.', error)
  }

  return data
}

export async function loginAdmin({ username, password }) {
  const supabase = getSupabase()
  await ensureDefaultAdmin()

  const { data: user, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('username', username)
    .eq('is_active', true)
    .maybeSingle()

  if (error || !user) {
    throw new AppError(401, 'ADMIN_LOGIN_FAILED', 'Username atau password tidak valid.')
  }

  const isValid = await bcrypt.compare(password, user.password_hash)
  if (!isValid) {
    throw new AppError(401, 'ADMIN_LOGIN_FAILED', 'Username atau password tidak valid.')
  }

  const token = randomToken()
  const tokenHash = sha256(token)
  const expiresAt = new Date(Date.now() + env.adminSessionDays * 24 * 60 * 60 * 1000)

  const { error: sessionError } = await supabase.from('admin_sessions').insert({
    admin_user_id: user.id,
    token_hash: tokenHash,
    expires_at: expiresAt.toISOString(),
    last_seen_at: new Date().toISOString(),
  })

  if (sessionError) {
    throw new AppError(500, 'ADMIN_SESSION_FAILED', 'Gagal membuat session admin.', sessionError)
  }

  return {
    token,
    admin: {
      id: user.id,
      username: user.username,
      role: user.role,
    },
    expiresAt: expiresAt.toISOString(),
  }
}

export async function verifyAdminToken(token) {
  const supabase = getSupabase()
  const tokenHash = sha256(token)

  const { data: session, error } = await supabase
    .from('admin_sessions')
    .select('*, admin_users(*)')
    .eq('token_hash', tokenHash)
    .maybeSingle()

  if (error || !session) {
    throw new AppError(401, 'ADMIN_UNAUTHORIZED', 'Session admin tidak valid.')
  }

  if (new Date(session.expires_at).getTime() < Date.now()) {
    throw new AppError(401, 'ADMIN_SESSION_EXPIRED', 'Session admin sudah kedaluwarsa.')
  }

  await supabase
    .from('admin_sessions')
    .update({ last_seen_at: new Date().toISOString() })
    .eq('id', session.id)

  return {
    sessionId: session.id,
    adminUserId: session.admin_user_id,
    username: session.admin_users?.username,
    role: session.admin_users?.role,
  }
}

export async function logoutAdmin(token) {
  const supabase = getSupabase()
  const tokenHash = sha256(token)
  await supabase.from('admin_sessions').delete().eq('token_hash', tokenHash)
}
