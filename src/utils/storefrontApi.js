import { apiRequest } from './api'

export async function getStorefrontProducts() {
  return apiRequest('/api/storefront/products')
}

export async function getStorefrontProductBySlug(slug) {
  return apiRequest(`/api/storefront/products/${encodeURIComponent(slug)}`)
}

export async function createStorefrontOrder(payload) {
  return apiRequest('/api/storefront/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function getStorefrontOrder(invoice) {
  return apiRequest(`/api/storefront/orders/${encodeURIComponent(invoice)}`)
}
