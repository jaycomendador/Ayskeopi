import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import LandingPage from './pages/landing/LandingPage'
import AuthPage from './AuthPage'
import ForgotPasswordPage from './ForgotPasswordPage'
import AyskeopiMenuPage from './pages/landing/AyskeopiMenuPage'
import CoffeeMatchPage from './pages/landing/CoffeeMatchPage'
import AyskeopiRewardsPage from './pages/landing/AyskeopiRewardsPage'
import MainPage from './pages/main/MainPage'
import MenuPage from './pages/main/MenuPage'
import CoffeeQuestPage from './pages/main/CoffeeQuestPage'
import RewardsPage from './pages/main/RewardsPage'
import OrdersPage from './pages/main/OrdersPage'

const appPages = { home: MainPage, menu: MenuPage, coffeequest: CoffeeQuestPage, rewards: RewardsPage, orders: OrdersPage }

function hasSession() {
  try { return Boolean(JSON.parse(localStorage.getItem('ayskeopiUser'))) } catch { return false }
}

function PrivateRoute({ children }) {
  return hasSession() ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  return hasSession() ? <Navigate to="/app" replace /> : children
}

function LandingRoute() {
  const navigate = useNavigate()
  return <LandingPage onEnter={() => navigate('/app')} onLogin={() => navigate('/login')} onRegister={() => navigate('/register')} onMenu={() => navigate('/coffee-menu')} onMatch={() => navigate('/coffee-match')} onRewards={() => navigate('/rewards')} />
}

function PublicPageRoute({ Page }) {
  const navigate = useNavigate()
  return <Page onHome={() => navigate('/')} onLogin={() => navigate('/login')} onRegister={() => navigate('/register')} onMenu={() => navigate('/coffee-menu')} onMatch={() => navigate('/coffee-match')} onRewards={() => navigate('/rewards')} />
}

function PrivatePageRoute({ Page, pageName }) {
  const navigate = useNavigate()
  const [order, setOrder] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const logout = () => {
    localStorage.removeItem('ayskeopiUser')
    navigate('/')
  }

  return <main className="min-h-screen bg-[#fffaf2] font-sans text-[#2d1911]">
    <nav className="sticky top-0 z-20 flex min-h-[72px] items-center justify-between border-b border-[#5c321d]/20 bg-[#fffaf2]/90 px-5 backdrop-blur md:px-[7vw]">
      <button className="font-serif text-lg font-bold" onClick={() => navigate('/app')}><span className="mr-1 text-[#ae642e]">☕</span> AYSKEOPI</button>
      <div className="hidden items-center gap-1 md:flex">{Object.keys(appPages).map((name) => <button className={`rounded-full px-3 py-2 text-xs font-semibold transition ${pageName === name ? 'bg-[#2d1911] text-white' : 'hover:bg-[#eadcc9]'}`} onClick={() => navigate(`/app/${name === 'home' ? '' : name}`)} key={name}>{name === 'coffeequest' ? 'CoffeeQuest' : name[0].toUpperCase() + name.slice(1)}</button>)}</div>
      <div className="ml-auto flex items-center gap-2 md:ml-0"><button onClick={logout} className="rounded-full border border-[#5c321d]/30 px-3 py-2 text-xs font-semibold transition hover:bg-[#eadcc9]">Log out</button><button onClick={() => setIsMenuOpen(open => !open)} aria-label="Toggle app navigation" aria-expanded={isMenuOpen} className="grid h-9 w-9 place-items-center rounded-full border border-[#5c321d]/30 text-lg md:hidden">{isMenuOpen ? '×' : '☰'}</button></div>
    </nav>
    {isMenuOpen && <div className="border-b border-[#5c321d]/20 bg-[#fffaf2] px-5 py-3 shadow-sm md:hidden"><div className="mx-auto flex max-w-6xl flex-col gap-1">{Object.keys(appPages).map((name) => <button key={name} onClick={() => { setIsMenuOpen(false); navigate(`/app/${name === 'home' ? '' : name}`) }} className={`rounded-lg px-3 py-2 text-left text-sm font-semibold ${pageName === name ? 'bg-[#2d1911] text-white' : 'hover:bg-[#eadcc9]'}`}>{name === 'coffeequest' ? 'CoffeeQuest' : name[0].toUpperCase() + name.slice(1)}</button>)}</div></div>}
    <div className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-10"><Page onNavigate={(name) => navigate(`/app/${name === 'Home' ? '' : name.toLowerCase()}`)} onAddToOrder={() => setOrder(true)} /></div>
    <footer className="mt-12 border-t border-[#5c321d]/15 px-5 py-8 text-sm font-bold md:px-[7vw]">AYSKEOPI <span className="ml-3 text-xs font-normal text-[#72584a]">Coffee crafted for your daily ritual.</span></footer>
    {order && <div className="fixed bottom-5 right-5 z-30 rounded-xl bg-[#2d1911] px-5 py-3 text-sm text-white shadow-xl">☕ Your order is being prepared — ready in 4 min.</div>}
  </main>
}

function App() {
  return <BrowserRouter><Routes>
    <Route path="/" element={<LandingRoute />} />
    <Route path="/coffee-menu" element={<PublicPageRoute Page={AyskeopiMenuPage} />} />
    <Route path="/coffee-match" element={<PublicPageRoute Page={CoffeeMatchPage} />} />
    <Route path="/rewards" element={<PublicPageRoute Page={AyskeopiRewardsPage} />} />
    <Route path="/login" element={<PublicRoute><AuthPage mode="login" /></PublicRoute>} />
    <Route path="/register" element={<PublicRoute><AuthPage mode="register" /></PublicRoute>} />
    <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />

    <Route path="/app" element={<PrivateRoute><PrivatePageRoute Page={MainPage} pageName="home" /></PrivateRoute>} />
    <Route path="/app/menu" element={<PrivateRoute><PrivatePageRoute Page={MenuPage} pageName="menu" /></PrivateRoute>} />
    <Route path="/app/coffeequest" element={<PrivateRoute><PrivatePageRoute Page={CoffeeQuestPage} pageName="coffeequest" /></PrivateRoute>} />
    <Route path="/app/rewards" element={<PrivateRoute><PrivatePageRoute Page={RewardsPage} pageName="rewards" /></PrivateRoute>} />
    <Route path="/app/orders" element={<PrivateRoute><PrivatePageRoute Page={OrdersPage} pageName="orders" /></PrivateRoute>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></BrowserRouter>
}

export default App
