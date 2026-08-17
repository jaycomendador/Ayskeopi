import { useState } from 'react'
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import MenuPage from '../pages/MenuPage'
import CoffeeQuestPage from '../pages/CoffeeQuestPage'
import RewardsPage from '../pages/RewardsPage'
import OrdersPage from '../pages/OrdersPage'

const pages = { home: HomePage, menu: MenuPage, coffeequest: CoffeeQuestPage, rewards: RewardsPage, orders: OrdersPage }

function RoasteryLayout({ Page, pageName }) {
  const navigate = useNavigate()
  const [order, setOrder] = useState(false)
  return <main className="min-h-screen bg-[#fffaf2] font-sans text-[#2d1911]"><nav className="sticky top-0 z-20 flex min-h-[72px] items-center justify-between border-b border-[#5c321d]/20 bg-[#fffaf2]/90 px-5 backdrop-blur md:px-[7vw]"><button className="font-serif text-lg font-bold" onClick={() => navigate('/app')}><span className="mr-1 text-[#ae642e]">☕</span> ROASTERY</button><div className="hidden items-center gap-1 md:flex">{Object.keys(pages).map((name) => <button className={`rounded-full px-3 py-2 text-xs font-semibold transition ${pageName === name ? 'bg-[#2d1911] text-white' : 'hover:bg-[#eadcc9]'}`} onClick={() => navigate(`/app/${name === 'home' ? '' : name}`)} key={name}>{name === 'coffeequest' ? 'CoffeeQuest' : name[0].toUpperCase() + name.slice(1)}</button>)}</div><div className="flex items-center gap-3"><Link className="text-xs font-semibold hover:text-[#ae642e]" to="/login">Log in</Link><Link className="rounded-full border border-[#5c321d]/30 px-3 py-2 text-xs font-semibold hover:bg-[#eadcc9]" to="/register">Register</Link></div></nav><div className="mx-auto max-w-6xl px-5 py-10 md:px-8"><Page onNavigate={(name) => navigate(`/app/${name === 'Home' ? '' : name.toLowerCase()}`)} onAddToOrder={() => setOrder(true)} /></div><footer className="mt-12 border-t border-[#5c321d]/15 px-5 py-8 text-sm font-bold md:px-[7vw]">ROASTERY <span className="ml-3 text-xs font-normal text-[#72584a]">Made for slow mornings & big ideas.</span></footer>{order && <div className="fixed bottom-5 right-5 z-30 rounded-xl bg-[#2d1911] px-5 py-3 text-sm text-white shadow-xl">☕ Your order is being prepared — ready in 4 min.</div>}</main>
}

export default function PrivateRoutes() { return <Routes>{Object.entries(pages).map(([name, Page]) => <Route key={name} path={name === 'home' ? '' : name} element={<RoasteryLayout Page={Page} pageName={name} />} />)}<Route path="*" element={<Navigate to="/app" replace />} /></Routes> }
