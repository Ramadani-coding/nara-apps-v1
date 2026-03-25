import {
  clearStoredAdminSession,
  getStoredAdminSession,
  loginAdminRequest,
  logoutAdminRequest,
  setStoredAdminSession,
} from './adminApi'

function isBrowser() {
  return typeof window !== 'undefined'
}

export function isAdminAuthenticated() {
  if (!isBrowser()) return false
  const session = getStoredAdminSession()
  return Boolean(session?.token)
}

export async function loginAdmin({ username, password }) {
  const result = await loginAdminRequest({ username, password })
  setStoredAdminSession({
    token: result.token,
    user: result.admin,
    expiresAt: result.expiresAt,
  })
  return result
}

export async function logoutAdmin() {
  await logoutAdminRequest()
}

export function getAdminSession() {
  return getStoredAdminSession()
}

export function clearAdminSession() {
  clearStoredAdminSession()
}
