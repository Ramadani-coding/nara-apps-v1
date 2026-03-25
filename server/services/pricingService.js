import { AppError } from '../lib/AppError.js'
import { getSupabase } from '../lib/supabase.js'

export function buildSellPrice(basePrice, marginAmount = 0) {
  return Number(basePrice) + Number(marginAmount || 0)
}

export async function listPricingByProductIds(productIds) {
  if (!productIds.length) return []

  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('product_pricing')
    .select('*')
    .in('product_id', productIds)

  if (error) {
    throw new AppError(500, 'PRICING_QUERY_FAILED', 'Gagal membaca data pricing.', error)
  }

  return data ?? []
}

export async function upsertProductPricing({
  productId,
  basePrice,
  marginAmount = 0,
  updatedBy = null,
}) {
  const supabase = getSupabase()
  const sellPrice = buildSellPrice(basePrice, marginAmount)

  const { data, error } = await supabase
    .from('product_pricing')
    .upsert(
      {
        product_id: productId,
        base_price: basePrice,
        margin_amount: marginAmount,
        sell_price: sellPrice,
        updated_by: updatedBy,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'product_id' },
    )
    .select()
    .single()

  if (error) {
    throw new AppError(500, 'PRICING_UPSERT_FAILED', 'Gagal menyimpan pricing.', error)
  }

  return data
}
