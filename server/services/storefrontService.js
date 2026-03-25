import { storefrontCatalog } from '../config/storefrontCatalog.js'
import { AppError } from '../lib/AppError.js'
import { listCatalog } from './catalogService.js'
import { createOrder, syncOrderStatus } from './orderService.js'

function buildStorefrontVariant(variantConfig, catalogProduct, includeInternal = false) {
  const variant = {
    id: variantConfig.id,
    label: variantConfig.label,
    duration: variantConfig.duration,
    description: catalogProduct.description || variantConfig.description || '',
    stock: catalogProduct.stock ?? 0,
    price: catalogProduct.sellPrice ?? 0,
    providerProductId: catalogProduct.providerProductId,
  }

  if (includeInternal) {
    variant.catalogProductId = catalogProduct.id
  }

  return variant
}

function buildStorefrontProduct(productConfig, catalogMap, { includeInternal = false } = {}) {
  const variants = productConfig.variants
    .map((variantConfig) => {
      const catalogProduct = catalogMap.get(variantConfig.providerProductId)
      if (!catalogProduct) return null
      return buildStorefrontVariant(variantConfig, catalogProduct, includeInternal)
    })
    .filter(Boolean)

  if (!variants.length) return null

  const descriptionSourceVariantId =
    productConfig.descriptionSourceVariantId ?? variants[0]?.id ?? ''
  const descriptionSourceVariant =
    variants.find((variant) => variant.id === descriptionSourceVariantId) ?? variants[0]
  const descriptionSourceCatalogProduct = descriptionSourceVariant
    ? catalogMap.get(descriptionSourceVariant.providerProductId)
    : null

  return {
    id: productConfig.id,
    slug: productConfig.slug,
    name: productConfig.name,
    category: productConfig.category,
    image: productConfig.image,
    imageUrl: descriptionSourceCatalogProduct?.imageUrl ?? '',
    description:
      descriptionSourceCatalogProduct?.description || productConfig.description || '',
    variants,
  }
}

async function getCatalogMap() {
  const catalog = await listCatalog()
  return new Map(catalog.map((product) => [product.providerProductId, product]))
}

function decorateOrder(order, storefrontMatch, paymentMethod = '') {
  const product = storefrontMatch
    ? {
        id: storefrontMatch.product.id,
        slug: storefrontMatch.product.slug,
        name: storefrontMatch.product.name,
        category: storefrontMatch.product.category,
        image: storefrontMatch.product.image,
        imageUrl: storefrontMatch.product.imageUrl,
        description: storefrontMatch.product.description,
      }
    : {
        id: null,
        slug: '',
        name: order.product,
        category: '',
        image: 'generic',
        imageUrl: '',
        description: '',
      }

  const variant = storefrontMatch
    ? {
        id: storefrontMatch.variant.id,
        label: storefrontMatch.variant.label,
        duration: storefrontMatch.variant.duration,
        description: storefrontMatch.variant.description,
      }
    : {
        id: '',
        label: '',
        duration: '',
        description: '',
      }

  return {
    invoice: order.invoice,
    status: order.status,
    product,
    variant,
    qty: order.qty,
    paymentMethod,
    phoneNumber: order.phoneNumber ?? '',
    sellUnitPrice: order.sellUnitPrice,
    subtotal: order.subtotal,
    accounts: order.accounts ?? [],
  }
}

export async function listStorefrontProducts() {
  const catalogMap = await getCatalogMap()
  return storefrontCatalog
    .map((productConfig) => buildStorefrontProduct(productConfig, catalogMap))
    .filter(Boolean)
}

export async function getStorefrontProductBySlug(slug, options = {}) {
  const productConfig = storefrontCatalog.find((product) => product.slug === slug)
  if (!productConfig) {
    throw new AppError(404, 'STOREFRONT_PRODUCT_NOT_FOUND', 'Produk storefront tidak ditemukan.')
  }

  const catalogMap = await getCatalogMap()
  const product = buildStorefrontProduct(productConfig, catalogMap, options)

  if (!product) {
    throw new AppError(
      404,
      'STOREFRONT_PRODUCT_UNAVAILABLE',
      'Produk storefront belum punya item provider yang aktif.',
    )
  }

  return product
}

export async function findStorefrontVariant(slug, variantId) {
  const product = await getStorefrontProductBySlug(slug, { includeInternal: true })
  const variant = product.variants.find((item) => item.id === variantId)

  if (!variant) {
    throw new AppError(404, 'STOREFRONT_VARIANT_NOT_FOUND', 'Varian storefront tidak ditemukan.')
  }

  return { product, variant }
}

export async function findStorefrontVariantByCatalogProductId(catalogProductId) {
  const catalogMap = await getCatalogMap()

  for (const productConfig of storefrontCatalog) {
    const product = buildStorefrontProduct(productConfig, catalogMap, { includeInternal: true })
    if (!product) continue

    const variant = product.variants.find((item) => item.catalogProductId === catalogProductId)
    if (variant) {
      return { product, variant }
    }
  }

  return null
}

export async function createStorefrontOrder({
  slug,
  variantId,
  qty,
  whatsapp,
  paymentMethod,
}) {
  const { product, variant } = await findStorefrontVariant(slug, variantId)
  const order = await createOrder({
    productId: variant.catalogProductId,
    qty,
    whatsapp,
    paymentMethod,
  })

  return decorateOrder(
    order,
    {
      product,
      variant,
    },
    paymentMethod,
  )
}

export async function getStorefrontOrder(invoice) {
  const order = await syncOrderStatus(invoice)
  const storefrontMatch = order.catalogProductId
    ? await findStorefrontVariantByCatalogProductId(order.catalogProductId)
    : null

  return decorateOrder(order, storefrontMatch, order.paymentMethod ?? '')
}
