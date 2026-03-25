import { useEffect, useMemo, useState } from 'react'
import PrimaryButton from '../common/PrimaryButton'
import ProductArtwork from './ProductArtwork'
import { formatPrice, formatRupiah } from '../../utils/formatPrice'
import { getVariantSellPrice } from '../../utils/pricing'

const PAYMENT_METHODS = [
  {
    id: 'qris',
    label: 'QRIS',
    description: 'Scan cepat untuk semua e-wallet yang mendukung QRIS.',
  },
  {
    id: 'dana',
    label: 'DANA',
    description: 'Bayar praktis langsung dari akun DANA kamu.',
  },
  {
    id: 'gopay',
    label: 'GoPay',
    description: 'Cocok untuk pembayaran cepat dari aplikasi Gojek.',
  },
  {
    id: 'shopeepay',
    label: 'ShopeePay',
    description: 'Alternatif pembayaran instan lewat ShopeePay.',
  },
]

function QuantityButton({ children, disabled = false, onClick }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-11 w-11 items-center justify-center rounded-[16px] border border-nara-line/80 bg-white text-xl font-bold text-nara-ink transition hover:border-nara-accent/60 disabled:cursor-not-allowed disabled:opacity-45"
    >
      {children}
    </button>
  )
}

function PaymentOption({ option, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-start gap-3 rounded-[20px] border px-4 py-4 text-left transition ${
        active
          ? 'border-[#8b7dff] bg-[#faf8ff] shadow-[0_14px_30px_rgba(111,85,255,0.12)]'
          : 'border-nara-line/80 bg-white hover:border-nara-accent/40'
      }`}
    >
      <span
        className={`mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] text-sm font-extrabold ${
          active ? 'bg-[#efeaff] text-[#6f55ff]' : 'bg-[#fff5ef] text-nara-accent'
        }`}
      >
        {option.label.slice(0, 2)}
      </span>
      <span className="min-w-0">
        <span className="block text-[14px] font-bold leading-5 text-nara-ink">
          {option.label}
        </span>
        <span className="mt-1 block text-[13px] leading-5 text-nara-muted">
          {option.description}
        </span>
      </span>
      <span
        className={`mt-1 ml-auto inline-flex h-5 w-5 shrink-0 rounded-full border-2 ${
          active ? 'border-[#8b7dff] bg-[#8b7dff]' : 'border-nara-line bg-white'
        }`}
      >
        {active ? <span className="m-auto h-2.5 w-2.5 rounded-full bg-white" /> : null}
      </span>
    </button>
  )
}

function OrderConfirmationModal({ product, variant, onClose, onConfirm }) {
  const [quantity, setQuantity] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0].id)
  const [phoneNumber, setPhoneNumber] = useState('')
  const unitPrice = getVariantSellPrice(variant)
  const itemDescription = variant.description || product.description

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleEscape(event) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  const paymentOption = useMemo(
    () => PAYMENT_METHODS.find((option) => option.id === paymentMethod),
    [paymentMethod],
  )

  const totalPrice = unitPrice * quantity
  const canDecrease = quantity > 1
  const canIncrease = quantity < variant.stock
  const normalizedPhone = phoneNumber.trim()

  function handleQuantityChange(nextValue) {
    const safeValue = Math.min(Math.max(nextValue, 1), variant.stock)
    setQuantity(safeValue)
  }

  function handlePhoneChange(event) {
    const sanitized = event.target.value.replace(/[^\d+]/g, '')
    setPhoneNumber(sanitized)
  }

  function handleConfirm() {
    if (!normalizedPhone) return

    onConfirm({
      quantity,
      paymentMethod: paymentOption?.label ?? PAYMENT_METHODS[0].label,
      phoneNumber: normalizedPhone,
      subtotal: totalPrice,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#161b2a]/45 p-3 sm:items-center sm:p-6">
      <div className="nara-card max-h-[92vh] w-full max-w-[540px] overflow-y-auto rounded-[30px] px-4 py-4 sm:px-6 sm:py-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-nara-muted">
              Konfirmasi Pesanan
            </p>
            <h2 className="mt-1 text-[22px] font-extrabold tracking-[-0.03em] text-nara-ink">
              Cek lagi sebelum lanjut
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup popup"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#fff3ec] text-xl font-bold text-nara-accent transition hover:brightness-105"
          >
            x
          </button>
        </div>

        <div className="mt-5 rounded-[24px] border border-nara-line/80 bg-[#fffdfb] p-4">
          <div className="flex items-start gap-4">
            <div className="flex h-[96px] w-[96px] shrink-0 items-center justify-center rounded-[22px] bg-white">
              <ProductArtwork
                image={product.image}
                imageUrl={product.imageUrl}
                name={product.name}
                variant="variant-card"
              />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-nara-muted">
                Item Dipilih
              </p>
              <h3 className="mt-1 text-[18px] font-bold leading-6 text-nara-ink">
                {product.name} {variant.label}
              </h3>
              <p className="mt-2 text-[13px] leading-6 text-nara-muted">
                {itemDescription}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-[18px] border border-nara-line/70 bg-white px-4 py-3">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-nara-muted">Harga Satuan</span>
              <span className="font-bold text-nara-ink">{formatRupiah(unitPrice)}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-5">
          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-[15px] font-bold text-nara-ink">Jumlah</h3>
              <span className="text-[12px] font-medium text-nara-muted">
                Maks {formatPrice(variant.stock)}
              </span>
            </div>
            <div className="flex items-center rounded-[22px] border border-nara-line/80 bg-[#fffdfb] p-2">
              <QuantityButton
                disabled={!canDecrease}
                onClick={() => handleQuantityChange(quantity - 1)}
              >
                -
              </QuantityButton>
              <span className="flex-1 text-center text-[22px] font-extrabold text-nara-ink">
                {quantity}
              </span>
              <QuantityButton
                disabled={!canIncrease}
                onClick={() => handleQuantityChange(quantity + 1)}
              >
                +
              </QuantityButton>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-[15px] font-bold text-nara-ink">Metode Pembayaran</h3>
            <div className="space-y-3">
              {PAYMENT_METHODS.map((option) => (
                <PaymentOption
                  key={option.id}
                  option={option}
                  active={paymentMethod === option.id}
                  onClick={() => setPaymentMethod(option.id)}
                />
              ))}
            </div>
          </section>

          <section>
            <label className="block text-[15px] font-bold text-nara-ink" htmlFor="phone-number">
              Nomor WhatsApp (Aktif)
            </label>
            <input
              id="phone-number"
              type="tel"
              inputMode="tel"
              placeholder="08xxxxxxxxxx"
              value={phoneNumber}
              onChange={handlePhoneChange}
              className="mt-3 w-full rounded-[20px] border border-nara-line/80 bg-white px-4 py-3.5 text-[15px] text-nara-ink outline-none transition placeholder:text-nara-muted focus:border-nara-accent/60"
            />
            <p className="mt-2 text-[12px] leading-5 text-nara-muted">
              Nomor ini dipakai admin jika ada kendala atau perlu konfirmasi pesanan.
            </p>
          </section>
        </div>

        <div className="mt-6 rounded-[22px] bg-[#fff2ea] px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[14px] font-medium text-[#b45c31]">Total Pembayaran</span>
            <span className="text-[22px] font-extrabold tracking-[-0.03em] text-nara-accent">
              {formatRupiah(totalPrice)}
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <PrimaryButton
            tone="navy"
            className="w-full sm:w-auto sm:min-w-[140px]"
            onClick={onClose}
          >
            Batal
          </PrimaryButton>
          <PrimaryButton
            className="w-full sm:w-auto sm:min-w-[160px]"
            disabled={!normalizedPhone}
            onClick={handleConfirm}
          >
            Beli Sekarang
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmationModal
