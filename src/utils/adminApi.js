import { STORAGE_KEYS } from './constants'
import { apiRequest } from './api'

function isBrowser() {
  return typeof window !== 'undefined'
}

export function getStoredAdminSession() {
  if (!isBrowser()) return null

  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.adminSession)
    if (!raw) return null
    const session = JSON.parse(raw)
    return session && typeof session === 'object' ? session : null
  } catch {
    return null
  }
}

export function setStoredAdminSession(session) {
  if (!isBrowser()) return
  window.localStorage.setItem(STORAGE_KEYS.adminSession, JSON.stringify(session))
}

export function clearStoredAdminSession() {
  if (!isBrowser()) return
  window.localStorage.removeItem(STORAGE_KEYS.adminSession)
}

export function getAdminAccessToken() {
  return getStoredAdminSession()?.token ?? null
}

export async function adminApiRequest(path, options = {}) {
  const token = getAdminAccessToken()

  return apiRequest(path, {
    ...options,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  })
}

export async function loginAdminRequest({ username, password }) {
  return apiRequest('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}

export async function logoutAdminRequest() {
  try {
    await adminApiRequest('/api/admin/logout', { method: 'POST' })
  } finally {
    clearStoredAdminSession()
  }
}

export async function getAdminMe() {
  return adminApiRequest('/api/admin/me')
}

export async function getAdminDashboard() {
  return adminApiRequest('/api/admin/dashboard')
}

export async function getAdminProducts() {
  return adminApiRequest('/api/admin/products')
}

export async function syncAdminCatalog() {
  return adminApiRequest('/api/admin/catalog/sync', { method: 'POST' })
}

export async function updateAdminMargin(variantId, marginAmount) {
  return adminApiRequest(`/api/admin/variants/${variantId}/margin`, {
    method: 'PATCH',
    body: JSON.stringify({ marginAmount }),
  })
}

export async function getAdminOrders() {
  return adminApiRequest('/api/admin/orders')
}
