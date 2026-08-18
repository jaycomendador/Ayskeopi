import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api'
import americanoImage from '../../assets/coffee/americano.png'
import cappuccinoImage from '../../assets/coffee/cappucino.png'
import caramelImage from '../../assets/coffee/caramel.png'
import mochaImage from '../../assets/coffee/mocha.png'
import spanishImage from '../../assets/coffee/spanish.png'
import vanillaImage from '../../assets/coffee/vanilla.png'
import coffeeshopImage from '../../assets/coffee/coffeeshop.png'

const localImages = {
  'Classic Latte': spanishImage,
  'Spanish Latte': spanishImage,
  'Vanilla Latte': vanillaImage,
  'Iced Caramel Latte': caramelImage,
  'Oat Milk Mocha': mochaImage,
  'Iced Americano': americanoImage,
  'Classic Cappuccino': cappuccinoImage,
}

const coffeeImage = coffee => localImages[coffee?.name] || vanillaImage

const additionalCoffees = [
  { name: 'Spanish Latte', description: 'Velvety espresso sweetened with condensed milk.', category: 'Espresso', price: 175 },
  { name: 'Vanilla Latte', description: 'A smooth latte with a fragrant vanilla finish.', category: 'Espresso', price: 175 },
]

const includeLocalCoffees = coffees => [...coffees, ...additionalCoffees.filter(localCoffee => !coffees.some(coffee => coffee.name === localCoffee.name))]

export default function MainPage() {
  const navigate = useNavigate()
  const [coffees, setCoffees] = useState([])
  const [active, setActive] = useState(0)
  const [error, setError] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    api.get('/coffees').then(({ data }) => {
      const menuCoffees = includeLocalCoffees(data)
      setCoffees(menuCoffees)
      setActive(Math.max(0, menuCoffees.findIndex(coffee => coffee.name === 'Spanish Latte')))
    }).catch(() => setError('Unable to load the coffee menu. Please try again.'))
  }, [])

  const nextCoffee = () => setActive(current => (current + 1) % coffees.length)
  const logout = () => {
    localStorage.removeItem('ayskeopiUser')
    navigate('/')
  }
  const coffee = coffees[active]

  if (error) return <main className="grid min-h-screen place-items-center bg-[#100c0a] p-6 text-center font-sans text-[#f2e5d8]"><div><p className="text-sm text-[#c7b3a0]">{error}</p><button onClick={() => window.location.reload()} className="mt-5 rounded-lg bg-[#c87b38] px-5 py-3 text-sm font-bold text-[#160e0a]">Try again</button></div></main>
  if (!coffee) return <main className="grid min-h-screen place-items-center bg-[#100c0a] font-sans text-sm text-[#c7b3a0]">Loading your coffee menu…</main>

  return <main className="relative min-h-screen overflow-hidden bg-[#100c0a] font-sans text-[#f2e5d8]">
    <div aria-hidden="true" className="absolute inset-0 bg-cover bg-center opacity-85" style={{ backgroundImage: `url(${coffeeshopImage})` }} />
    <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,12,10,.48),rgba(16,12,10,.28)_58%,rgba(16,12,10,.2))]" />
    <div className="relative mx-auto flex min-h-screen max-w-[1320px] flex-col px-5 py-6 sm:px-8 lg:px-10">
      <header className="relative z-10 flex items-center justify-between gap-4 border-b border-white/8 pb-4"><button onClick={() => navigate('/app')} className="text-xs font-bold tracking-[.16em]">AYSKEOPI</button><nav className="hidden items-center gap-5 text-xs font-semibold sm:flex"><button onClick={() => navigate('/app')} className="hover:text-[#d5a06f]">Home</button><button onClick={() => navigate('/app/menu')} className="hover:text-[#d5a06f]">Menu</button><button onClick={() => navigate('/app/coffeequest')} className="hover:text-[#d5a06f]">CoffeeQuest</button><button onClick={() => navigate('/app/orders')} className="hover:text-[#d5a06f]">Orders</button></nav><div className="flex items-center gap-3"><p className="hidden text-[10px] font-semibold uppercase tracking-[.24em] text-[#c7b3a0] sm:block">Coffee collection</p><button onClick={logout} className="hidden rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold transition hover:bg-[#f2e5d8] hover:text-[#160e0a] sm:block">Log out</button><button type="button" aria-label="Toggle navigation" aria-expanded={isMenuOpen} onClick={() => setIsMenuOpen(open => !open)} className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-lg sm:hidden">{isMenuOpen ? '×' : '☰'}</button></div></header>
      {isMenuOpen && <nav className="relative z-10 mt-3 grid gap-1 rounded-2xl border border-white/10 bg-[#170e0acc] p-2 text-sm font-semibold backdrop-blur sm:hidden"><button onClick={() => { navigate('/app'); setIsMenuOpen(false) }} className="rounded-xl px-3 py-2 text-left hover:bg-white/10">Home</button><button onClick={() => { navigate('/app/menu'); setIsMenuOpen(false) }} className="rounded-xl px-3 py-2 text-left hover:bg-white/10">Menu</button><button onClick={() => { navigate('/app/coffeequest'); setIsMenuOpen(false) }} className="rounded-xl px-3 py-2 text-left hover:bg-white/10">CoffeeQuest</button><button onClick={() => { navigate('/app/orders'); setIsMenuOpen(false) }} className="rounded-xl px-3 py-2 text-left hover:bg-white/10">Orders</button><button onClick={logout} className="rounded-xl px-3 py-2 text-left text-[#d5a06f] hover:bg-white/10">Log out</button></nav>}

      <section className="grid flex-1 items-center gap-7 py-8 md:grid-cols-2 md:gap-14"><div className="order-1 flex h-[42vh] min-h-72 items-center justify-center md:h-[68vh]"><div className="coffee-image-fade h-full max-h-[640px] aspect-[3/4] overflow-hidden rounded-3xl shadow-2xl shadow-black/50"><img key={coffee._id || coffee.name} src={coffeeImage(coffee)} alt={coffee.name} className="h-full w-full object-cover" /></div></div><div key={coffee._id || coffee.name} className="coffee-text-fade order-2 max-w-xl"><p className="text-xs font-bold uppercase tracking-[.22em] text-[#d18b4b]">{coffee.category || 'Signature coffee'}</p><p className="mt-5 text-lg font-semibold">₱ {coffee.price}</p><h1 className="mt-1 break-words font-serif text-5xl font-black uppercase leading-[.85] tracking-[-.05em] sm:text-6xl lg:text-7xl">{coffee.name}</h1><p className="mt-6 max-w-md text-base leading-7 text-[#c7b3a0]">{coffee.description || 'Made with care for your perfect coffee moment.'}</p><div className="mt-7 flex flex-wrap gap-3"><button onClick={() => navigate('/app/menu')} className="rounded-full bg-[#c87b38] px-5 py-3 text-sm font-bold text-[#160e0a] transition hover:bg-[#e2a163]">Customize coffee</button><button onClick={nextCoffee} className="inline-flex items-center gap-3 rounded-full border border-white/30 px-5 py-3 text-sm font-bold transition hover:bg-white/10">Next coffee <span aria-hidden="true" className="text-lg">→</span></button></div></div></section>

      <footer className="flex items-center"><div className="flex gap-2">{coffees.map((item, index) => <button key={item._id || item.name} onClick={() => setActive(index)} aria-label={`Show ${item.name}`} aria-current={index === active} className={`h-1.5 rounded-full transition-all ${index === active ? 'w-12 bg-[#d18b4b]' : 'w-5 bg-white/25 hover:bg-white/55'}`} />)}</div></footer>
    </div>
  </main>
}
