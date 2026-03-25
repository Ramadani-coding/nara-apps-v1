import { Router } from 'express'
import { AppError } from '../lib/AppError.js'
import {
  createStorefrontOrder,
  getStorefrontOrder,
  getStorefrontProductBySlug,
  listStorefrontProducts,
} from '../services/storefrontService.js'

const router = Router()

router.get('/storefront/products', async (req, res, next) => {
  try {
    const products = await listStorefrontProducts()
    res.json({ success: true, data: products })
  } catch (error) {
    next(error)
  }
})

router.get('/storefront/products/:slug', async (req, res, next) => {
  try {
    const product = await getStorefrontProductBySlug(req.params.slug)
    res.json({ success: true, data: product })
  } catch (error) {
    next(error)
  }
})

router.post('/storefront/orders', async (req, res, next) => {
  try {
    const { slug = '', variantId = '', qty = 1, whatsapp = '', paymentMethod = '' } = req.body ?? {}
    const quantity = Math.max(1, Number(qty || 1))

    if (!slug || !variantId || !String(whatsapp).trim()) {
      throw new AppError(
        400,
        'STOREFRONT_ORDER_INVALID',
        'Slug, variant, quantity, dan WhatsApp wajib diisi.',
      )
    }

    const order = await createStorefrontOrder({
      slug: String(slug),
      variantId: String(variantId),
      qty: quantity,
      whatsapp: String(whatsapp).trim(),
      paymentMethod: String(paymentMethod || 'QRIS'),
    })

    res.status(201).json({ success: true, data: order })
  } catch (error) {
    next(error)
  }
})

router.get('/storefront/orders/:invoice', async (req, res, next) => {
  try {
    const order = await getStorefrontOrder(req.params.invoice)
    res.json({ success: true, data: order })
  } catch (error) {
    next(error)
  }
})

export default router
