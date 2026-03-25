import { useEffect, useMemo, useState } from 'react'
import StatusBadge from '../components/common/StatusBadge'
import { clearAdminSession } from '../utils/adminAuth'
import { getAdminOrders } from '../utils/adminApi'
import { formatRupiah } from '../utils/formatPrice'

function getStatusTone(status) {
  const normalized = String(status || '').toLowerCase()
  if (normalized === 'success') return 'success'
  if (['pending', 'created', 'processing'].includes(normalized)) return 'pending'
  return 'danger'
}

function AdminTransactionsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadOrders() {
      setIsLoading(true)
      setError('')

      try {
        const data = await getAdminOrders()
        if (!isMounted) return
        setOrders(Array.isArray(data) ? data : [])
      } catch (loadError) {
        if (!isMounted) return
        if (loadError.status === 401) {
          clearAdminSession()
          window.location.replace('/admin/login')
          return
        }
        setError(loadError.message || 'Gagal memuat transaksi dari backend.')
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadOrders()
    return () => {
      isMounted = false
    }
  }, [])

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const query = search.trim().toLowerCase()
      const matchesSearch =
        !query ||
        String(order.provider_invoice || '').toLowerCase().includes(query) ||
        String(order.product_name_snapshot || '').toLowerCase().includes(query) ||
        String(order.customer_whatsapp || '').toLowerCase().includes(query)

      const normalizedStatus = String(order.provider_status || '').toLowerCase()
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'pending'
          ? ['pending', 'created', 'processing'].includes(normalizedStatus)
          : normalizedStatus === statusFilter)

      return matchesSearch && matchesStatus
    })
  }, [orders, search, statusFilter])

  return (
    <div className="space-y-6">
      <section className="rounded-[30px] border border-[#e7e9f1] bg-white px-5 py-5 shadow-[0_18px_40px_rgba(24,32,56,0.06)] md:px-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-nara-muted">
          Transaction Monitor
        </p>
        <h1 className="mt-1 text-[28px] font-extrabold tracking-[-0.03em] text-nara-ink">
          Semua transaksi user
        </h1>
        <div className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari invoice, produk, atau nomor WhatsApp..."
            className="w-full rounded-[20px] border border-[#e5e7ef] bg-[#fbfbfe] px-4 py-3 text-[15px] text-nara-ink outline-none transition placeholder:text-nara-muted focus:border-nara-accent/45"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="w-full rounded-[20px] border border-[#e5e7ef] bg-[#fbfbfe] px-4 py-3 text-[15px] text-nara-ink outline-none transition focus:border-nara-accent/45"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="success">Success</option>
          </select>
        </div>

        {error ? (
          <div className="mt-4 rounded-[18px] border border-nara-red/20 bg-nara-red-soft px-4 py-3 text-sm font-medium text-nara-red">
            {error}
          </div>
        ) : null}
      </section>

      {isLoading ? (
        <div className="rounded-[30px] border border-[#e7e9f1] bg-white px-6 py-8 text-sm text-nara-muted shadow-[0_18px_40px_rgba(24,32,56,0.06)]">
          Memuat transaksi backend...
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <article
              key={order.provider_invoice}
              className="rounded-[28px] border border-[#e7e9f1] bg-white px-5 py-5 shadow-[0_18px_40px_rgba(24,32,56,0.06)] md:px-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-nara-muted">
                    {order.provider_invoice}
                  </p>
                  <h2 className="mt-2 text-[22px] font-extrabold tracking-[-0.03em] text-nara-ink">
                    {order.product_name_snapshot}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-nara-muted">
                    Provider order dari Premku
                  </p>
                </div>
                <StatusBadge
                  tone={getStatusTone(order.provider_status)}
                  className="px-3.5 py-1.5 text-[11px] uppercase tracking-[0.08em]"
                >
                  {order.provider_status}
                </StatusBadge>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-[20px] border border-[#eef0f5] bg-[#fbfbfe] px-4 py-3">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-nara-muted">
                    Qty
                  </p>
                  <p className="mt-2 text-[18px] font-bold text-nara-ink">{order.qty}</p>
                </div>
                <div className="rounded-[20px] border border-[#eef0f5] bg-[#fbfbfe] px-4 py-3">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-nara-muted">
                    Harga Jual
                  </p>
                  <p className="mt-2 text-[18px] font-bold text-nara-ink">
                    {formatRupiah(order.sell_unit_price || 0)}
                  </p>
                </div>
                <div className="rounded-[20px] border border-[#eef0f5] bg-[#fbfbfe] px-4 py-3">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-nara-muted">
                    No. WhatsApp
                  </p>
                  <p className="mt-2 break-all text-[16px] font-bold text-nara-ink">
                    {order.customer_whatsapp || '-'}
                  </p>
                </div>
                <div className="rounded-[20px] border border-[#eef0f5] bg-[#fbfbfe] px-4 py-3">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-nara-muted">
                    Subtotal
                  </p>
                  <p className="mt-2 text-[18px] font-extrabold text-nara-accent">
                    {formatRupiah(order.subtotal || 0)}
                  </p>
                </div>
              </div>
            </article>
          ))}

          {!filteredOrders.length ? (
            <div className="rounded-[28px] border border-dashed border-[#d9deea] bg-white px-5 py-10 text-center text-nara-muted shadow-[0_18px_40px_rgba(24,32,56,0.04)]">
              Tidak ada transaksi yang cocok dengan filter saat ini.
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default AdminTransactionsPage
