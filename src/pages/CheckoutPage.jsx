import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import InvoiceCard from '../components/checkout/InvoiceCard'
import OrderSummaryCard from '../components/checkout/OrderSummaryCard'
import QRCodeCard from '../components/checkout/QRCodeCard'
import PrimaryButton from '../components/common/PrimaryButton'
import PhoneHero from '../components/layout/PhoneHero'
import StickyCTA from '../components/layout/StickyCTA'
import { useCheckout } from '../context/useCheckout'
import { formatRupiah } from '../utils/formatPrice'
import { getVariantSellPrice } from '../utils/pricing'
import { createStorefrontOrder } from '../utils/storefrontApi'

function CheckoutPage() {
  const navigate = useNavigate()
  const { checkout, setCheckout } = useCheckout()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const product = useMemo(() => checkout?.product ?? null, [checkout?.product])
  const variant = useMemo(() => checkout?.variant ?? null, [checkout?.variant])
  const quantity = checkout?.quantity ?? 1
  const sellPrice = variant ? getVariantSellPrice(variant) : 0
  const totalPrice = sellPrice * quantity

  useEffect(() => {
    if (!checkout || !product || !variant) return
    const nextSubtotal = getVariantSellPrice(variant) * (checkout.quantity ?? 1)

    if (checkout.subtotal === nextSubtotal) {
      return
    }

    setCheckout({
      ...checkout,
      subtotal: nextSubtotal,
    })
  }, [checkout, product, setCheckout, variant])

  if (!checkout || !product || !variant) {
    return <Navigate to="/" replace />
  }

  async function handlePaymentSuccess() {
    setIsSubmitting(true)
    setError('')

    try {
      const order = await createStorefrontOrder({
        slug: product.slug,
        variantId: variant.id,
        qty: checkout.quantity ?? 1,
        whatsapp: checkout.phoneNumber ?? '',
        paymentMethod: checkout.paymentMethod ?? 'QRIS',
      })

      setCheckout({
        ...checkout,
        invoice: order.invoice,
        status: order.status,
        subtotal: order.subtotal,
      })

      navigate(`/order-status?invoice=${encodeURIComponent(order.invoice)}`)
    } catch (createError) {
      setError(createError.message || 'Order belum berhasil dibuat dari backend.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 pb-28 md:space-y-7 md:pb-10">
      <PhoneHero
        compact
        showBackButton
        title="Checkout"
        subtitle="Satu langkah lagi sebelum order dikirim ke backend."
      >
        <div className="flex flex-wrap gap-2 pt-2">
          <span className="rounded-full bg-[#fff2e9] px-4 py-2 text-[11px] font-bold text-[#c36c34]">
            1 Produk
          </span>
          <span className="rounded-full bg-nara-navy px-4 py-2 text-[11px] font-bold text-white">
            2 Checkout
          </span>
          <span className="rounded-full bg-[#fff2e9] px-4 py-2 text-[11px] font-bold text-[#c36c34]">
            3 Status
          </span>
        </div>
      </PhoneHero>

      <div className="space-y-4 px-1 sm:space-y-5">
        <OrderSummaryCard
          product={product}
          variant={variant}
          checkout={checkout}
          formatRupiah={formatRupiah}
        />
        <InvoiceCard invoice={checkout?.invoice || 'Invoice akan dibuat setelah simulasi pembayaran'} />
        <QRCodeCard />
        {error ? (
          <div className="rounded-[20px] border border-nara-red/20 bg-nara-red-soft px-4 py-4 text-sm font-medium text-nara-red">
            {error}
          </div>
        ) : null}
      </div>

      <StickyCTA>
        <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm text-nara-muted">Bayar total</p>
            <p className="text-[25px] font-bold leading-none text-nara-ink">
              {formatRupiah(totalPrice)}
            </p>
          </div>
          <PrimaryButton
            className="w-full min-w-[174px] sm:w-auto"
            disabled={isSubmitting}
            onClick={handlePaymentSuccess}
          >
            {isSubmitting ? 'Memproses Order...' : 'Simulasikan Berhasil'}
          </PrimaryButton>
        </div>
      </StickyCTA>
    </div>
  )
}

export default CheckoutPage
