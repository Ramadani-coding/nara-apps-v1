import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import EmptyState from '../components/common/EmptyState'
import InvoiceInput from '../components/common/InvoiceInput'
import PrimaryButton from '../components/common/PrimaryButton'
import PhoneHero from '../components/layout/PhoneHero'
import AccountCredentialCard from '../components/order/AccountCredentialCard'
import OrderStatusCard from '../components/order/OrderStatusCard'
import { normalizeInvoice } from '../utils/normalizeInvoice'
import { getStorefrontOrder } from '../utils/storefrontApi'

function OrderStatusPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const prefilledInvoice = normalizeInvoice(searchParams.get('invoice') ?? '')
  const [invoice, setInvoice] = useState(prefilledInvoice)
  const [searchedInvoice, setSearchedInvoice] = useState(prefilledInvoice)
  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(Boolean(prefilledInvoice))
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadOrder() {
      if (!searchedInvoice) {
        setOrder(null)
        setError('')
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError('')

      try {
        const data = await getStorefrontOrder(searchedInvoice)
        if (!isMounted) return
        setOrder(data)
      } catch (loadError) {
        if (!isMounted) return
        setOrder(null)
        setError(loadError.message || 'Invoice tidak ditemukan di backend.')
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadOrder()
    return () => {
      isMounted = false
    }
  }, [searchedInvoice])

  function handleSearch() {
    if (!invoice.trim()) return
    setSearchedInvoice(normalizeInvoice(invoice))
  }

  const hasSearched = Boolean(searchedInvoice)
  const status = order?.status === 'success' ? 'success' : order?.status ? 'pending' : 'not-found'
  const account = order?.accounts?.[0] ?? null

  return (
    <div className="space-y-6 pb-10 md:space-y-7">
      <PhoneHero
        compact
        showBackButton
        title="Order Status"
        subtitle="Invoice dicek langsung dari backend tanpa mengandalkan browser lokal."
      />

      <div className="space-y-4 px-1 sm:space-y-5">
        <InvoiceInput
          label="Invoice"
          value={invoice}
          onChange={(event) => setInvoice(event.target.value)}
          onSubmit={handleSearch}
        />

        {hasSearched ? (
          isLoading ? (
            <EmptyState
              title="Memuat status invoice"
              description="Sedang mengambil status order terbaru dari backend."
            />
          ) : order ? (
            <>
              <OrderStatusCard
                status={status}
                title={status === 'success' ? 'Order berhasil' : 'Status: Pending'}
                description={
                  status === 'success'
                    ? 'Status order sudah success dan akun provider siap digunakan.'
                    : 'Order masih diproses atau menunggu status success dari provider.'
                }
              />

              {status === 'success' ? (
                <>
                  <AccountCredentialCard
                    username={account?.username}
                    password={account?.password}
                  />
                  <div className="rounded-[22px] bg-nara-accent-soft px-5 py-4">
                    <h2 className="text-base font-bold text-[#b45c31]">Catatan penggunaan</h2>
                    <p className="mt-2 text-sm leading-6 text-[#b45c31]">
                      Jangan ubah password tanpa arahan. Simpan invoice untuk cek ulang jika dibutuhkan.
                    </p>
                  </div>
                  <PrimaryButton
                    tone="navy"
                    className="w-full rounded-[22px] py-4 text-[15px]"
                    onClick={() => navigate('/')}
                  >
                    Beli Layanan Lain
                  </PrimaryButton>
                </>
              ) : (
                <PrimaryButton
                  tone="navy"
                  className="w-full rounded-[22px] py-4 text-[15px]"
                  onClick={() => navigate('/')}
                >
                  Kembali ke Home
                </PrimaryButton>
              )}
            </>
          ) : (
            <>
              <OrderStatusCard
                status="not-found"
                title="Invoice tidak ditemukan"
                description={error || 'Cek lagi format invoice atau pastikan order sudah berhasil dibuat.'}
              />
              <div className="rounded-[24px] bg-nara-accent-soft px-5 py-5">
                <h2 className="text-[16px] font-bold text-[#b45c31]">Rangkuman UX</h2>
                <p className="mt-3 text-sm leading-7 text-[#b45c31]">
                  Status selalu diambil ulang dari backend agar invoice yang dicek tetap sinkron.
                </p>
              </div>
              <PrimaryButton
                tone="navy"
                className="w-full rounded-[22px] py-4 text-[15px]"
                onClick={() => navigate('/')}
              >
                Kembali ke Home
              </PrimaryButton>
            </>
          )
        ) : (
          <EmptyState
            title="Belum ada invoice dicek"
            description="Masukkan nomor invoice untuk melihat status order premium kamu."
          />
        )}
      </div>
    </div>
  )
}

export default OrderStatusPage
