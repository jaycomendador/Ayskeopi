function Navbar({ onEnter, onLogin, onRegister, onMenu, onMatch, onRewards }) {
  return (
    <header className="relative z-50 block w-full border-b border-black/15 bg-[#d8d5d0] text-[#302f2d] shadow-sm">
      <nav className="relative mx-auto flex h-14 w-full max-w-[1180px] items-center px-5 sm:px-8 lg:px-10">
        <button onClick={onEnter} className="flex items-center gap-2 text-sm font-semibold tracking-[.08em]"><span className="h-4 w-4 rounded-full bg-[#302f2d]" />AYSKEOPI</button>
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 text-xs text-[#484642] md:flex"><button onClick={onMenu || onEnter} className="hover:text-black">Coffee Menu</button><button onClick={onMatch || onEnter} className="hover:text-black">Coffee Match</button><button onClick={onRewards || onEnter} className="hover:text-black">Rewards</button></div>
        <div className="ml-auto flex items-center gap-2 text-xs font-medium"><button onClick={onLogin} className="rounded-md px-3 py-2 transition hover:bg-black/5">Login</button><button onClick={onRegister} className="rounded-md border border-[#aaa6a0] px-3 py-2 transition hover:bg-white/45">Register</button></div>
      </nav>
    </header>
  )
}

export default Navbar
