import { AppError } from '../lib/AppError.js'
import { verifyAdminToken } from '../services/adminAuthService.js'

export async function requireAdminAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError(401, 'ADMIN_UNAUTHORIZED', 'Akses admin membutuhkan token.')
    }

    const token = authHeader.slice('Bearer '.length).trim()
    const session = await verifyAdminToken(token)
    req.admin = session
    next()
  } catch (error) {
    next(error)
  }
}
