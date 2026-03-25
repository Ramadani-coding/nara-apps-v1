export function generateInvoice() {
  const now = new Date()
  const stamp = `${String(now.getFullYear()).slice(-2)}${String(
    now.getMonth() + 1,
  ).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
  const random = Math.floor(Math.random() * 900 + 100)

  return `NARA-INV-${stamp}${random}`
}
