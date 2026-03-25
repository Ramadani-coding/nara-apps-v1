import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import AdminToastProvider from './AdminToastProvider'
import { getAdminSession, logoutAdmin } from '../../utils/adminAuth'

const navItems = [
  { to: '/admin', label: 'Overview', short: 'OV' },
  { to: '/admin/products', label: 'Products', short: 'PR' },
  { to: '/admin/transactions', label: 'Transactions', short: 'TR' },
]

function NavItem({ item }) {
  return (
    <NavLink
      to={item.to}
      end={item.to === '/admin'}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-[20px] px-4 py-3 text-sm font-semibold transition ${
          isActive
            ? 'bg-nara-navy text-white shadow-[0_18px_40px_rgba(28,37,59,0.18)]'
            : 'text-nara-muted hover:bg-[#f7f8fc] hover:text-nara-ink'
        }`
      }
    >
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-[14px] bg-white/12 text-[11px] font-extrabold">
        {item.short}
      </span>
      <span>{item.label}</span>
    </NavLink>
  )
}

function AdminLayout() {
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const adminSession = getAdminSession()

  async function handleLogout() {
    setIsLoggingOut(true)
    try {
      await logoutAdmin()
      navigate('/admin/login', { replace: true })
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <AdminToastProvider>
      <div className="min-h-screen bg-[#f6f7fb] text-nara-ink">
        <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col md:flex-row">
          <aside className="border-b border-[#e7e9f1] bg-white px-4 py-4 shadow-[0_18px_40px_rgba(24,32,56,0.05)] md:sticky md:top-0 md:min-h-screen md:w-[272px] md:border-b-0 md:border-r md:px-5 md:py-6">
            <div className="rounded-[28px] bg-nara-navy px-5 py-5 text-white shadow-[0_26px_60px_rgba(28,37,59,0.2)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/70">
                Admin Panel
              </p>
              <h1 className="mt-2 text-[28px] font-extrabold tracking-[-0.03em]">
                Nara Premium
              </h1>
              <p className="mt-3 text-sm leading-6 text-white/80">
                Kelola produk, margin harga, dan transaksi dari satu dashboard yang
                ringkas.
              </p>
            </div>

            <nav className="mt-5 grid gap-2">
              {navItems.map((item) => (
                <NavItem key={item.to} item={item} />
              ))}
            </nav>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="mt-5 inline-flex w-full items-center justify-center rounded-[20px] border border-[#e7e9f1] bg-white px-4 py-3 text-sm font-bold text-nara-ink transition hover:border-nara-accent/40 hover:text-nara-accent"
            >
              {isLoggingOut ? 'Keluar...' : 'Logout'}
            </button>
          </aside>

          <div className="min-w-0 flex-1">
            <header className="sticky top-0 z-20 border-b border-[#e7e9f1] bg-[#f6f7fb]/90 px-4 py-4 backdrop-blur md:px-8 md:py-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-nara-muted">
                    Internal Workspace
                  </p>
                  <h2 className="mt-1 text-[24px] font-extrabold tracking-[-0.03em] text-nara-ink">
                    Dashboard Admin
                  </h2>
                </div>
                <div className="rounded-[18px] border border-[#e7e9f1] bg-white px-4 py-3 text-sm text-nara-muted shadow-sm">
                  Login backend aktif:{' '}
                  <span className="font-bold text-nara-ink">
                    {adminSession?.user?.username ?? 'admin'}
                  </span>
                </div>
              </div>
            </header>

            <main className="px-4 py-5 md:px-8 md:py-7">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </AdminToastProvider>
  )
}

export default AdminLayout
