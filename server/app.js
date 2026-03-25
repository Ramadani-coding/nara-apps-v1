import cors from 'cors'
import express from 'express'
import { env } from './config/env.js'
import adminRoutes from './routes/admin.js'
import catalogRoutes from './routes/catalog.js'
import depositRoutes from './routes/deposits.js'
import ordersRoutes from './routes/orders.js'
import storefrontRoutes from './routes/storefront.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'

export function createApp() {
  const app = express()
  const configuredOrigins = String(env.frontendOrigin || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
  const localhostPattern = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/i
  const allowedOrigins = Array.from(
    new Set([
      ...configuredOrigins,
      'http://localhost:5173',
      'http://127.0.0.1:5173',
    ]),
  )

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin) || localhostPattern.test(origin)) {
          callback(null, true)
          return
        }

        callback(new Error(`Origin ${origin} tidak diizinkan oleh konfigurasi CORS.`))
      },
      credentials: true,
    }),
  )
  app.use(express.json())

  app.get('/health', (req, res) => {
    res.json({ success: true, message: 'Backend Nara Premium aktif.' })
  })

  app.use('/api/admin', adminRoutes)
  app.use('/api', catalogRoutes)
  app.use('/api', ordersRoutes)
  app.use('/api', depositRoutes)
  app.use('/api', storefrontRoutes)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
