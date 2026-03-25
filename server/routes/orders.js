import { Router } from 'express'
import { createOrder, syncOrderStatus } from '../services/orderService.js'

const router = Router()

router.post('/orders', async (req, res, next) => {
  try {
    const { productId, qty, whatsapp } = req.body ?? {}
    const order = await createOrder({
      productId,
      qty: Number(qty),
      whatsapp: String(whatsapp ?? ''),
    })
    res.status(201).json({ success: true, data: order })
  } catch (error) {
    next(error)
  }
})

router.get('/orders/:invoice', async (req, res, next) => {
  try {
    const order = await syncOrderStatus(req.params.invoice)
    res.json({ success: true, data: order })
  } catch (error) {
    next(error)
  }
})

export default router
