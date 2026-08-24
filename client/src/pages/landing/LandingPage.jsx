import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import AuthModal from '../../components/AuthModal'
import CartModal from '../../components/CartModal'
import ProfileModal from '../../components/ProfileModal'
import OrderCustomizeModal from '../../components/OrderCustomizeModal'
import ContactModal from '../../components/ContactModal'
import LoginRequiredModal from '../../components/LoginRequiredModal'

/* ─── SVG Icons ────────────────────────────────────────────── */
function IconBean() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20, color: '#c9a84c' }}>
      <ellipse cx="12" cy="12" rx="7" ry="4" transform="rotate(-35 12 12)" />
      <path d="M12 5c0 7 0 7 0 14" />
    </svg>
  )
}
function IconIce() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20, color: '#c9a84c' }}>
      <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93 4.93 19.07" />
    </svg>
  )
}
function IconDrop() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20, color: '#c9a84c' }}>
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  )
}
function IconHeart() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20, color: '#c9a84c' }}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}
function IconStar() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 11, height: 11, color: '#c9a84c' }}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01z" />
    </svg>
  )
}
function IconCup() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 70, height: 70, color: '#c9a84c' }}>
      <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3" />
    </svg>
  )
}

const FEATURES = [
  { Icon: IconBean, title: 'Premium Beans', desc: 'Sourced from the finest single-origin estates worldwide.' },
  { Icon: IconIce, title: 'Cold-Crafted', desc: 'Steeped for 18 hours for max smoothness over ice.' },
  { Icon: IconDrop, title: 'Perfect Blend', desc: 'Balanced for bold taste with zero bitterness.' },
  { Icon: IconHeart, title: 'Made with Passion', desc: 'Crafted by baristas who live and breathe iced coffee.' },
]

const BEST_SELLERS = [
  { id: 1, name: 'Vanilla Bean Cold Brew', tag: 'POPULAR', price: 155, img: '/menu/01_Vanilla_Bean_Cold_Brew.png', desc: 'Slow-steeped & vanilla sweet cream' },
  { id: 2, name: 'Pistachio Cream Iced Coffee', tag: 'NEW', price: 175, img: '/menu/02_Pistachio_Cream_Cold_Coffee.png', desc: 'Silky pistachio cold foam & espresso' },
  { id: 3, name: 'Salted Caramel Frappé', tag: 'BEST SELLER', price: 185, img: '/menu/03_Salted_Caramel_Frappe.png', desc: 'Blended iced coffee & caramel drizzle' },
  { id: 4, name: 'Brown Sugar Oat Milk Shaken Espresso', tag: 'TRENDING', price: 180, img: '/menu/04_Brown_Sugar_Oat_Milk_Shaken_Espresso.png', desc: 'Shaken blonde espresso & creamy oat milk' },
  { id: 5, name: 'Mocha Crunch Iced Coffee', tag: null, price: 175, img: '/menu/05_Mocha_Crunch_Iced_Coffee.png', desc: 'Dark chocolate mocha & cookie crunch' },
  { id: 6, name: 'Toasted Coconut Cold Brew', tag: 'NEW', price: 165, img: '/menu/06_Toasted_Coconut_Cold_Brew.png', desc: 'Toasted coconut flakes & coconut foam' },
  { id: 7, name: 'Lavender Honey Iced Latte', tag: null, price: 175, img: '/menu/07_Lavender_Honey_Iced_Latte.png', desc: 'French lavender, honey & cold milk' },
  { id: 8, name: 'Cinnamon Dolce Iced Coffee', tag: null, price: 165, img: '/menu/08_Cinnamon_Dolce_Iced_Coffee.png', desc: 'Spiced cinnamon syrup & iced latte' },
  { id: 9, name: 'Maple Pecan Iced Latte', tag: null, price: 170, img: '/menu/09_Maple_Pecan_Iced_Latte.png', desc: 'Roasted pecan notes & pure maple syrup' },
  { id: 10, name: 'Cardamom Spice Cold Brew', tag: 'SPECIAL', price: 160, img: '/menu/10_Cardamom_Spice_Cold_Brew.png', desc: 'Crushed cardamom & spiced cold brew' },
]

function LandingPage({ onEnter, onLogin, onRegister, onMenu, onMatch, onRewards }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  
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
  const goMenu     = onMenu     ?? (() => navigate('/coffee-menu'))
  const goMatch    = onMatch    ?? (() => navigate('/coffee-match'))

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
      removeCartItem(cartId)
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

  const cartTotalCount = cart.reduce((sum, item) => sum + item.qty, 0)

  // ── Scroll-reveal helper
  function useScrollReveal(options = {}) {
    const ref = useRef(null)
    const [visible, setVisible] = useState(false)
    useEffect(() => {
      const el = ref.current
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
        { threshold: 0.15, ...options }
      )
      obs.observe(el)
      return () => obs.disconnect()
    }, [])
    return [ref, visible]
  }

  const [passionImgRef, passionImgVisible] = useScrollReveal()
  const [passionTextRef, passionTextVisible] = useScrollReveal()

  return (
    <div style={{ background: '#0d0c0b', color: '#e8e2d8', fontFamily: "'Inter', sans-serif", overflowX: 'hidden', paddingTop: 64 }}>
      {/* Modals */}
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
      {isContactOpen && (
        <ContactModal
          onClose={() => setIsContactOpen(false)}
        />
      )}
      {customizingCoffee && (
        <OrderCustomizeModal
          coffee={customizingCoffee}
          onClose={() => setCustomizingCoffee(null)}
          onAddToCart={addToCart}
        />
      )}

      {/* Navbar with User profile & Live Cart Counter */}
      <Navbar
        onEnter={onEnter}
        onLogin={goLogin}
        onRegister={goRegister}
        onMenu={goMenu}
        onMatch={goMatch}
        onRewards={onRewards}
        onContact={() => setIsContactOpen(true)}
        user={user}
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* ── HERO ── */}
      <section className="hero-section">
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 80% 20%, rgba(201,168,76,.14) 0, transparent 60%)', pointerEvents: 'none' }} />

        {/* Left */}
        <div className="hero-left" style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.32em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: 12 }}>PREMIUM ICE COFFEE</p>
          <h1 style={{ fontSize: 'clamp(2rem,4.2vw,3.4rem)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.03em', margin: 0 }}>
            <span style={{ color: '#e8e2d8' }}>GOOD ICE.</span><br />
            <span style={{ background: 'linear-gradient(90deg,#c9a84c,#e8d080,#c9a84c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>GREAT DAYS.</span>
          </h1>
          <p style={{ marginTop: 16, maxWidth: 400, fontSize: 12, lineHeight: 1.7, color: '#9a938d' }}>
            Cold-brewed to perfection, crafted for your refreshment. Discover bold flavors steeped over ice — every sip is a chill moment worth savoring.
          </p>
          <div style={{ marginTop: 24, display: 'flex', gap: 10, flexWrap: 'wrap' }} className="hero-btns">
            <button
              onClick={() => handleOrderClick(BEST_SELLERS[0])}
              style={{ background: '#c9a84c', color: '#000', border: 'none', borderRadius: 6, padding: '11px 22px', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', cursor: 'pointer' }}
            >
              ORDER COLD BREW
            </button>
            <button
              onClick={goMenu}
              style={{ background: 'transparent', color: '#c8c0b8', border: '1px solid rgba(255,255,255,.18)', borderRadius: 6, padding: '11px 22px', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', cursor: 'pointer' }}
            >
              BROWSE 10 COFFEES
            </button>
          </div>
        </div>

        {/* Right image with floating animation */}
        <div className="hero-right">
          <div className="hero-float hero-img-wrap">
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 60%, rgba(201,168,76,.25) 0, transparent 70%)', borderRadius: '50%' }} />
            <img
              src="/hero_iced_coffee.jpg"
              onError={e => { e.currentTarget.src = '/menu/01_Vanilla_Bean_Cold_Brew.png' }}
              alt="Premium iced coffee"
              className="hero-img"
              style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', objectFit: 'cover', borderRadius: 20, boxShadow: '0 32px 80px rgba(0,0,0,.8)' }}
            />
            {/* Rating chip */}
            <div style={{ position: 'absolute', top: '28%', left: -20, zIndex: 2, background: 'rgba(26,23,20,.92)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, padding: '8px 12px', backdropFilter: 'blur(8px)' }}>
              <div style={{ display: 'flex', gap: 3 }}>{[...Array(5)].map((_, i) => <IconStar key={i} />)}</div>
              <p style={{ margin: '3px 0 0', fontSize: 10, color: '#9a938d' }}>4.9 · 3,200+ reviews</p>
            </div>
            {/* NEW badge */}
            <div style={{ position: 'absolute', bottom: 20, right: 12, zIndex: 2, width: 48, height: 48, borderRadius: '50%', border: '1px solid rgba(201,168,76,.4)', background: 'rgba(201,168,76,.15)', backdropFilter: 'blur(8px)', display: 'grid', placeItems: 'center' }}>
              <span style={{ fontSize: 9, fontWeight: 800, color: '#c9a84c' }}>NEW</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES BAR ── */}
      <section className="features-section">
        <div className="features-grid">
          {FEATURES.map(({ Icon, title, desc }) => (
            <div key={title} className="feature-card">
              <Icon />
              <p style={{ fontSize: 12, fontWeight: 700, color: '#ddd7d0' }}>{title}</p>
              <p style={{ fontSize: 11, lineHeight: 1.5, color: '#7a736d' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PASSION SECTION ── */}
      <style>{`
        @keyframes fadeSlideLeft  { from { opacity:0; transform:translateX(-36px) } to { opacity:1; transform:none } }
        @keyframes fadeSlideRight { from { opacity:0; transform:translateX( 36px) } to { opacity:1; transform:none } }
      `}</style>
      <section className="passion-section">
        <div
          ref={passionImgRef}
          style={{
            position: 'relative', borderRadius: 18, overflow: 'hidden',
            opacity: passionImgVisible ? 1 : 0,
            animation: passionImgVisible ? 'fadeSlideLeft 0.75s cubic-bezier(.22,1,.36,1) both' : 'none',
          }}
        >
          <img
            src="/passion_section_coffee.jpg"
            onError={e => { e.currentTarget.src = '/menu/03_Salted_Caramel_Frappe.png' }}
            alt="Our passion"
            className="passion-img"
            style={{ width: '100%', height: 380, objectFit: 'cover', borderRadius: 18 }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(0,0,0,.35) 0,transparent 60%)', borderRadius: 18 }} />
          <div style={{ position: 'absolute', bottom: 18, left: 18, background: 'rgba(0,0,0,.65)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 10, padding: '8px 14px', backdropFilter: 'blur(8px)' }}>
            <p style={{ margin: 0, fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c' }}>Our Story</p>
            <p style={{ margin: '2px 0 0', fontSize: 11, fontWeight: 600 }}>Born from a love of the cold brew.</p>
          </div>
        </div>
        <div
          ref={passionTextRef}
          style={{
            opacity: passionTextVisible ? 1 : 0,
            animation: passionTextVisible ? 'fadeSlideRight 0.75s 0.18s cubic-bezier(.22,1,.36,1) both' : 'none',
          }}
        >
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: 10 }}>Our Craft</p>
          <h2 style={{ fontSize: 'clamp(1.3rem,2.5vw,2rem)', fontWeight: 900, lineHeight: 1.18, letterSpacing: '-0.02em', margin: '0 0 14px' }}>
            MORE THAN ICE COFFEE,<br />
            <span style={{ color: '#c9a84c' }}>IT&apos;S OUR PASSION.</span>
          </h2>
          <p style={{ fontSize: 12, lineHeight: 1.75, color: '#7a736d', maxWidth: 420 }}>
            We believe every glass of iced coffee should be an experience. Our cold brew masters steep premium beans for 18 hours at low temperatures to unlock a naturally sweet, smooth profile with zero bitterness — just pure, chilled perfection.
          </p>
          <button onClick={goMatch} style={{ marginTop: 20, background: 'transparent', color: '#c9a84c', border: '1px solid rgba(201,168,76,.4)', borderRadius: 6, padding: '9px 18px', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', cursor: 'pointer' }}>
            LEARN MORE →
          </button>
        </div>
      </section>

      {/* ── 10 ICED COFFEES MENU GRID ── */}
      <section style={{ background: '#0f0e0c', padding: '56px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: 8 }}>Handcrafted Selection</p>
            <h2 style={{ fontSize: 'clamp(1.2rem,2.2vw,1.7rem)', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>OUR 10 SIGNATURE ICED COFFEES</h2>
          </div>
          <div className="menu-grid">
            {BEST_SELLERS.map((coffee) => (
              <div
                key={coffee.name}
                onClick={() => handleOrderClick(coffee)}
                style={{
                  position: 'relative',
                  background: '#161412',
                  borderRadius: 16,
                  border: '1px solid rgba(255,255,255,.07)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform .2s, border-color .2s, box-shadow .2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,.4)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,.6)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.07)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                {coffee.tag && <span style={{ position: 'absolute', top: 8, left: 8, zIndex: 2, background: '#c9a84c', color: '#000', fontSize: 8, fontWeight: 800, letterSpacing: '0.06em', borderRadius: 4, padding: '2px 6px' }}>{coffee.tag}</span>}
                <div
                  style={{ width: '100%', height: 180, overflow: 'hidden', background: '#e3d7c9' }}
                >
                  <img src={coffee.img} alt={coffee.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .3s' }} 
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                </div>
                <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ display: 'inline-block', fontSize: 8, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c9a84c', border: '1px solid rgba(201,168,76,.35)', borderRadius: 3, padding: '1px 5px', marginBottom: 5 }}>ICE COFFEE</span>
                    <h3
                      style={{ margin: '0 0 3px', fontSize: 12, fontWeight: 700, color: '#e8e2d8', lineHeight: 1.3 }}
                    >
                      {coffee.name}
                    </h3>
                    <p style={{ margin: 0, fontSize: 10, lineHeight: 1.45, color: '#7a736d' }}>{coffee.desc}</p>
                  </div>
                  <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,.06)', paddingTop: 8 }}>
                    <strong style={{ fontSize: 13, fontWeight: 800, color: '#c9a84c' }}>₱{coffee.price}</strong>
                    <button
                      onClick={e => { e.stopPropagation(); handleOrderClick(coffee) }}
                      title="Customize and add to order"
                      style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.15)', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', color: '#e8e2d8', fontSize: 13, display: 'grid', placeItems: 'center' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#c9a84c'; e.currentTarget.style.color = '#000'; e.currentTarget.style.borderColor = '#c9a84c' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.05)'; e.currentTarget.style.color = '#e8e2d8'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.15)' }}
                    >+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROMO + COMMUNITY ── */}
      <section className="page-section-pad">
        <div className="promo-grid">
          {/* Promo card */}
          <div style={{ position: 'relative', background: 'linear-gradient(135deg,#2a1f0f,#1a1208)', borderRadius: 16, padding: '30px 28px', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(201,168,76,.08)', filter: 'blur(40px)', pointerEvents: 'none' }} />
            <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c9a84c', margin: '0 0 8px' }}>Special Offer</p>
            <h3 style={{ fontSize: 'clamp(1.3rem,2.5vw,1.9rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em', margin: '0 0 8px' }}>
              SIGN UP &amp; GET<br /><span style={{ color: '#c9a84c' }}>10% OFF</span>
            </h3>
            <p style={{ fontSize: 11, lineHeight: 1.6, color: '#7a736d', maxWidth: 240, margin: '0 0 16px' }}>On your first iced coffee order. Join thousands of cold brew lovers who start every day chilled.</p>
            <button onClick={openRegister} style={{ background: '#c9a84c', color: '#000', border: 'none', borderRadius: 6, padding: '9px 18px', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', cursor: 'pointer' }}>JOIN NOW</button>
            <div style={{ position: 'absolute', bottom: 12, right: 18, opacity: 0.15, pointerEvents: 'none', userSelect: 'none' }}>
              <IconCup />
            </div>
          </div>

          {/* Community card */}
          <div style={{ position: 'relative', background: '#111009', border: '1px solid rgba(255,255,255,.07)', borderRadius: 16, padding: '30px 28px', overflow: 'hidden' }}>
            <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c9a84c', margin: '0 0 8px' }}>Community</p>
            <h3 style={{ fontSize: 'clamp(1.1rem,2vw,1.5rem)', fontWeight: 900, lineHeight: 1.2, letterSpacing: '-0.02em', margin: '0 0 8px' }}>JOIN OUR ICE COFFEE COMMUNITY</h3>
            <p style={{ fontSize: 11, lineHeight: 1.6, color: '#7a736d', maxWidth: 320, margin: '0 0 16px' }}>Get the latest drops, exclusive recipes, and members-only discounts delivered straight to your inbox.</p>
            <form onSubmit={e => { e.preventDefault(); if (email) setSubscribed(true) }} style={{ display: 'flex', gap: 8 }}>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ flex: 1, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 6, padding: '8px 12px', fontSize: 11, color: '#fff', outline: 'none' }}
              />
              <button type="submit" style={{ background: '#c9a84c', color: '#000', border: 'none', borderRadius: 6, padding: '8px 14px', fontSize: 10, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {subscribed ? '✓ JOINED!' : 'SUBSCRIBE'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,.07)', background: '#0a0908', padding: '48px 40px' }}>
        <div className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ width: 28, height: 28, borderRadius: '50%', background: '#c9a84c', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 900, color: '#000' }}>A</span>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em' }}>AYSKEOPI</span>
            </div>
            <p style={{ fontSize: 10, lineHeight: 1.7, color: '#5a5450', maxWidth: 180 }}>Good ice. Great days. Your premium destination for iced coffee.</p>
          </div>
          {[['Quick Links', ['Home','Menu','Shop','Rewards','Admin Portal']], ['Shop', ['Cold Brew','Iced Latte','Frappuccino','Merch']], ['Support', ['FAQ','Track Order','Shipping','Returns']], ['Contact', ['+63 912 345 6789','hello@ayskeopi.com','Makati City, PH']]].map(([heading, links]) => (
            <div key={heading}>
              <p style={{ margin: '0 0 12px', fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c' }}>{heading}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {links.map(link => {
                  const onClick = link === 'Home' ? () => navigate('/')
                                : link === 'Menu' ? () => navigate('/coffee-menu')
                                : link === 'Rewards' ? () => navigate('/rewards')
                                : link === 'Admin Portal' ? () => navigate('/admin')
                                : undefined;
                  return <li key={link}>
                    <button
                      onClick={onClick}
                      style={{ background: 'none', border: 'none', padding: 0, fontSize: 10, color: '#5a5450', cursor: onClick ? 'pointer' : 'default', transition: 'color .2s' }}
                      onMouseEnter={e => { if (onClick) e.currentTarget.style.color = '#c9a84c' }}
                      onMouseLeave={e => { if (onClick) e.currentTarget.style.color = '#5a5450' }}
                    >
                      {link}
                    </button>
                  </li>
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <p style={{ margin: 0, fontSize: 9, color: '#3a3530' }}>© 2026 Ayskeopi Coffee. All rights reserved.</p>
          <p style={{ margin: 0, fontSize: 9, color: '#3a3530' }}>Premium Ice Coffee · Cold Brewed with Passion</p>
        </div>
      </footer>

      {/* Smooth Animations */}
      <style>{`
        .hero-float {
          animation: floatDrink 5s ease-in-out infinite;
        }
        @keyframes floatDrink {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </div>
  )
}

export default LandingPage
