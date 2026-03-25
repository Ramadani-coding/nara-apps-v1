import { AppError } from '../lib/AppError.js'
import { getSupabase } from '../lib/supabase.js'
import { listPricingByProductIds, upsertProductPricing } from './pricingService.js'
import { premkuClient } from './premkuClient.js'

function mapCatalogProduct(product, pricing) {
  const basePrice = pricing?.base_price ?? 0
  const marginAmount = pricing?.margin_amount ?? 0
  return {
    id: product.id,
    providerProductId: product.provider_product_id,
    name: product.name,
    description: product.description,
    imageUrl: product.image_url,
    providerStatus: product.provider_status,
    stock: product.stock,
    basePrice,
    marginAmount,
    sellPrice: pricing?.sell_price ?? basePrice + marginAmount,
  }
}

export async function syncCatalog({ updatedBy = null } = {}) {
  const supabase = getSupabase()
  const response = await premkuClient.listProducts()
  const products = response.products ?? []
  const now = new Date().toISOString()

  const upsertPayload = products.map((item) => ({
    provider_name: 'premku',
    provider_product_id: item.id,
    name: item.name,
    description: item.description ?? null,
    image_url: item.image ?? null,
    provider_status: item.status ?? 'unknown',
    stock: item.stock ?? null,
    last_stock_sync_at: now,
    is_active: item.status !== 'unavailable',
    updated_at: now,
  }))

  const { data, error } = await supabase
    .from('products')
    .upsert(upsertPayload, { onConflict: 'provider_product_id' })
    .select('*')

  if (error) {
    throw new AppError(500, 'CATALOG_SYNC_FAILED', 'Gagal menyimpan katalog provider.', error)
  }

  const existingPricing = await listPricingByProductIds((data ?? []).map((item) => item.id))
  const marginMap = new Map(existingPricing.map((item) => [item.product_id, item.margin_amount ?? 0]))

  for (const product of data ?? []) {
    const providerProduct = products.find((item) => item.id === product.provider_product_id)
    await upsertProductPricing({
      productId: product.id,
      basePrice: providerProduct?.price ?? 0,
      marginAmount: marginMap.get(product.id) ?? 0,
      updatedBy,
    })
  }

  return listCatalog()
}

export async function listCatalog() {
  const supabase = getSupabase()
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    throw new AppError(500, 'CATALOG_QUERY_FAILED', 'Gagal membaca katalog.', error)
  }

  if (!products?.length) {
    return []
  }

  const pricingRows = await listPricingByProductIds(products.map((item) => item.id))
  const pricingMap = new Map(pricingRows.map((row) => [row.product_id, row]))
  return products.map((product) => mapCatalogProduct(product, pricingMap.get(product.id)))
}

export async function getCatalogProduct(productId) {
  const supabase = getSupabase()
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single()

  if (error || !product) {
    throw new AppError(404, 'PRODUCT_NOT_FOUND', 'Produk tidak ditemukan.', error)
  }

  const pricingRows = await listPricingByProductIds([product.id])
  return mapCatalogProduct(product, pricingRows[0])
}
