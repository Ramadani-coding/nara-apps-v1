import { AppError } from '../lib/AppError.js'
import { getSupabase } from '../lib/supabase.js'
import { getCatalogProduct } from './catalogService.js'
import { premkuClient } from './premkuClient.js'

async function insertOrderStatusLog(orderId, status, rawResponse) {
  const supabase = getSupabase()
  const { error } = await supabase.from('order_status_logs').insert({
    order_id: orderId,
    status,
    raw_response: rawResponse,
  })

  if (error) {
    throw new AppError(500, 'ORDER_STATUS_LOG_FAILED', 'Gagal menyimpan log status order.', error)
  }
}

export async function createOrder({ productId, qty, whatsapp, paymentMethod = '' }) {
  const product = await getCatalogProduct(productId)
  const supabase = getSupabase()
  const response = await premkuClient.createOrder({
    productId: product.providerProductId,
    qty,
    whatsapp,
  })

  const subtotal = product.sellPrice * qty
  const now = new Date().toISOString()

  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      provider_name: 'premku',
      provider_invoice: response.invoice,
      product_id: product.id,
      product_name_snapshot: response.product ?? product.name,
      qty,
      customer_whatsapp: whatsapp,
      provider_unit_price: response.price ?? product.basePrice,
      sell_unit_price: product.sellPrice,
      subtotal,
      provider_status: 'created',
      provider_balance_before: response.balance_before ?? null,
      provider_balance_after: response.balance_after ?? null,
      created_at: now,
      updated_at: now,
    })
    .select('*')
    .single()

  if (error) {
    throw new AppError(500, 'ORDER_INSERT_FAILED', 'Gagal menyimpan order.', error)
  }

  await insertOrderStatusLog(order.id, 'created', response)

  return {
    invoice: order.provider_invoice,
    product: order.product_name_snapshot,
    catalogProductId: order.product_id,
    qty: order.qty,
    paymentMethod,
    phoneNumber: order.customer_whatsapp,
    providerUnitPrice: order.provider_unit_price,
    sellUnitPrice: order.sell_unit_price,
    subtotal: order.subtotal,
    status: order.provider_status,
  }
}

export async function syncOrderStatus(invoice) {
  const supabase = getSupabase()
  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('provider_invoice', invoice)
    .single()

  if (error || !order) {
    throw new AppError(404, 'ORDER_NOT_FOUND', 'Order tidak ditemukan.', error)
  }

  const response = await premkuClient.checkOrderStatus(invoice)
  const now = new Date().toISOString()
  const nextStatus = response.status ?? order.provider_status

  const { data: updatedOrder, error: updateError } = await supabase
    .from('orders')
    .update({
      provider_status: nextStatus,
      last_status_sync_at: now,
      updated_at: now,
    })
    .eq('id', order.id)
    .select('*')
    .single()

  if (updateError) {
    throw new AppError(500, 'ORDER_STATUS_UPDATE_FAILED', 'Gagal update status order.', updateError)
  }

  await insertOrderStatusLog(order.id, nextStatus, response)

  if (Array.isArray(response.accounts)) {
    await supabase.from('order_accounts').delete().eq('order_id', order.id)
    if (response.accounts.length) {
      const { error: accountsError } = await supabase.from('order_accounts').insert(
        response.accounts.map((account) => ({
          order_id: order.id,
          username: account.username,
          password: account.password,
        })),
      )

      if (accountsError) {
        throw new AppError(500, 'ORDER_ACCOUNTS_SAVE_FAILED', 'Gagal menyimpan akun order.', accountsError)
      }
    }
  }

  const { data: accounts } = await supabase
    .from('order_accounts')
    .select('username, password')
    .eq('order_id', order.id)

  return {
    invoice: updatedOrder.provider_invoice,
    product: response.product ?? updatedOrder.product_name_snapshot,
    catalogProductId: updatedOrder.product_id,
    qty: updatedOrder.qty,
    phoneNumber: updatedOrder.customer_whatsapp,
    providerUnitPrice: updatedOrder.provider_unit_price,
    sellUnitPrice: updatedOrder.sell_unit_price,
    subtotal: updatedOrder.subtotal,
    status: updatedOrder.provider_status,
    accounts: accounts ?? [],
  }
}

export async function listOrders() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new AppError(500, 'ORDERS_QUERY_FAILED', 'Gagal membaca daftar order.', error)
  }

  return data ?? []
}
