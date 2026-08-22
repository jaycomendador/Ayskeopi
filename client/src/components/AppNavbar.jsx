import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const links = [
  { label: 'Home', path: '/app' }, { label: 'Menu', path: '/app/menu' }, { label: 'CoffeeQuest', path: '/app/coffeequest' }, { label: 'Orders', path: '/app/orders' },
]

export default function AppNavbar({ active }) {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const go = path => { navigate(path); setIsOpen(false) }
  const logout = () => { localStorage.removeItem('ayskeopiUser'); navigate('/') }
  return <><header className="flex items-center justify-between gap-4 border-b border-white/10 pb-4"><button onClick={() => go('/app')} className="text-xs font-bold tracking-[.16em]">AYSKEOPI</button><nav aria-label="Application navigation" className="hidden items-center gap-5 text-xs font-semibold sm:flex">{links.map(link => <button key={link.path} onClick={() => go(link.path)} className={active === link.path ? 'text-[#d5a06f]' : 'transition hover:text-[#d5a06f]'}>{link.label}</button>)}</nav><div className="flex items-center gap-3"><button onClick={logout} className="hidden rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold transition hover:bg-[#f2e5d8] hover:text-[#160e0a] sm:block">Log out</button><button type="button" aria-label="Toggle navigation" aria-expanded={isOpen} onClick={() => setIsOpen(open => !open)} className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-lg sm:hidden">{isOpen ? '×' : '☰'}</button></div></header>{isOpen && <nav aria-label="Mobile application navigation" className="mt-3 grid gap-1 rounded-2xl border border-white/10 bg-[#1a130f] p-2 text-sm font-semibold sm:hidden">{links.map(link => <button key={link.path} onClick={() => go(link.path)} className={`rounded-xl px-3 py-2 text-left ${active === link.path ? 'bg-white/10 text-[#d5a06f]' : 'hover:bg-white/10'}`}>{link.label}</button>)}<button onClick={logout} className="rounded-xl px-3 py-2 text-left text-[#d5a06f] hover:bg-white/10">Log out</button></nav>}</>
}
