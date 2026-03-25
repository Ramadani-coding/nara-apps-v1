import { getVariantSellPrice } from '../../utils/pricing'

function OrderSummaryCard({ product, variant, checkout, formatRupiah }) {
  const quantity = checkout?.quantity ?? 1
  const paymentMethod = checkout?.paymentMethod ?? 'QRIS'
  const phoneNumber = checkout?.phoneNumber ?? '-'
  const total = checkout?.subtotal ?? getVariantSellPrice(variant) * quantity

  return (
    <div className="nara-card px-5 py-5 sm:px-6">
      <h2 className="text-[16px] font-bold text-nara-ink">Ringkasan Order</h2>
      <div className="mt-4 space-y-3 text-sm">
        <div className="flex items-start justify-between gap-4">
          <span className="text-nara-muted">Produk</span>
          <span className="max-w-[60%] text-right font-bold text-nara-ink">
            {product.name}
          </span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <span className="text-nara-muted">Varian</span>
          <span className="max-w-[60%] text-right font-bold text-nara-ink">
            {variant.label}
          </span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <span className="text-nara-muted">Qty</span>
          <span className="max-w-[60%] text-right font-bold text-nara-ink">{quantity}</span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <span className="text-nara-muted">Pembayaran</span>
          <span className="max-w-[60%] text-right font-bold text-nara-ink">
            {paymentMethod}
          </span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <span className="text-nara-muted">No. WhatsApp</span>
          <span className="max-w-[60%] text-right font-bold text-nara-ink">
            {phoneNumber}
          </span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <span className="text-nara-muted">Total</span>
          <span className="font-bold text-nara-green">
            {formatRupiah(total)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default OrderSummaryCard
