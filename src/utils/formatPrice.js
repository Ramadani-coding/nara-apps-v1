export function formatPrice(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return 'Hubungi admin'
  return new Intl.NumberFormat('id-ID').format(value)
}

export function formatRupiah(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return 'Hubungi admin'
  return `Rp${new Intl.NumberFormat('id-ID').format(value)}`
}
