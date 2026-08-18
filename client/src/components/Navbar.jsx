import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function MenuIcon({ open }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round"><path d={open ? 'm6 6 12 12M18 6 6 18' : 'M4 7h16M4 12h16M4 17h16'} /></svg>
}

function Navbar({ onEnter, onLogin, onRegister, onMenu, onMatch, onRewards }) {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const home = onEnter ?? (() => navigate('/'))
  const login = onLogin ?? (() => navigate('/login'))
  const register = onRegister ?? (() => navigate('/register'))
  const menu = onMenu ?? (() => navigate('/coffee-menu'))
  const match = onMatch ?? (() => navigate('/coffee-match'))
  const rewards = onRewards ?? (() => navigate('/rewards'))
  const go = (action) => { setIsOpen(false); action?.() }

  return <header className="relative z-50 block w-full border-b border-black/15 bg-[#d8d5d0] text-[#302f2d] shadow-sm">
    <nav className="relative mx-auto flex h-14 w-full max-w-[1180px] items-center px-5 sm:px-8 lg:px-10">
      <button onClick={() => go(home)} className="flex items-center gap-2 text-sm font-semibold tracking-[.08em]"><span className="h-4 w-4 rounded-full bg-[#302f2d]" />AYSKEOPI</button>
      <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 text-xs text-[#484642] md:flex"><button onClick={menu} className="hover:text-black">Coffee Menu</button><button onClick={match} className="hover:text-black">Coffee Match</button><button onClick={rewards} className="hover:text-black">Rewards</button></div>
      <div className="ml-auto hidden items-center gap-2 text-xs font-medium md:flex"><button onClick={login} className="rounded-md px-3 py-2 transition hover:bg-black/5">Login</button><button onClick={register} className="rounded-md border border-[#aaa6a0] px-3 py-2 transition hover:bg-white/45">Register</button></div>
      <button onClick={() => setIsOpen(open => !open)} aria-expanded={isOpen} aria-label="Toggle navigation menu" className="ml-auto grid h-9 w-9 place-items-center rounded-md transition hover:bg-black/5 md:hidden"><MenuIcon open={isOpen} /></button>
    </nav>
    {isOpen && <div className="absolute inset-x-0 top-full border-b border-black/10 bg-[#d8d5d0] px-5 py-3 shadow-lg md:hidden"><div className="mx-auto flex max-w-[1180px] flex-col gap-1 text-sm font-medium"><button onClick={() => go(menu)} className="rounded-md px-3 py-2 text-left hover:bg-black/5">Coffee Menu</button><button onClick={() => go(match)} className="rounded-md px-3 py-2 text-left hover:bg-black/5">Coffee Match</button><button onClick={() => go(rewards)} className="rounded-md px-3 py-2 text-left hover:bg-black/5">Rewards</button><div className="my-1 border-t border-black/10" /><button onClick={() => go(login)} className="rounded-md px-3 py-2 text-left hover:bg-black/5">Login</button><button onClick={() => go(register)} className="rounded-md border border-[#aaa6a0] px-3 py-2 text-left hover:bg-white/45">Register</button></div></div>}
  </header>
}

export default Navbar
