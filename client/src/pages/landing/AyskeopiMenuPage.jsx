import { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import api from '../../api'
import americanoImage from '../../assets/coffee/americano.png'
import cappuccinoImage from '../../assets/coffee/cappucino.png'
import caramelImage from '../../assets/coffee/caramel.png'
import mochaImage from '../../assets/coffee/mocha.png'
import spanishImage from '../../assets/coffee/spanish.png'
import vanillaImage from '../../assets/coffee/vanilla.png'

const starterCoffees = [
  { name: 'Classic Latte', description: 'Smooth espresso with steamed milk.', category: 'Espresso', price: 165 },
  { name: 'Iced Caramel Latte', description: 'Creamy, sweet, and refreshing.', category: 'Iced', price: 185 },
  { name: 'Oat Milk Mocha', description: 'Chocolatey espresso with oat milk.', category: 'Espresso', price: 195 },
  { name: 'Iced Americano', description: 'Bold espresso over ice.', category: 'Iced', price: 145 },
  { name: 'Classic Cappuccino', description: 'Rich espresso topped with silky milk foam.', category: 'Espresso', price: 175 },
]

const coffeeImages = { americano: americanoImage, cappuccino: cappuccinoImage, caramel: caramelImage, mocha: mochaImage, spanish: spanishImage, vanilla: vanillaImage }

function imageForCoffee(coffee) {
  const name = coffee.name.toLowerCase()
  if (name.includes('americano')) return coffeeImages.americano
  if (name.includes('caramel')) return coffeeImages.caramel
  if (name.includes('mocha')) return coffeeImages.mocha
  if (name.includes('cappuccino')) return coffeeImages.cappuccino
  if (name.includes('spanish')) return coffeeImages.spanish
  return coffeeImages.vanilla
}

function Arrow({ direction }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8"><path d={direction === 'left' ? 'm14 6-6 6 6 6' : 'm10 6 6 6-6 6'} strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function Preview({ coffee, onClick }) {
  return <button onClick={onClick} aria-label={`Show ${coffee.name}`} className="hidden w-28 shrink-0 opacity-55 transition duration-300 hover:scale-105 hover:opacity-90 sm:block"><span className="block aspect-[.7] overflow-hidden rounded-3xl border border-white/10 bg-[#392b27] shadow-xl"><img src={imageForCoffee(coffee)} alt="" className="h-full w-full object-cover" /></span></button>
}

export default function AyskeopiMenuPage({ onHome, onLogin, onRegister, onMenu, onMatch, onRewards }) {
  const [coffees, setCoffees] = useState(starterCoffees)
  const [active, setActive] = useState(0)
  const [message, setMessage] = useState('')

  useEffect(() => {
    api.get('/coffees').then(({ data }) => {
      if (data.length) {
        setCoffees(data)
        setActive(0)
      }
    }).catch(() => setMessage('Showing the Ayskeopi starter menu while the database is unavailable.'))
  }, [])

  const move = (amount) => setActive(current => (current + amount + coffees.length) % coffees.length)
  const at = (offset) => coffees[(active + offset + coffees.length) % coffees.length]
  const selected = at(0)
  if (!selected) return null

  return <main className="h-screen overflow-hidden bg-[radial-gradient(circle_at_50%_42%,#725344_0,#403431_30%,#292826_69%)] font-sans text-[#e7e2dd]">
    <Navbar onEnter={onHome} onLogin={onLogin} onRegister={onRegister} onMenu={onMenu} onMatch={onMatch} onRewards={onRewards} />
    <section className="mx-auto flex h-[calc(100vh-3.5rem)] max-w-6xl flex-col overflow-hidden px-5 py-5 sm:px-8">
      <header className="coffee-menu-enter shrink-0 text-center">
        <p className="text-[10px] uppercase tracking-[.32em] text-[#cdbbab]">Ayskeopi selection</p>
        <h1 className="mt-2 text-3xl font-black tracking-[-.05em] sm:text-5xl">Coffee Menu</h1>
        {message && <p className="mt-2 text-xs text-[#cdbbab]">{message}</p>}
      </header>
      <div className="flex min-h-[250px] flex-1 items-center justify-center gap-3 overflow-hidden sm:gap-8">
        <Preview coffee={at(-1)} onClick={() => move(-1)} />
        <button onClick={() => move(-1)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/20 bg-white/[.06] transition hover:scale-110 hover:bg-white/15" aria-label="Previous coffee"><Arrow direction="left" /></button>
        <article key={selected.name} className="coffee-card-enter relative h-[335px] w-[min(66vw,260px)] shrink-0 overflow-hidden rounded-[2rem] border border-white/20 bg-[#392b27] text-center shadow-2xl sm:h-[390px] sm:w-[300px]">
          <img src={imageForCoffee(selected)} alt={selected.name} className="absolute inset-0 h-full w-full object-cover" />
        </article>
        <button onClick={() => move(1)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/20 bg-white/[.06] transition hover:scale-110 hover:bg-white/15" aria-label="Next coffee"><Arrow direction="right" /></button>
        <Preview coffee={at(1)} onClick={() => move(1)} />
      </div>
      <footer className="coffee-menu-enter coffee-menu-enter-delay mx-auto w-full max-w-xl shrink-0 pb-2 text-center">
        <p className="text-sm leading-6 text-[#c2bab3]">{selected.description || 'Carefully crafted by Ayskeopi.'}</p>
        <div className="mt-3 flex items-center justify-center gap-4"><strong className="text-lg">₱{selected.price}</strong><button onClick={onLogin} className="rounded-md border border-white/25 px-4 py-2 text-xs font-medium transition hover:bg-white/10">Sign in to order</button></div>
        <div className="mt-4 flex justify-center gap-2">{coffees.map((coffee, index) => <button key={coffee._id || coffee.name} onClick={() => setActive(index)} aria-label={`Show ${coffee.name}`} className={`h-1.5 rounded-full transition-all ${index === active ? 'w-6 bg-[#e0ddd8]' : 'w-1.5 bg-white/30'}`} />)}</div>
      </footer>
    </section>
  </main>
}
