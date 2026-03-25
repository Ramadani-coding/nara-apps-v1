import { getSupabase } from '../lib/supabase.js'

function maskRequestBody(payload) {
  if (!payload || typeof payload !== 'object') return payload

  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => {
      if (key.toLowerCase().includes('api_key')) return [key, '***masked***']
      return [key, value]
    }),
  )
}

export async function logProviderRequest({
  providerName = 'premku',
  endpoint,
  requestBody,
  responseBody,
  httpStatus,
  success,
  errorCode = null,
}) {
  try {
    const supabase = getSupabase()
    await supabase.from('provider_request_logs').insert({
      provider_name: providerName,
      endpoint,
      request_body_masked: maskRequestBody(requestBody),
      response_body: responseBody,
      http_status: httpStatus,
      success,
      error_code: errorCode,
    })
  } catch (error) {
    console.warn('Failed to write provider request log:', error.message)
  }
}
