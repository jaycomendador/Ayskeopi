import Navbar from './components/Navbar'

function LandingPage({ onEnter, onLogin, onRegister, onMenu, onMatch, onRewards }) {
  return (
    <section className="min-h-screen overflow-hidden bg-[#292826] font-sans text-[#e7e2dd]">
      <Navbar onEnter={onEnter} onLogin={onLogin} onRegister={onRegister} onMenu={onMenu} onMatch={onMatch} onRewards={onRewards} />
      <main className="mx-auto max-w-[1180px] px-5 pb-6 sm:px-8 lg:px-10">
        <div className="grid min-h-[470px] items-center gap-5 border-b border-white/[.08] py-10 md:grid-cols-[.92fr_1.08fr] md:py-7">
          <div className="relative z-10 max-w-xl py-4">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[.32em] text-[#b4aaa2]">Ays Keopi presents</p>
            <h1 className="text-[clamp(4rem,9vw,8.8rem)] font-black leading-[.8] tracking-[-.06em] text-[#e3dfdb]">CREATE</h1>
            <h2 className="mt-5 text-[clamp(1.45rem,3vw,2.25rem)] font-medium tracking-[-.04em] text-[#d7d1cb]">Coffee made for your moment</h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-[#aaa39d]">Slow-roasted beans, a smooth finish, and your favorite coffee ritual in every cup.</p>
            <button onClick={onEnter} className="mt-7 inline-flex items-center gap-3 rounded-lg bg-[#e0ddd8] px-5 py-3 text-xs font-semibold text-[#302f2d] transition hover:bg-white">Get Started <span aria-hidden="true" className="text-base leading-none">→</span></button>
          </div>
          <div aria-hidden="true" className="relative mx-auto h-[310px] w-full max-w-[550px] sm:h-[385px] md:h-[420px]">
            <div className="absolute left-[16%] top-[15%] h-[70%] w-[70%] rounded-full bg-[#70452f]/20 blur-3xl" />
            <div className="absolute left-[23%] top-[14%] h-[69%] w-[63%] rotate-[-14deg] rounded-[48%_52%_45%_55%] bg-[radial-gradient(ellipse_at_37%_28%,#9d785f_0_3%,transparent_17%),radial-gradient(ellipse_at_52%_45%,#895436_0_10%,#4d2c1e_42%,#211817_72%)] shadow-[-18px_19px_28px_#111a,18px_14px_28px_#79543d55]" />
            <div className="absolute left-[10%] top-[33%] h-[26%] w-[29%] rotate-[39deg] rounded-full bg-[linear-gradient(155deg,#56301f,#211716_72%)] shadow-[inset_8px_7px_12px_#9a674a55]" />
            <div className="absolute right-[4%] top-[27%] h-[24%] w-[31%] rotate-[-43deg] rounded-full bg-[linear-gradient(155deg,#5e3827,#211716_72%)] shadow-[inset_-8px_7px_12px_#9a674a55]" />
            <div className="absolute bottom-[7%] left-[40%] h-[30%] w-[22%] rotate-[16deg] rounded-full bg-[linear-gradient(90deg,#271a18,#6c412b_48%,#1d1514)]" />
            <span className="absolute left-[17%] top-[10%] h-3 w-3 rounded-full bg-[#6d402a] shadow-[inset_2px_2px_2px_#c39b7e88]" /><span className="absolute right-[15%] top-[12%] h-2 w-2 rounded-full bg-[#81543c]" /><span className="absolute right-[4%] top-[45%] h-3 w-3 rounded-full bg-[#71432d]" /><span className="absolute bottom-[18%] left-[18%] h-2 w-2 rounded-full bg-[#81533a]" />
            <div className="absolute bottom-[7%] right-[2%] grid h-14 w-14 place-items-center rounded-full border border-white/10 bg-white/[.06] text-xs font-medium text-[#ddd7d0]">NEW</div>
          </div>
        </div>
        <section className="grid overflow-hidden border border-white/[.08] sm:grid-cols-2 lg:grid-cols-[1.1fr_1.25fr_.8fr]">
          <div className="min-h-30 border-b border-white/[.08] p-5 sm:border-r lg:border-b-0"><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-full bg-[linear-gradient(145deg,#c89973,#3f2922)] text-sm font-bold text-white">A</div><div><p className="text-sm font-medium text-[#ded8d2]">Ayskeopi</p><p className="mt-1 text-xs tracking-[.15em] text-[#c8c0b9]">★★★★★ <span className="ml-1 tracking-normal">4.8</span></p></div></div><p className="mt-4 text-sm text-[#aaa29c]">Made with care for coffee lovers.</p></div>
          <div className="min-h-30 border-b border-white/[.08] p-5 lg:border-r lg:border-b-0"><p className="text-xl font-medium text-[#dcd6d0]">Feature</p><p className="mt-3 text-sm text-[#aaa29c]">Premium blends for every mood</p></div>
          <div className="min-h-30 p-5 text-left lg:text-center"><p className="text-5xl font-semibold tracking-[-.07em] text-[#ded8d2]">80%</p><p className="mt-3 text-sm text-[#aaa29c]">Love our coffee</p></div>
        </section>
      </main>
    </section>
  )
}

export default LandingPage
