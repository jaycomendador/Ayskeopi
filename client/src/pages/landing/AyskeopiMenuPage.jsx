import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import AuthModal from '../../components/AuthModal'
import CartModal from '../../components/CartModal'
import ProfileModal from '../../components/ProfileModal'
import OrderCustomizeModal from '../../components/OrderCustomizeModal'
import ContactModal from '../../components/ContactModal'
import LoginRequiredModal from '../../components/LoginRequiredModal'

const ICED_MENU = [
  { id: 1, name: 'Vanilla Bean Cold Brew', tag: 'POPULAR', price: 155, img: '/menu/01_Vanilla_Bean_Cold_Brew.png', desc: 'Slow-steeped cold brew topped with a float of rich vanilla sweet cream.' },
  { id: 2, name: 'Pistachio Cream Iced Coffee', tag: 'NEW', price: 175, img: '/menu/02_Pistachio_Cream_Cold_Coffee.png', desc: 'Signature iced coffee crowned with silky pistachio-infused cream cold foam.' },
  { id: 3, name: 'Salted Caramel Frappé', tag: 'BEST SELLER', price: 185, img: '/menu/03_Salted_Caramel_Frappe.png', desc: 'Blended iced espresso with salted caramel ribbons and whipped cream.' },
  { id: 4, name: 'Brown Sugar Oat Milk Shaken Espresso', tag: 'TRENDING', price: 180, img: '/menu/04_Brown_Sugar_Oat_Milk_Shaken_Espresso.png', desc: 'Blonde espresso shaken with brown sugar and cinnamon, topped with oat milk.' },
  { id: 5, name: 'Mocha Crunch Iced Coffee', tag: null, price: 175, img: '/menu/05_Mocha_Crunch_Iced_Coffee.png', desc: 'Rich dark chocolate mocha over ice with crushed cacao cookie crumble.' },
  { id: 6, name: 'Toasted Coconut Cold Brew', tag: 'NEW', price: 165, img: '/menu/06_Toasted_Coconut_Cold_Brew.png', desc: 'Tropical cold brew infused with toasted coconut and coconut milk foam.' },
  { id: 7, name: 'Lavender Honey Iced Latte', tag: null, price: 175, img: '/menu/07_Lavender_Honey_Iced_Latte.png', desc: 'Floral French lavender and wild honey layered with espresso and chilled milk.' },
  { id: 8, name: 'Cinnamon Dolce Iced Coffee', tag: null, price: 165, img: '/menu/08_Cinnamon_Dolce_Iced_Coffee.png', desc: 'Sweet cinnamon brown sugar syrup with bold espresso and creamy cold milk.' },
  { id: 9, name: 'Maple Pecan Iced Latte', tag: null, price: 170, img: '/menu/09_Maple_Pecan_Iced_Latte.png', desc: 'Roasted pecan notes and pure maple syrup paired with smooth chilled espresso.' },
  { id: 10, name: 'Cardamom Spice Cold Brew', tag: 'SPECIAL', price: 160, img: '/menu/10_Cardamom_Spice_Cold_Brew.png', desc: 'Aromatic crushed cardamom and subtle warm spices brewed in cold brew.' },
]

export default function AyskeopiMenuPage({ onHome, onLogin, onRegister, onMenu, onMatch, onRewards }) {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('All')
  
  // Modals state
  const [authModal, setAuthModal] = useState(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [customizingCoffee, setCustomizingCoffee] = useState(null)
  const [loginRequired, setLoginRequired] = useState(null)

  // User state
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('ayskeopiUser'))
    } catch {
      return null
    }
  })

  // Cart state
  const [cart, setCart] = useState([])

  // Load/Merge cart when user changes
  useEffect(() => {
    try {
      if (user) {
        const storedUserCart = localStorage.getItem(`ayskeopiCart_${user.id || user._id}`)
        const userCart = storedUserCart ? JSON.parse(storedUserCart) : []
        
        const guestCartStored = localStorage.getItem('ayskeopiCart_guest')
        const guestCart = guestCartStored ? JSON.parse(guestCartStored) : []
        
        if (guestCart.length > 0) {
          const merged = [...userCart]
          guestCart.forEach(gItem => {
            const existing = merged.find(uItem => uItem.cartId === gItem.cartId)
            if (existing) {
              existing.qty += gItem.qty
            } else {
              merged.push(gItem)
            }
          })
          setCart(merged)
          localStorage.setItem(`ayskeopiCart_${user.id || user._id}`, JSON.stringify(merged))
          localStorage.removeItem('ayskeopiCart_guest')
        } else {
          setCart(userCart)
        }
      } else {
        localStorage.removeItem('ayskeopiCart_guest')
        setCart([])
      }
    } catch {
      setCart([])
    }
  }, [user])

  // Save cart when cart changes
  useEffect(() => {
    try {
      const key = user ? `ayskeopiCart_${user.id || user._id}` : 'ayskeopiCart_guest'
      localStorage.setItem(key, JSON.stringify(cart))
    } catch {}
  }, [cart, user])

  const openLogin    = () => setAuthModal('login')
  const openRegister = () => setAuthModal('register')
  const closeModal   = () => {
    setAuthModal(null)
    try {
      setUser(JSON.parse(sessionStorage.getItem('ayskeopiUser')))
    } catch {}
  }
  const switchModal  = () => setAuthModal(m => m === 'login' ? 'register' : 'login')

  const goLogin    = onLogin    ?? openLogin
  const goRegister = onRegister ?? openRegister
  const goHome     = onHome     ?? (() => navigate('/'))
  const goMatch    = onMatch    ?? (() => navigate('/coffee-match'))
  const goRewards  = onRewards  ?? (() => navigate('/rewards'))

  function addToCart(item) {
    setCart(prev => {
      const existing = prev.find(i => i.cartId === item.cartId)
      if (existing) {
        return prev.map(i => i.cartId === item.cartId ? { ...i, qty: i.qty + item.qty } : i)
      }
      return [...prev, item]
    })
    setIsCartOpen(true)
  }

  function updateCartQty(cartId, newQty) {
    if (newQty <= 0) {
      setCart(prev => prev.filter(i => i.cartId !== cartId))
    } else {
      setCart(prev => prev.map(i => i.cartId === cartId ? { ...i, qty: newQty } : i))
    }
  }

  function removeCartItem(cartId) {
    setCart(prev => prev.filter(i => i.cartId !== cartId))
  }

  function clearCart() {
    setCart([])
  }

  function handleLogout() {
    sessionStorage.removeItem('ayskeopiUser')
    localStorage.removeItem('ayskeopiCart_guest')
    setUser(null)
    setCart([])
  }

  function handleOrderClick(coffee) {
    if (!user) {
      setLoginRequired('order')
      return
    }
    setCustomizingCoffee(coffee)
  }

  const filteredItems = filter === 'All' 
    ? ICED_MENU 
    : filter === 'Cold Brew' 
      ? ICED_MENU.filter(i => i.name.includes('Cold Brew'))
      : filter === 'Iced Latte'
        ? ICED_MENU.filter(i => i.name.includes('Latte'))
        : ICED_MENU.filter(i => !i.name.includes('Cold Brew') && !i.name.includes('Latte'))

  const cartTotalCount = cart.reduce((sum, item) => sum + item.qty, 0)

  return (
    <div style={{ minHeight: '100vh', background: '#0d0c0b', color: '#e8e2d8', fontFamily: "'Inter', sans-serif", overflowX: 'hidden', paddingTop: 64 }}>
      {authModal && <AuthModal mode={authModal} onClose={closeModal} onSwitch={switchModal} />}
      {loginRequired && (
        <LoginRequiredModal
          actionType={loginRequired}
          onClose={() => setLoginRequired(null)}
          onLoginClick={openLogin}
        />
      )}
      {isCartOpen && (
        <CartModal
          cart={cart}
          user={user}
          onClose={() => setIsCartOpen(false)}
          onUpdateQty={updateCartQty}
          onRemoveItem={removeCartItem}
          onClearCart={clearCart}
          onRequireAuth={() => setLoginRequired('cart')}
          onOrderSuccess={() => {
            try {
              setUser(JSON.parse(sessionStorage.getItem('ayskeopiUser')))
            } catch {}
          }}
        />
      )}
      {isProfileOpen && (
        <ProfileModal
          user={user}
          onClose={() => setIsProfileOpen(false)}
          onLogout={handleLogout}
        />
      )}
      {customizingCoffee && (
        <OrderCustomizeModal
          coffee={customizingCoffee}
          onClose={() => setCustomizingCoffee(null)}
          onAddToCart={addToCart}
        />
      )}
      {isContactOpen && (
        <ContactModal onClose={() => setIsContactOpen(false)} />
      )}

      <Navbar
        onEnter={goHome}
        onLogin={goLogin}
        onRegister={goRegister}
        onMenu={onMenu}
        onMatch={goMatch}
        onRewards={goRewards}
        onContact={() => setIsContactOpen(true)}
        user={user}
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      <main className="page-inner">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <p style={{ margin: '0 0 8px', fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c9a84c' }}>Ayskeopi Collection</p>
          <h1 style={{ margin: '0 0 12px', fontSize: 'clamp(1.8rem,3.8vw,2.8rem)', fontWeight: 900, letterSpacing: '-0.03em' }}>ICED COFFEE MENU</h1>
          <p style={{ margin: '0 auto', maxWidth: 480, fontSize: 12, lineHeight: 1.7, color: '#7a736d' }}>
            Ten handcrafted cold brews, iced lattes, and shaken espresso creations steeped for crisp, velvety perfection.
          </p>

          {/* Filter Pills */}
          <div style={{ marginTop: 22, display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }} className="menu-filter-pills">
            {['All', 'Cold Brew', 'Iced Latte', 'Specialty & Frappé'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                style={{
                  background: filter === cat ? '#c9a84c' : 'rgba(255,255,255,.05)',
                  color: filter === cat ? '#000' : '#b8b0a6',
                  border: filter === cat ? '1px solid #c9a84c' : '1px solid rgba(255,255,255,.1)',
                  borderRadius: 20,
                  padding: '6px 16px',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all .2s',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 10 Cards Grid */}
        <div className="menu-grid" style={{ gap: 16 }}>
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOrderClick(item)}
              style={{
                position: 'relative',
                background: '#161412',
                borderRadius: 16,
                border: '1px solid rgba(255,255,255,.08)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform .2s, border-color .2s, box-shadow .2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,.4)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,.6)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.08)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              {item.tag && (
                <span style={{ position: 'absolute', top: 8, left: 8, zIndex: 2, background: '#c9a84c', color: '#000', fontSize: 8, fontWeight: 800, letterSpacing: '0.06em', borderRadius: 4, padding: '2px 6px' }}>
                  {item.tag}
                </span>
              )}
              <div
                style={{ width: '100%', height: 180, overflow: 'hidden', background: '#e3d7c9' }}
              >
                <img
                  src={item.img}
                  alt={item.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .3s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>
              <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <span style={{ display: 'inline-block', fontSize: 8, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c9a84c', border: '1px solid rgba(201,168,76,.35)', borderRadius: 3, padding: '1px 5px', marginBottom: 5 }}>
                    ICE COFFEE
                  </span>
                  <h3
                    style={{ margin: '0 0 3px', fontSize: 12, fontWeight: 700, color: '#e8e2d8', lineHeight: 1.35 }}
                  >
                    {item.name}
                  </h3>
                  <p style={{ margin: 0, fontSize: 10, lineHeight: 1.45, color: '#7a736d' }}>{item.desc}</p>
                </div>
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,.06)', paddingTop: 10 }}>
                  <strong style={{ fontSize: 14, fontWeight: 800, color: '#c9a84c' }}>₱{item.price}</strong>
                  <button
                    onClick={e => { e.stopPropagation(); handleOrderClick(item) }}
                    style={{
                      background: '#c9a84c',
                      color: '#000',
                      border: 'none',
                      borderRadius: 6,
                      padding: '6px 12px',
                      fontSize: 10,
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                      cursor: 'pointer',
                      transition: 'background .2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#e2bd60'}
                    onMouseLeave={e => e.currentTarget.style.background = '#c9a84c'}
                  >
                    Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
