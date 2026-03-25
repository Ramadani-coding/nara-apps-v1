import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import PrimaryButton from '../components/common/PrimaryButton'
import { isAdminAuthenticated, loginAdmin } from '../utils/adminAuth'

function AdminLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isAdminAuthenticated()) {
    return <Navigate to="/admin" replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      await loginAdmin({ username: username.trim(), password })

      const nextPath = location.state?.from && location.state.from.startsWith('/admin')
        ? location.state.from
        : '/admin'

      navigate(nextPath, { replace: true })
    } catch (loginError) {
      setError(loginError.message || 'Username atau password admin tidak sesuai.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(255,98,77,0.16),transparent_24%),linear-gradient(180deg,#fffdf9_0%,#f6f7fb_100%)] px-4 py-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1120px] items-center justify-center">
        <div className="grid w-full max-w-[980px] overflow-hidden rounded-[36px] border border-[#eceef5] bg-white shadow-[0_30px_80px_rgba(24,32,56,0.12)] lg:grid-cols-[1.05fr_0.95fr]">
          <section className="nara-hero px-6 py-8 text-white md:px-8 md:py-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/75">
              Admin Access
            </p>
            <h1 className="mt-3 max-w-[11ch] text-[34px] font-extrabold leading-[1.05] tracking-[-0.04em]">
              Kelola toko dari satu panel.
            </h1>
            <p className="mt-4 max-w-[46ch] text-sm leading-7 text-white/88">
              Login admin ini dipakai untuk melihat transaksi, mengatur margin harga
              dari katalog provider, dan memantau performa storefront dari backend.
            </p>

            <div className="mt-8 grid gap-3">
              {[
                'Lihat semua produk dan harga jual',
                'Pantau transaksi dan status pesanan',
                'Atur margin harga per varian',
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[20px] border border-white/12 bg-white/10 px-4 py-3 text-sm font-medium text-white"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="px-6 py-8 md:px-8 md:py-10">
            <div className="max-w-[420px]">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-nara-muted">
                Manual Login
              </p>
              <h2 className="mt-2 text-[30px] font-extrabold tracking-[-0.03em] text-nara-ink">
                Masuk ke Admin Panel
              </h2>
              <p className="mt-3 text-[15px] leading-7 text-nara-muted">
                Untuk tahap ini kredensial admin masih sederhana: username
                <span className="font-bold text-nara-ink"> admin </span>
                dan password
                <span className="font-bold text-nara-ink"> admin</span>.
              </p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <label className="block">
                <span className="text-sm font-bold text-nara-ink">Username</span>
                <input
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Masukkan username admin"
                  className="mt-3 w-full rounded-[22px] border border-[#e5e7ef] bg-[#fbfbfe] px-4 py-3.5 text-[15px] text-nara-ink outline-none transition placeholder:text-nara-muted focus:border-nara-accent/55"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-nara-ink">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Masukkan password admin"
                  className="mt-3 w-full rounded-[22px] border border-[#e5e7ef] bg-[#fbfbfe] px-4 py-3.5 text-[15px] text-nara-ink outline-none transition placeholder:text-nara-muted focus:border-nara-accent/55"
                />
              </label>

              {error ? (
                <div className="rounded-[18px] border border-nara-red/20 bg-nara-red-soft px-4 py-3 text-sm font-medium text-nara-red">
                  {error}
                </div>
              ) : null}

              <PrimaryButton
                className="w-full rounded-[22px] py-4 text-[15px]"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sedang masuk...' : 'Masuk Dashboard'}
              </PrimaryButton>
            </form>
          </section>
        </div>
      </div>
    </main>
  )
}

export default AdminLoginPage
