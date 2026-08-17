import { useState } from 'react'
import './App.css'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import CoffeeQuestPage from './pages/CoffeeQuestPage'
import RewardsPage from './pages/RewardsPage'

const pages = { Home: HomePage, Menu: MenuPage, CoffeeQuest: CoffeeQuestPage, Rewards: RewardsPage }

function App() {
  const [activePage, setActivePage] = useState('Home')
  const [order, setOrder] = useState(false)
  const Page = pages[activePage]
  return <main><nav className="nav"><button className="brand" onClick={() => setActivePage('Home')}><span>☕</span> ROASTERY</button><div className="nav-links">{Object.keys(pages).map((page) => <button className={activePage === page ? 'active' : ''} onClick={() => setActivePage(page)} key={page}>{page}</button>)}</div><button className="profile" onClick={() => setActivePage('Rewards')}>JD <i /></button></nav><Page onNavigate={setActivePage} onAddToOrder={() => setOrder(true)} /><footer>ROASTERY <span>Made for slow mornings & big ideas.</span></footer>{order && <div className="order-toast">☕ Your order is being prepared — ready in 4 min.</div>}</main>
}
export default App
