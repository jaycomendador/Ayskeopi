import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api'
import americanoImage from '../../assets/coffee/americano.png'
import caramelImage from '../../assets/coffee/caramel.png'
import cappuccinoImage from '../../assets/coffee/cappucino.png'
import mochaImage from '../../assets/coffee/mocha.png'
import spanishImage from '../../assets/coffee/spanish.png'
import vanillaImage from '../../assets/coffee/vanilla.png'

const localImages = {
  'Classic Latte': spanishImage,
  'Spanish Latte': spanishImage,
  'Vanilla Latte': vanillaImage,
  'Iced Caramel Latte': caramelImage,
  'Oat Milk Mocha': mochaImage,
  'Iced Americano': americanoImage,
  'Classic Cappuccino': cappuccinoImage,
}

const coffeeImage = coffee => localImages[coffee?.name] || coffee?.image || vanillaImage

const additionalCoffees = [
  { name: 'Spanish Latte', description: 'Velvety espresso sweetened with condensed milk.', category: 'Espresso', price: 175 },
  { name: 'Vanilla Latte', description: 'A smooth latte with a fragrant vanilla finish.', category: 'Espresso', price: 175 },
]

const includeLocalCoffees = coffees => [...coffees, ...additionalCoffees.filter(localCoffee => !coffees.some(coffee => coffee.name === localCoffee.name))]

function OptionGroup({ label, values, value, onChange }) {
  return <fieldset><legend className="text-[11px] font-bold uppercase tracking-[.16em] text-[#c7b3a0]">{label}</legend><div className="mt-3 flex flex-wrap gap-2">{values.map(item => <button type="button" key={item} onClick={() => onChange(item)} className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${value === item ? 'border-[#c87b38] bg-[#c87b38] text-[#160e0a]' : 'border-[#806654] bg-[#251912] text-[#f2e5d8] hover:border-[#d5a06f] hover:bg-[#342219]'}`}>{item}</button>)}</div></fieldset>
}

export default function MenuPage() {
  const navigate = useNavigate()
  const [size, setSize] = useState('Medium')
  const [milk, setMilk] = useState('Oat milk')
  const [extraShot, setExtraShot] = useState(false)
  const [coffees, setCoffees] = useState([])
  const [selected, setSelected] = useState(null)
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    api.get('/coffees').then(({ data }) => {
      const menuCoffees = includeLocalCoffees(data)
      setCoffees(menuCoffees)
      setSelected(menuCoffees.find(coffee => coffee.name === 'Spanish Latte') || menuCoffees.find(coffee => coffee.name === 'Classic Latte') || menuCoffees[0])
    }).catch(() => setMessage('Unable to load the menu. Please start the server and try again.'))
  }, [])

  const total = (selected?.price || 165) + (size === 'Large' ? 20 : size === 'Small' ? -10 : 0) + (extraShot ? 30 : 0)

  const logout = () => {
    localStorage.removeItem('ayskeopiUser')
    navigate('/')
  }

  async function addToOrder() {
    setMessage('')
    setIsSubmitting(true)
    try {
      await api.post('/orders', { coffee: selected?._id, drink: selected?.name || 'Spanish Latte', customizations: { size, milk, extraShot }, total })
      setMessage('Added to your order. We’ll start preparing it shortly.')
    } catch {
      setMessage('Your order could not be saved. Please check the server connection.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return <main className="min-h-screen bg-[#100c0a] font-sans text-[#f2e5d8]">
    <div className="mx-auto max-w-[1280px] px-5 py-6 sm:px-8 lg:px-10">
      <header className="flex items-center justify-between gap-4 border-b border-white/15 pb-4"><button onClick={() => navigate('/app')} className="text-xs font-bold tracking-[.16em]">AYSKEOPI</button><nav className="hidden items-center gap-5 text-xs font-semibold sm:flex"><button onClick={() => navigate('/app')} className="hover:text-[#d5a06f]">Home</button><button className="text-[#d5a06f]">Menu</button><button onClick={() => navigate('/app/coffeequest')} className="hover:text-[#d5a06f]">CoffeeQuest</button><button onClick={() => navigate('/app/orders')} className="hover:text-[#d5a06f]">Orders</button></nav><button onClick={logout} className="rounded-full border border-white/25 px-3 py-1.5 text-xs font-semibold transition hover:bg-[#f2e5d8] hover:text-[#160e0a]">Log out</button></header>

      <section className="mt-6 grid overflow-hidden rounded-3xl border border-[#4d3426] bg-[#1a130f] shadow-[0_20px_50px_rgba(0,0,0,.35)] lg:mt-8 lg:h-[calc(100vh-112px)] lg:grid-cols-[.76fr_1.24fr]">
        <div className="order-2 p-6 sm:p-8 lg:order-2 lg:overflow-y-auto lg:p-10"><div className="flex items-start justify-between gap-4"><div><p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#d18b4b]">Your selection</p><h2 className="mt-2 font-serif text-3xl">{selected?.name || 'Loading coffee…'}</h2><p className="mt-2 max-w-lg text-sm leading-6 text-[#c7b3a0]">{selected?.description || 'Please wait while we load the menu.'}</p></div><span className="rounded-full bg-[#302018] px-3 py-1.5 text-sm font-bold text-[#f2e5d8]">₱{total}</span></div>
          <div className="mt-7 space-y-6"><OptionGroup label="Drink" values={coffees.map(coffee => coffee.name)} value={selected?.name} onChange={name => setSelected(coffees.find(coffee => coffee.name === name))} /><OptionGroup label="Size" values={['Small', 'Medium', 'Large']} value={size} onChange={setSize} /><OptionGroup label="Milk" values={['Whole milk', 'Oat milk', 'Almond milk']} value={milk} onChange={setMilk} />
            <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-[#4d3426] bg-[#251912] p-4 text-sm"><span><b className="block">Extra espresso shot</b><small className="mt-1 block text-[#c7b3a0]">Add a richer, bolder finish · + ₱30</small></span><input type="checkbox" checked={extraShot} onChange={event => setExtraShot(event.target.checked)} className="h-4 w-4 accent-[#c87b38]" /></label>
          </div>
          <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between"><div><b className="text-2xl">₱{total}</b><span className="mt-1 block text-xs text-[#c7b3a0]">Estimated total</span></div><button disabled={!selected || isSubmitting} onClick={addToOrder} className="rounded-full bg-[#c87b38] px-6 py-3 text-sm font-bold text-[#160e0a] transition hover:bg-[#e2a163] disabled:cursor-wait disabled:opacity-60">{isSubmitting ? 'Adding…' : 'Add to order'}</button></div>{message && <p role="status" className="mt-4 rounded-xl bg-[#302018] p-3 text-xs text-[#e8d7c8]">{message}</p>}
        </div>
        <div className="relative order-1 min-h-[280px] overflow-hidden bg-[#e7d7c1] sm:min-h-[360px] lg:order-1 lg:min-h-0"><img key={selected?._id || selected?.name} src={coffeeImage(selected)} alt={selected?.name || 'Selected coffee'} className="absolute inset-0 h-full w-full object-cover" /><p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent px-6 pb-6 pt-14 text-center text-xs font-medium text-white">{size} · {milk} · {extraShot ? 'Double shot' : 'Single shot'}</p></div>
      </section>
    </div>
  </main>
}
