import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import AuthPage from './AuthPage'
import ForgotPasswordPage from './ForgotPasswordPage'
import LandingPage from './pages/landing/LandingPage'
import AyskeopiMenuPage from './pages/landing/AyskeopiMenuPage'
import CoffeeMatchPage from './pages/landing/CoffeeMatchPage'
import AyskeopiRewardsPage from './pages/landing/AyskeopiRewardsPage'
import MainPage from './pages/main/MainPage'
import MenuPage from './pages/main/MenuPage'
import RewardsPage from './pages/main/RewardsPage'
import OrdersPage from './pages/main/OrdersPage'

function isAuthenticated() {
  try {
    return Boolean(JSON.parse(localStorage.getItem('ayskeopiUser')))
  } catch {
    return false
  }
}

function PublicRoute() {
  return isAuthenticated() ? <Navigate to="/app" replace /> : <Outlet />
}

function PrivateRoute() {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/coffee-menu" element={<AyskeopiMenuPage />} />
          <Route path="/coffee-match" element={<CoffeeMatchPage />} />
          <Route path="/rewards" element={<AyskeopiRewardsPage />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/app" element={<MainPage />} />
          <Route path="/app/menu" element={<MenuPage />} />
          <Route path="/app/coffeequest" element={<RewardsPage />} />
          <Route path="/app/rewards" element={<RewardsPage />} />
          <Route path="/app/orders" element={<OrdersPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
