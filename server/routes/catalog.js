import { Router } from 'express'
import { requireAdminAuth } from '../middleware/requireAdminAuth.js'
import { getCatalogProduct, listCatalog } from '../services/catalogService.js'
import { syncCatalog } from '../services/catalogService.js'
import { checkProductStock } from '../services/stockService.js'

const router = Router()

router.post('/catalog/sync', requireAdminAuth, async (req, res, next) => {
  try {
    const products = await syncCatalog({ updatedBy: req.admin.adminUserId })
    res.json({ success: true, data: products })
  } catch (error) {
    next(error)
  }
})

router.get('/products', async (req, res, next) => {
  try {
    const products = await listCatalog()
    res.json({ success: true, data: products })
  } catch (error) {
    next(error)
  }
})

router.get('/products/:productId', async (req, res, next) => {
  try {
    const product = await getCatalogProduct(req.params.productId)
    res.json({ success: true, data: product })
  } catch (error) {
    next(error)
  }
})

router.get('/products/:productId/stock', async (req, res, next) => {
  try {
    const product = await checkProductStock(req.params.productId)
    res.json({ success: true, data: product })
  } catch (error) {
    next(error)
  }
})

export default router
