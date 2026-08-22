import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/landing/LandingPage'
import AyskeopiMenuPage from './pages/landing/AyskeopiMenuPage'
import CoffeeMatchPage from './pages/landing/CoffeeMatchPage'
import AyskeopiRewardsPage from './pages/landing/AyskeopiRewardsPage'
import AyskeopiContactPage from './pages/landing/AyskeopiContactPage'
import ForgotPasswordPage from './ForgotPasswordPage'
import LoadingScreen from './components/LoadingScreen'

function getUser() {
  try {
    return JSON.parse(localStorage.getItem('ayskeopiUser'))
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

        <Route path="/app/*"   element={<Navigate to="/" replace />} />
        <Route path="/login"   element={<Navigate to="/" replace />} />
        <Route path="/register" element={<Navigate to="/" replace />} />
        <Route path="*"        element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
