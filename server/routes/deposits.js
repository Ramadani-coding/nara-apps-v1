import { Router } from 'express'
import { requireAdminAuth } from '../middleware/requireAdminAuth.js'
import { cancelDeposit, createDeposit, syncDepositStatus } from '../services/depositService.js'

const router = Router()

router.post('/deposits', requireAdminAuth, async (req, res, next) => {
  try {
    const deposit = await createDeposit(Number(req.body?.amount))
    res.status(201).json({ success: true, data: deposit })
  } catch (error) {
    next(error)
  }
})

router.get('/deposits/:invoice', requireAdminAuth, async (req, res, next) => {
  try {
    const deposit = await syncDepositStatus(req.params.invoice)
    res.json({ success: true, data: deposit })
  } catch (error) {
    next(error)
  }
})

router.post('/deposits/:invoice/cancel', requireAdminAuth, async (req, res, next) => {
  try {
    const deposit = await cancelDeposit(req.params.invoice)
    res.json({ success: true, data: deposit })
  } catch (error) {
    next(error)
  }
})

export default router
