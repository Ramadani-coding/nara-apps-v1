import { STORAGE_KEYS } from './constants'

function isBrowser() {
  return typeof window !== 'undefined'
}

export function readStoredMargins() {
  if (!isBrowser()) return {}

  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.adminMargins)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
  } catch {
    return {}
  }
}

export function persistMargins(margins) {
  if (!isBrowser()) return
  window.localStorage.setItem(STORAGE_KEYS.adminMargins, JSON.stringify(margins))
}

export function getVariantMargin(variantId) {
  const margins = readStoredMargins()
  const value = margins[variantId]
  return typeof value === 'number' && !Number.isNaN(value) ? Math.max(0, value) : 0
}

export function getVariantPricing(variant) {
  const basePrice = variant?.price ?? 0
  const margin = variant?.id ? getVariantMargin(variant.id) : 0
  return {
    basePrice,
    margin,
    sellPrice: basePrice + margin,
  }
}

export function getVariantSellPrice(variant) {
  return getVariantPricing(variant).sellPrice
}
