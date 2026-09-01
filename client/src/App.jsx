import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/landing/LandingPage'
import AyskeopiMenuPage from './pages/landing/AyskeopiMenuPage'
import CoffeeMatchPage from './pages/landing/CoffeeMatchPage'
import AyskeopiRewardsPage from './pages/landing/AyskeopiRewardsPage'
import AyskeopiContactPage from './pages/landing/AyskeopiContactPage'
import AuthPage from './AuthPage'
import ForgotPasswordPage from './ForgotPasswordPage'
import LoadingScreen from './components/LoadingScreen'
import AdminLayout from './pages/admin/AdminLayout'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminCustomers from './pages/admin/AdminCustomers'
import AdminFeedback from './pages/admin/AdminFeedback'

function getUser() {
  try {
    return JSON.parse(sessionStorage.getItem('ayskeopiUser'))
  } catch {
    return null
  }
}

// Check specifically for admin session
function getAdmin() {
  try {
    const admin = JSON.parse(sessionStorage.getItem('ayskeopiAdmin'))
    return admin?.role === 'admin' ? admin : null
  } catch {
    return null
  }
}

function PrivateRoute({ children }) {
  return getUser() ? children : <Navigate to="/" replace />
}

function PublicRoute({ children }) {
  return !getUser() ? children : <Navigate to="/" replace />
}

// Protects admin routes — redirects to /admin/login if not authenticated as admin
function AdminRoute({ children }) {
  return getAdmin() ? children : <Navigate to="/admin/login" replace />
}

function App() {
  const [loading, setLoading] = useState(true)

  return (
    <>
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<LandingPage />} />
        <Route path="/menu"        element={<AyskeopiMenuPage />} />
        <Route path="/coffee-menu" element={<AyskeopiMenuPage />} />
        <Route path="/coffee-match" element={<CoffeeMatchPage />} />
        <Route path="/contact"     element={<AyskeopiContactPage />} />

        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          }
        />

        <Route
          path="/rewards"
          element={
            <PrivateRoute>
              <AyskeopiRewardsPage />
            </PrivateRoute>
          }
        />

        {/* Admin Login — always accessible */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Portal */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products"  element={<AdminProducts />} />
          <Route path="orders"    element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="feedback"  element={<AdminFeedback />} />
        </Route>

        <Route path="/app/*"   element={<Navigate to="/coffee-menu" replace />} />
        <Route path="/login"   element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="*"        element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
