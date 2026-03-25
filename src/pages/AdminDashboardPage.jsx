import { useEffect, useMemo, useState } from 'react'
import StatusBadge from '../components/common/StatusBadge'
import { clearAdminSession } from '../utils/adminAuth'
import { getAdminDashboard, getAdminOrders, getAdminProducts } from '../utils/adminApi'
import { formatRupiah } from '../utils/formatPrice'

function StatCard({ label, value, hint, tone = 'accent' }) {
  const toneClasses = {
    accent: 'bg-[#fff4ee] text-nara-accent',
    navy: 'bg-[#eef2ff] text-[#3451d1]',
    green: 'bg-[#e9fff1] text-[#22a85a]',
    amber: 'bg-[#fff3df] text-[#d88b00]',
  }

  return (
    <article className="rounded-[28px] border border-[#e7e9f1] bg-white px-5 py-5 shadow-[0_18px_40px_rgba(24,32,56,0.06)]">
      <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${toneClasses[tone]}`}>
        {label}
      </span>
      <p className="mt-4 text-[32px] font-extrabold tracking-[-0.04em] text-nara-ink">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-nara-muted">{hint}</p>
    </article>
  )
}

function EmptyBlock({ message }) {
  return (
    <div className="rounded-[22px] border border-dashed border-[#d9deea] bg-[#fbfbfe] px-4 py-8 text-center text-sm text-nara-muted">
      {message}
    </div>
  )
}

function normalizeOrderStatus(status) {
  const value = String(status || '').toLowerCase()
  if (value === 'success') return 'success'
  if (['pending', 'created', 'processing'].includes(value)) return 'pending'
  return 'danger'
}

function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [dashboard, setDashboard] = useState(null)
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])

  useEffect(() => {
    let isMounted = true

    async function loadDashboard() {
      setIsLoading(true)
      setError('')

      try {
        const [dashboardData, ordersData, productsData] = await Promise.all([
          getAdminDashboard(),
          getAdminOrders(),
          getAdminProducts(),
        ])

        if (!isMounted) return
        setDashboard(dashboardData)
        setOrders(Array.isArray(ordersData) ? ordersData : [])
        setProducts(Array.isArray(productsData) ? productsData : [])
      } catch (loadError) {
        if (!isMounted) return
        if (loadError.status === 401) {
          clearAdminSession()
          window.location.replace('/admin/login')
          return
        }
        setError(loadError.message || 'Gagal memuat dashboard admin.')
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadDashboard()
    return () => {
      isMounted = false
    }
  }, [])

  const recentTransactions = useMemo(() => orders.slice(0, 5), [orders])
  const productSnapshots = useMemo(() => products.slice(0, 4), [products])

  if (isLoading) {
    return (
      <div className="rounded-[30px] border border-[#e7e9f1] bg-white px-6 py-8 text-sm text-nara-muted shadow-[0_18px_40px_rgba(24,32,56,0.06)]">
        Memuat dashboard admin...
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-[30px] border border-nara-red/20 bg-nara-red-soft px-6 py-6 text-sm font-medium text-nara-red">
        {error}
      </div>
    )
  }

  const stats = dashboard?.stats ?? {
    totalProducts: 0,
    totalVariants: 0,
    totalOrders: 0,
    pendingOrders: 0,
    successOrders: 0,
    totalRevenue: 0,
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Produk"
          value={stats.totalProducts}
          hint={`${stats.totalVariants} item aktif di katalog provider`}
          tone="accent"
        />
        <StatCard
          label="Total Transaksi"
          value={stats.totalOrders}
          hint={`${stats.pendingOrders} pending, ${stats.successOrders} success`}
          tone="navy"
        />
        <StatCard
          label="Order Pending"
          value={stats.pendingOrders}
          hint="Gabungan status created, pending, dan processing"
          tone="amber"
        />
        <StatCard
          label="Nilai Transaksi"
          value={formatRupiah(stats.totalRevenue || 0)}
          hint="Akumulasi subtotal order yang tersimpan"
          tone="green"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[30px] border border-[#e7e9f1] bg-white px-5 py-5 shadow-[0_18px_40px_rgba(24,32,56,0.06)] md:px-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-nara-muted">
                Ringkasan Transaksi
              </p>
              <h3 className="mt-1 text-[24px] font-extrabold tracking-[-0.03em] text-nara-ink">
                Transaksi terbaru
              </h3>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {recentTransactions.length ? (
              recentTransactions.map((order) => (
                <div
                  key={order.provider_invoice}
                  className="rounded-[22px] border border-[#eef0f5] bg-[#fbfbfe] px-4 py-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-nara-ink">{order.provider_invoice}</p>
                      <p className="mt-1 text-sm leading-6 text-nara-muted">
                        {order.product_name_snapshot}
                      </p>
                    </div>
                    <StatusBadge tone={normalizeOrderStatus(order.provider_status)}>
                      {order.provider_status}
                    </StatusBadge>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-nara-muted">
                    <span>Qty {order.qty}</span>
                    <span className="font-bold text-nara-ink">
                      {formatRupiah(order.subtotal || 0)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <EmptyBlock message="Belum ada transaksi yang masuk ke backend." />
            )}
          </div>
        </article>

        <article className="rounded-[30px] border border-[#e7e9f1] bg-white px-5 py-5 shadow-[0_18px_40px_rgba(24,32,56,0.06)] md:px-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-nara-muted">
                Snapshot Provider
              </p>
              <h3 className="mt-1 text-[24px] font-extrabold tracking-[-0.03em] text-nara-ink">
                Katalog Premku
              </h3>
            </div>
            <div className="rounded-[20px] border border-[#eef0f5] bg-[#fbfbfe] px-4 py-3 text-sm text-nara-muted">
              Saldo provider:{' '}
              <span className="font-bold text-nara-ink">
                {formatRupiah(dashboard?.providerProfile?.saldo || 0)}
              </span>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {productSnapshots.length ? (
              productSnapshots.map((product) => (
                <div
                  key={product.id}
                  className="rounded-[22px] border border-[#eef0f5] bg-[#fbfbfe] px-4 py-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-[15px] font-bold text-nara-ink">{product.name}</p>
                      <p className="mt-1 text-sm text-nara-muted">
                        ID provider {product.providerProductId} | stok {product.stock ?? 0}
                      </p>
                    </div>
                    <span className="rounded-full bg-[#fff4ee] px-3 py-1 text-[11px] font-bold text-nara-accent">
                      {formatRupiah(product.sellPrice || 0)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <EmptyBlock message="Katalog masih kosong. Sinkronkan dulu dari halaman Products." />
            )}
          </div>
        </article>
      </section>
    </div>
  )
}

export default AdminDashboardPage
