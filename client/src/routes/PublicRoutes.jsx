import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import LandingPage from '../landingpage'
import AuthPage from '../AuthPage'

function LandingRoute() {
  const navigate = useNavigate()
  return <LandingPage onEnter={() => navigate('/app')} onLogin={() => navigate('/login')} onRegister={() => navigate('/register')} />
}

export default function PublicRoutes() {
  return <Routes>
    <Route index element={<LandingRoute />} />
    <Route path="login" element={<AuthPage mode="login" />} />
    <Route path="register" element={<AuthPage mode="register" />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
}
