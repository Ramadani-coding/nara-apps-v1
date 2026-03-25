import { Navigate, Route, Routes } from 'react-router-dom'
import AdminGuard from '../components/admin/AdminGuard'
import AdminLayout from '../components/admin/AdminLayout'
import AppLayout from '../components/layout/AppLayout'
import AdminDashboardPage from '../pages/AdminDashboardPage'
import AdminLoginPage from '../pages/AdminLoginPage'
import AdminProductsPage from '../pages/AdminProductsPage'
import AdminTransactionsPage from '../pages/AdminTransactionsPage'
import CaraOrderPage from '../pages/CaraOrderPage'
import CheckoutPage from '../pages/CheckoutPage'
import HomePage from '../pages/HomePage'
import KlaimGaransiPage from '../pages/KlaimGaransiPage'
import OrderStatusPage from '../pages/OrderStatusPage'
import ProductDetailPage from '../pages/ProductDetailPage'
import SyaratKetentuanPage from '../pages/SyaratKetentuanPage'
import ScrollToTop from './ScrollToTop'

function AppRouter() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminGuard />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="transactions" element={<AdminTransactionsPage />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Route>

        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/cara-order" element={<CaraOrderPage />} />
          <Route path="/klaim-garansi" element={<KlaimGaransiPage />} />
          <Route path="/syarat-ketentuan" element={<SyaratKetentuanPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-status" element={<OrderStatusPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  )
}

export default AppRouter
