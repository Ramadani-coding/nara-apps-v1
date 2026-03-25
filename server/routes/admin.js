import { Router } from 'express'
import { requireAdminAuth } from '../middleware/requireAdminAuth.js'
import { loginAdmin, logoutAdmin } from '../services/adminAuthService.js'
import { getCatalogProduct, listCatalog, syncCatalog } from '../services/catalogService.js'
import { listOrders, syncOrderStatus } from '../services/orderService.js'
import { upsertProductPricing } from '../services/pricingService.js'
import { getProviderProfile } from '../services/profileService.js'

const router = Router()

router.post('/login', async (req, res, next) => {
  try {
    const { username = '', password = '' } = req.body ?? {}
    const result = await loginAdmin({
      username: String(username).trim(),
      password: String(password),
    })
    res.json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
})

router.post('/logout', requireAdminAuth, async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader.slice('Bearer '.length).trim()
    await logoutAdmin(token)
    res.json({ success: true })
  } catch (error) {
    next(error)
  }
})

router.get('/me', requireAdminAuth, async (req, res) => {
  res.json({ success: true, data: req.admin })
})

router.get('/dashboard', requireAdminAuth, async (req, res, next) => {
  try {
    const [products, orders, providerProfile] = await Promise.all([
      listCatalog(),
      listOrders(),
      getProviderProfile(),
    ])

    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.subtotal || 0), 0)
    const pendingOrders = orders.filter((order) =>
      ['created', 'pending', 'processing'].includes(String(order.provider_status || '').toLowerCase()),
    ).length
    const successOrders = orders.filter(
      (order) => String(order.provider_status || '').toLowerCase() === 'success',
    ).length

    res.json({
      success: true,
      data: {
        stats: {
          totalProducts: products.length,
          totalVariants: products.length,
          totalOrders: orders.length,
          pendingOrders,
          successOrders,
          totalRevenue,
        },
        providerProfile,
      },
    })
  } catch (error) {
    next(error)
  }
})

router.get('/products', requireAdminAuth, async (req, res, next) => {
  try {
    const products = await listCatalog()
    res.json({ success: true, data: products })
  } catch (error) {
    next(error)
  }
})

router.patch('/variants/:variantId/margin', requireAdminAuth, async (req, res, next) => {
  try {
    const { variantId } = req.params
    const marginAmount = Math.max(0, Number(req.body?.marginAmount ?? 0))
    const products = await listCatalog()
    const product = products.find((item) => item.id === variantId)

    if (!product) {
      res.status(404).json({
        success: false,
        error: { code: 'PRODUCT_NOT_FOUND', message: 'Produk/varian tidak ditemukan.' },
      })
      return
    }

    await upsertProductPricing({
      productId: product.id,
      basePrice: product.basePrice,
      marginAmount,
      updatedBy: req.admin.adminUserId,
    })

    const updatedProduct = await getCatalogProduct(product.id)
    res.json({ success: true, data: updatedProduct })
  } catch (error) {
    next(error)
  }
})

router.get('/orders', requireAdminAuth, async (req, res, next) => {
  try {
    const orders = await listOrders()
    res.json({ success: true, data: orders })
  } catch (error) {
    next(error)
  }
})

router.get('/orders/:invoice', requireAdminAuth, async (req, res, next) => {
  try {
    const order = await syncOrderStatus(req.params.invoice)
    res.json({ success: true, data: order })
  } catch (error) {
    next(error)
  }
})

router.post('/catalog/sync', requireAdminAuth, async (req, res, next) => {
  try {
    const products = await syncCatalog({ updatedBy: req.admin.adminUserId })
    res.json({ success: true, data: products })
  } catch (error) {
    next(error)
  }
})

export default router
