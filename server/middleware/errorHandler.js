import { AppError } from '../lib/AppError.js'

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.originalUrl} tidak ditemukan.`,
    },
  })
}

export function errorHandler(err, req, res, next) {
  void next

  const statusCode = err instanceof AppError ? err.statusCode : 500
  const code = err instanceof AppError ? err.code : 'INTERNAL_SERVER_ERROR'
  const message =
    err instanceof AppError ? err.message : 'Terjadi kesalahan pada server.'

  if (statusCode >= 500) {
    console.error(err)
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      details: err instanceof AppError ? err.details : undefined,
    },
  })
}
