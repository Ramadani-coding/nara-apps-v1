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
  const hasPrefilledInvoice = Boolean(prefilledInvoice)

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
  const statusDescription =
    status === 'success'
      ? 'Pembayaran sudah lunas dan detail akun premium siap dipakai.'
      : status === 'pending'
        ? 'Pesanan masih diproses. Cek ulang beberapa saat lagi untuk melihat update terbarunya.'
        : error || 'Cek lagi format invoice atau pastikan order sudah berhasil dibuat.'

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
          readOnly={hasPrefilledInvoice}
        />

        {hasSearched ? (
          isLoading ? (
            <EmptyState
              title="Memuat status invoice"
              description="Sedang mengambil status order terbaru dari backend."
            />
          ) : order ? (
            <div className="space-y-4 sm:space-y-5">
              <OrderStatusCard
                status={status}
                invoice={order.invoice}
                title={status === 'success' ? 'Order berhasil' : 'Status Pending'}
                description={statusDescription}
                order={order}
              />

              {status === 'success' ? (
                <>
                  <AccountCredentialCard
                    username={account?.username}
                    password={account?.password}
                  />
                  <div className="rounded-[24px] border border-[#d8e7ff] bg-[#eef5ff] px-5 py-5">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#4b6bda]">
                        i
                      </span>
                      <div className="min-w-0">
                        <h2 className="text-[18px] font-bold text-[#3550b7]">Penting!</h2>
                        <p className="mt-2 text-sm leading-7 text-[#4a66c4]">
                          Simpan data akun ini dan jangan bagikan ke orang lain. Jangan ubah password
                          tanpa arahan admin agar garansi tetap aman.
                        </p>
                      </div>
                    </div>
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
                <>
                  <div
                    className={`rounded-[24px] px-5 py-5 ${
                      status === 'pending'
                        ? 'border border-nara-amber/20 bg-nara-amber-soft'
                        : 'border border-nara-red/20 bg-nara-red-soft'
                    }`}
                  >
                    <h2
                      className={`text-[17px] font-bold ${
                        status === 'pending' ? 'text-nara-amber' : 'text-nara-red'
                      }`}
                    >
                      {status === 'pending' ? 'Pesanan masih diproses' : 'Invoice belum ditemukan'}
                    </h2>
                    <p
                      className={`mt-2 text-sm leading-7 ${
                        status === 'pending' ? 'text-nara-amber' : 'text-nara-red'
                      }`}
                    >
                      {status === 'pending'
                        ? 'Tunggu beberapa saat, lalu cek lagi invoice yang sama. Status akan ikut berubah saat backend menerima update terbaru.'
                        : 'Pastikan nomor invoice yang dimasukkan benar dan order sudah berhasil dibuat dari halaman checkout.'}
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
              )}
            </div>
          ) : (
            <>
              <OrderStatusCard
                status="not-found"
                invoice={searchedInvoice}
                title="Invoice tidak ditemukan"
                description={statusDescription}
              />
              <div className="rounded-[24px] border border-nara-red/20 bg-nara-red-soft px-5 py-5">
                <h2 className="text-[17px] font-bold text-nara-red">Cek ulang invoice</h2>
                <p className="mt-3 text-sm leading-7 text-nara-red">
                  Status selalu diambil ulang dari backend. Kalau invoice belum muncul, pastikan
                  nomor yang dimasukkan sama persis dengan invoice dari checkout.
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
