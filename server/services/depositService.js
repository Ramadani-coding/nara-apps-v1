import { AppError } from '../lib/AppError.js'
import { getSupabase } from '../lib/supabase.js'
import { premkuClient } from './premkuClient.js'

async function logDepositStatus(depositId, status, rawResponse) {
  const supabase = getSupabase()
  const { error } = await supabase.from('deposit_status_logs').insert({
    deposit_id: depositId,
    status,
    raw_response: rawResponse,
  })

  if (error) {
    throw new AppError(500, 'DEPOSIT_LOG_FAILED', 'Gagal menyimpan log deposit.', error)
  }
}

export async function createDeposit(amount) {
  const supabase = getSupabase()
  const response = await premkuClient.createDeposit(amount)
  const data = response.data
  const now = new Date().toISOString()

  const { data: deposit, error } = await supabase
    .from('deposits')
    .insert({
      provider_name: 'premku',
      provider_invoice: data.invoice,
      amount_req: data.amount_req,
      kode_unik: data.kode_unik ?? null,
      total_bayar: data.total_bayar,
      status: 'pending',
      qr_image: data.qr_image ?? null,
      qr_raw: data.qr_raw ?? null,
      expired_info: data.expired_in ?? null,
      created_at: now,
      updated_at: now,
    })
    .select('*')
    .single()

  if (error) {
    throw new AppError(500, 'DEPOSIT_INSERT_FAILED', 'Gagal menyimpan deposit.', error)
  }

  await logDepositStatus(deposit.id, 'pending', response)
  return deposit
}

export async function syncDepositStatus(invoice) {
  const supabase = getSupabase()
  const { data: deposit, error } = await supabase
    .from('deposits')
    .select('*')
    .eq('provider_invoice', invoice)
    .single()

  if (error || !deposit) {
    throw new AppError(404, 'DEPOSIT_NOT_FOUND', 'Deposit tidak ditemukan.', error)
  }

  const response = await premkuClient.checkDepositStatus(invoice)
  const data = response.data ?? {}

  const { data: updatedDeposit, error: updateError } = await supabase
    .from('deposits')
    .update({
      status: data.status ?? deposit.status,
      total_bayar: data.total_bayar ?? deposit.total_bayar,
      qr_raw: data.qr_raw ?? deposit.qr_raw,
      updated_at: new Date().toISOString(),
    })
    .eq('id', deposit.id)
    .select('*')
    .single()

  if (updateError) {
    throw new AppError(500, 'DEPOSIT_STATUS_UPDATE_FAILED', 'Gagal update status deposit.', updateError)
  }

  await logDepositStatus(deposit.id, updatedDeposit.status, response)
  return updatedDeposit
}

export async function cancelDeposit(invoice) {
  const supabase = getSupabase()
  const { data: deposit, error } = await supabase
    .from('deposits')
    .select('*')
    .eq('provider_invoice', invoice)
    .single()

  if (error || !deposit) {
    throw new AppError(404, 'DEPOSIT_NOT_FOUND', 'Deposit tidak ditemukan.', error)
  }

  const response = await premkuClient.cancelDeposit(invoice)
  const data = response.data ?? {}

  const { data: updatedDeposit, error: updateError } = await supabase
    .from('deposits')
    .update({
      status: data.status_new ?? 'canceled',
      updated_at: new Date().toISOString(),
    })
    .eq('id', deposit.id)
    .select('*')
    .single()

  if (updateError) {
    throw new AppError(500, 'DEPOSIT_CANCEL_FAILED', 'Gagal membatalkan deposit.', updateError)
  }

  await logDepositStatus(deposit.id, updatedDeposit.status, response)
  return updatedDeposit
}
