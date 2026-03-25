import { AppError } from '../lib/AppError.js'
import { getSupabase } from '../lib/supabase.js'
import { getCatalogProduct } from './catalogService.js'
import { premkuClient } from './premkuClient.js'

export async function checkProductStock(productId) {
  const product = await getCatalogProduct(productId)
  const supabase = getSupabase()
  const response = await premkuClient.checkStock(product.providerProductId)
  const now = new Date().toISOString()

  const { error: updateError } = await supabase
    .from('products')
    .update({
      stock: response.stock ?? 0,
      provider_status: response.stock > 0 ? 'available' : 'unavailable',
      last_stock_sync_at: now,
      updated_at: now,
    })
    .eq('id', productId)

  if (updateError) {
    throw new AppError(500, 'STOCK_UPDATE_FAILED', 'Gagal update stok produk.', updateError)
  }

  const { error: insertError } = await supabase.from('stock_checks').insert({
    product_id: productId,
    stock: response.stock ?? 0,
    raw_response: response,
  })

  if (insertError) {
    throw new AppError(500, 'STOCK_LOG_FAILED', 'Gagal menyimpan log stok.', insertError)
  }

  return {
    ...product,
    stock: response.stock ?? 0,
  }
}
