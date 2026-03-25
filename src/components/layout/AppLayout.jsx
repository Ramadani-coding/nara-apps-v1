import { Outlet } from 'react-router-dom'
import SiteFooter from './SiteFooter'

function AppLayout() {
  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 sm:py-7 md:px-8 md:py-8">
      <div className="nara-shell">
        <Outlet />
        <SiteFooter />
      </div>
    </main>
  )
}

export default AppLayout
