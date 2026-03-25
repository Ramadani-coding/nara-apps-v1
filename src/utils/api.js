const DEFAULT_API_BASE_URL = 'http://localhost:4000'

function trimTrailingSlash(value) {
  return value.endsWith('/') ? value.slice(0, -1) : value
}

export function getApiBaseUrl() {
  const configured = import.meta.env.VITE_API_BASE_URL
  return trimTrailingSlash(configured || DEFAULT_API_BASE_URL)
}

export async function apiRequest(path, options = {}) {
  const url = `${getApiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers ?? {}),
    },
  })

  let data = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok || data?.success === false) {
    const error = new Error(
      data?.error?.message || data?.message || 'Permintaan ke server gagal.',
    )
    error.status = response.status
    error.code = data?.error?.code ?? null
    error.payload = data
    throw error
  }

  return data?.data ?? data
}
