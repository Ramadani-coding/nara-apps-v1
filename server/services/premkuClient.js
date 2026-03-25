import { env } from '../config/env.js'
import { AppError } from '../lib/AppError.js'
import { logProviderRequest } from './providerLogService.js'

const ERROR_MAP = {
  'API Key Invalid': ['PREMKU_API_KEY_INVALID', 401],
  'Saldo Kurang': ['PREMKU_INSUFFICIENT_BALANCE', 400],
  'Saldo tidak mencukupi.': ['PREMKU_INSUFFICIENT_BALANCE', 400],
  'Stok Habis': ['PREMKU_OUT_OF_STOCK', 409],
  'Action Invalid': ['PREMKU_INVALID_ACTION', 400],
}

function resolveError(message) {
  return ERROR_MAP[message] ?? ['PREMKU_REQUEST_FAILED', 502]
}

async function postToPremku(endpoint, payload, { retry = 0 } = {}) {
  const url = `${env.premkuBaseUrl.replace(/\/$/, '')}/${endpoint}`
  const requestBody = {
    api_key: env.premkuApiKey,
    ...payload,
  }

  let attempts = 0
  let lastError

  while (attempts <= retry) {
    attempts += 1
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })

      const json = await response.json()

      await logProviderRequest({
        endpoint,
        requestBody,
        responseBody: json,
        httpStatus: response.status,
        success: Boolean(json?.success),
        errorCode: json?.success ? null : resolveError(json?.message ?? '')[0],
      })

      if (!response.ok || !json?.success) {
        const [code, statusCode] = resolveError(json?.message ?? '')
        throw new AppError(statusCode, code, json?.message ?? 'Request ke Premku gagal.', {
          endpoint,
          response: json,
        })
      }

      return json
    } catch (error) {
      lastError = error
      if (attempts > retry) break
    }
  }

  throw lastError
}

export const premkuClient = {
  profile() {
    return postToPremku('profile', {}, { retry: 1 })
  },
  listProducts() {
    return postToPremku('products', {}, { retry: 1 })
  },
  checkStock(productId) {
    return postToPremku('stock', { product_id: productId }, { retry: 1 })
  },
  createOrder({ productId, qty, whatsapp }) {
    return postToPremku('order', {
      product_id: productId,
      qty,
      whatsapp,
    })
  },
  checkOrderStatus(invoice) {
    return postToPremku('status', { invoice }, { retry: 1 })
  },
  createDeposit(amount) {
    return postToPremku('pay', { amount })
  },
  checkDepositStatus(invoice) {
    return postToPremku('pay_status', { invoice }, { retry: 1 })
  },
  cancelDeposit(invoice) {
    return postToPremku('cancel_pay', { invoice })
  },
}
