import products from '../data/products.json'

export function getProducts() {
  return products
}

export function getProductBySlug(slug) {
  return products.find((product) => product.slug === slug)
}

export function getProductById(productId) {
  return products.find((product) => product.id === productId)
}

export function getVariantById(product, variantId) {
  return product?.variants.find((variant) => variant.id === variantId)
}
