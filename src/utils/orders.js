import seedOrders from '../data/orders.json'
import { STORAGE_KEYS } from './constants'
import { normalizeInvoice } from './normalizeInvoice'

function isBrowser() {
  return typeof window !== 'undefined'
}

function readStoredOrders() {
  if (!isBrowser()) return seedOrders

  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.orders)
    if (!raw) return seedOrders
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : seedOrders
  } catch {
    return seedOrders
  }
}

export function getOrders() {
  return readStoredOrders()
}

export function persistOrders(orders) {
  if (!isBrowser()) return
  window.localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders))
}

export function ensureOrdersSeeded() {
  if (!isBrowser()) return
  persistOrders(readStoredOrders())
}

export function findOrderByInvoice(invoice) {
  const normalized = normalizeInvoice(invoice)
  return getOrders().find((order) => normalizeInvoice(order.invoice) === normalized)
}

export function upsertOrder(nextOrder) {
  const orders = getOrders()
  const normalized = normalizeInvoice(nextOrder.invoice)
  const index = orders.findIndex(
    (order) => normalizeInvoice(order.invoice) === normalized,
  )

  const result =
    index >= 0
      ? orders.map((order, orderIndex) =>
          orderIndex === index ? { ...order, ...nextOrder } : order,
        )
      : [...orders, nextOrder]

  persistOrders(result)
  return result
}
