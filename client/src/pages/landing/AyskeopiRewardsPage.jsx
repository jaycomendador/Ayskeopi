import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import AuthModal from '../../components/AuthModal'
import CartModal from '../../components/CartModal'
import ProfileModal from '../../components/ProfileModal'
import ContactModal from '../../components/ContactModal'
import LoginRequiredModal from '../../components/LoginRequiredModal'
import api from '../../api'

/* ─── SVG Icons ────────────────────────────────────────────── */
function IconCoin() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14, color: '#c9a84c', display: 'inline-block', verticalAlign: 'middle' }}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6v12M15 9.5a2.5 2.5 0 0 0-5 0c0 3 5 2 5 5a2.5 2.5 0 0 1-5 0" />
    </svg>
  )
}

function IconBigCoin() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28, color: '#c9a84c' }}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6v12M15 9.5a2.5 2.5 0 0 0-5 0c0 3 5 2 5 5a2.5 2.5 0 0 1-5 0" />
    </svg>
  )
}

function IconGift() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 26, height: 26, color: '#c9a84c' }}>
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect x="2" y="7" width="20" height="5" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  )
}

const REWARD_COFFEES = [
  { id: 1, name: 'Vanilla Bean Cold Brew', pointsCost: 50, img: '/menu/01_Vanilla_Bean_Cold_Brew.png', desc: 'Slow-steeped cold brew with vanilla cream.' },
  { id: 10, name: 'Cardamom Spice Cold Brew', pointsCost: 50, img: '/menu/10_Cardamom_Spice_Cold_Brew.png', desc: 'Aromatic crushed cardamom and subtle spices.' },
  { id: 6, name: 'Toasted Coconut Cold Brew', pointsCost: 60, img: '/menu/06_Toasted_Coconut_Cold_Brew.png', desc: 'Toasted coconut flakes & coconut cold foam.' },
  { id: 8, name: 'Cinnamon Dolce Iced Coffee', pointsCost: 60, img: '/menu/08_Cinnamon_Dolce_Iced_Coffee.png', desc: 'Sweet cinnamon brown sugar & bold espresso.' },
  { id: 5, name: 'Mocha Crunch Iced Coffee', pointsCost: 70, img: '/menu/05_Mocha_Crunch_Iced_Coffee.png', desc: 'Dark chocolate mocha & cookie crumble crunch.' },
  { id: 7, name: 'Lavender Honey Iced Latte', pointsCost: 70, img: '/menu/07_Lavender_Honey_Iced_Latte.png', desc: 'French lavender, wild honey & chilled milk.' },
  { id: 9, name: 'Maple Pecan Iced Latte', pointsCost: 70, img: '/menu/09_Maple_Pecan_Iced_Latte.png', desc: 'Roasted pecan notes & pure maple syrup.' },
  { id: 2, name: 'Pistachio Cream Iced Coffee', pointsCost: 80, img: '/menu/02_Pistachio_Cream_Cold_Coffee.png', desc: 'Silky pistachio cold foam & chilled espresso.' },
  { id: 4, name: 'Brown Sugar Oat Milk Shaken Espresso', pointsCost: 80, img: '/menu/04_Brown_Sugar_Oat_Milk_Shaken_Espresso.png', desc: 'Shaken blonde espresso & creamy oat milk.' },
  { id: 3, name: 'Salted Caramel Frappé', pointsCost: 90, img: '/menu/03_Salted_Caramel_Frappe.png', desc: 'Blended iced coffee with salted caramel drizzle.' },
]

export default function AyskeopiRewardsPage({ onHome, onLogin, onRegister, onMenu, onMatch, onRewards }) {
  const navigate = useNavigate()
  const [authModal, setAuthModal] = useState(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [redeemedDrink, setRedeemedDrink] = useState(null)
  const [isRedeeming, setIsRedeeming] = useState(false)
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
  const goMenu     = onMenu     ?? (() => navigate('/coffee-menu'))
  const goMatch    = onMatch    ?? (() => navigate('/coffee-match'))

  const currentPoints = user ? (user.loyaltyPoints ?? (user.passportStamps ? user.passportStamps * 10 : 0)) : 0

  async function handleRedeem(coffee) {
    if (!user) {
      setLoginRequired('rewards')
      return
    }

    if (currentPoints < coffee.pointsCost) {
      alert(`You need ${coffee.pointsCost - currentPoints} more points to redeem this coffee. (1 Coffee = 10 points)`)
      return
    }

    setIsRedeeming(true)
    try {
      await api.post('/orders', {
        user: user.id || user._id,
        drink: `${coffee.name} (Rewards Free Drink)`,
        customizations: { size: 'Medium', milk: 'Oat milk', extraShot: false, syrup: 'Points Reward' },
        total: 0,
      })

      const updatedPoints = Math.max(0, currentPoints - coffee.pointsCost)
      const updatedUser = { ...user, loyaltyPoints: updatedPoints }
      setUser(updatedUser)
      sessionStorage.setItem('ayskeopiUser', JSON.stringify(updatedUser))

      setRedeemedDrink(coffee)
    } catch (err) {
      console.error(err)
    } finally {
      setIsRedeeming(false)
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('ayskeopiUser')
    localStorage.removeItem('ayskeopiCart_guest')
    setUser(null)
    setCart([])
  }

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
          onUpdateQty={(id, q) => setCart(p => q <= 0 ? p.filter(i => i.cartId !== id) : p.map(i => i.cartId === id ? { ...i, qty: q } : i))}
          onRemoveItem={id => setCart(p => p.filter(i => i.cartId !== id))}
          onClearCart={() => setCart([])}
          onRequireAuth={() => setLoginRequired('cart')}
          onOrderSuccess={() => {
            try { setUser(JSON.parse(sessionStorage.getItem('ayskeopiUser'))) } catch {}
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

      {/* Redemption Success Modal */}
      {redeemedDrink && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(0,0,0,.82)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#111009', border: '1px solid #c9a84c', borderRadius: 18, maxWidth: 400, width: '100%', padding: '28px 24px', textAlign: 'center', boxShadow: '0 30px 80px rgba(0,0,0,.9)' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(201,168,76,.15)', border: '2px solid #c9a84c', display: 'grid', placeItems: 'center', margin: '0 auto 12px' }}>
              <IconGift />
            </div>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#c9a84c' }}>POINTS REDEEMED</span>
            <h3 style={{ margin: '6px 0 8px', fontSize: 18, fontWeight: 900, color: '#e8e2d8' }}>Free Drink Unlocked!</h3>
            <p style={{ margin: '0 0 16px', fontSize: 12, lineHeight: 1.6, color: '#9a938d' }}>
              You redeemed <strong style={{ color: '#c9a84c' }}>{redeemedDrink.name}</strong> for {redeemedDrink.pointsCost} points. Your free drink has been sent to our barista queue!
            </p>
            <div style={{ background: '#161412', border: '1px solid rgba(255,255,255,.08)', borderRadius: 10, padding: '10px', marginBottom: 20 }}>
              <p style={{ margin: 0, fontSize: 11, color: '#e8d080', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <IconCoin /> Remaining Balance: {currentPoints} PTS
              </p>
            </div>
            <button
              onClick={() => setRedeemedDrink(null)}
              style={{ width: '100%', background: '#c9a84c', color: '#000', border: 'none', borderRadius: 6, padding: '11px', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}
            >
              DONE
            </button>
          </div>
        </div>
      )}

      {isContactOpen && (
        <ContactModal onClose={() => setIsContactOpen(false)} />
      )}

      {/* Navbar without Points badge on rewards page */}
      <Navbar
        onEnter={goHome}
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
        hidePoints={true}
      />

      <main className="page-inner">
        {/* Header & Explanation */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <p style={{ margin: '0 0 8px', fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c9a84c' }}>Loyalty Points Program</p>
          <h1 style={{ margin: '0 0 12px', fontSize: 'clamp(1.8rem,3.8vw,2.8rem)', fontWeight: 900, letterSpacing: '-0.03em' }}>
            REWARDS MENU
          </h1>
          <p style={{ margin: '0 auto', maxWidth: 460, fontSize: 12, lineHeight: 1.7, color: '#7a736d' }}>
            Earn <strong style={{ color: '#c9a84c' }}>10 Points</strong> on every coffee you purchase. Redeem your points below for free handcrafted iced coffees!
          </p>
        </div>

        {/* User Balance Banner */}
        <div style={{
          position: 'relative',
          background: 'linear-gradient(135deg,#251a0e,#161009)',
          border: '1px solid rgba(201,168,76,.35)',
          borderRadius: 18,
          padding: '24px 30px',
          marginBottom: 36,
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          alignItems: 'center',
          gap: 24,
          overflow: 'hidden',
          boxShadow: '0 16px 40px rgba(0,0,0,.5)',
        }} className="rewards-banner">
          <div>
            <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c' }}>
              YOUR REWARDS PASSPORT
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
              <IconBigCoin />
              <h2 style={{ margin: 0, fontSize: 28, fontWeight: 900, color: '#c9a84c' }}>
                {currentPoints} <span style={{ fontSize: 14, color: '#e8e2d8' }}>Points</span>
              </h2>
            </div>
            <p style={{ margin: '6px 0 18px', fontSize: 11, color: '#9a938d', maxWidth: 360, lineHeight: 1.6 }}>
              {user ? `Welcome back, ${user.name}! Every coffee ordered adds +10 pts directly to your balance.` : 'Sign in to track your points and redeem free iced coffees.'}
            </p>

            <div style={{ display: 'flex', gap: 10 }}>
              {!user ? (
                <button
                  onClick={openLogin}
                  style={{ background: '#c9a84c', color: '#000', border: 'none', borderRadius: 6, padding: '10px 18px', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}
                >
                  SIGN IN / REGISTER
                </button>
              ) : (
                <button
                  onClick={goMenu}
                  style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.15)', color: '#c9a84c', borderRadius: 6, padding: '9px 16px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                >
                  BUY COFFEE (+10 pts) →
                </button>
              )}
            </div>
          </div>

          {/* Right Visual Image with Float Animation */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="reward-float" style={{ position: 'relative', width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,.3) 0%, transparent 70%)', display: 'grid', placeItems: 'center' }}>
              <img
                src="/menu/02_Pistachio_Cream_Cold_Coffee.png"
                alt="Free Reward Coffee"
                style={{ width: 115, height: 115, objectFit: 'cover', borderRadius: '50%', border: '2px solid rgba(201,168,76,.6)', boxShadow: '0 12px 30px rgba(0,0,0,.7)' }}
              />
              <span style={{ position: 'absolute', bottom: 4, right: 6, background: '#c9a84c', color: '#000', fontSize: 8, fontWeight: 900, borderRadius: 10, padding: '2px 8px', letterSpacing: '0.04em' }}>
                FREE REWARD
              </span>
            </div>
          </div>
        </div>

        {/* Rewards Menu Grid */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }} className="rewards-points-bar">
            <div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#e8e2d8' }}>Redeem with Points</h3>
              <p style={{ margin: '2px 0 0', fontSize: 11, color: '#7a736d' }}>Select a drink below to purchase using your points</p>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#c9a84c', background: 'rgba(201,168,76,.1)', border: '1px solid rgba(201,168,76,.3)', borderRadius: 16, padding: '3px 10px' }}>
              1 Coffee = 10 pts
            </span>
          </div>

          <div className="rewards-grid" style={{ gap: 16 }}>
            {REWARD_COFFEES.map((coffee) => {
              const canAfford = user && currentPoints >= coffee.pointsCost
              return (
                <div
                  key={coffee.id}
                  style={{
                    position: 'relative',
                    background: '#161412',
                    borderRadius: 16,
                    border: canAfford ? '1px solid rgba(201,168,76,.4)' : '1px solid rgba(255,255,255,.08)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform .2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                >
                  {/* Points Badge */}
                  <span style={{
                    position: 'absolute', top: 10, right: 10, zIndex: 2,
                    background: '#c9a84c', color: '#000',
                    fontSize: 9, fontWeight: 900, letterSpacing: '0.04em',
                    borderRadius: 6, padding: '3px 8px',
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                    <IconCoin /> {coffee.pointsCost} PTS
                  </span>

                  <div style={{ width: '100%', height: 180, overflow: 'hidden', background: '#e3d7c9' }}>
                    <img
                      src={coffee.img}
                      alt={coffee.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>

                  <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ display: 'inline-block', fontSize: 8, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c9a84c', border: '1px solid rgba(201,168,76,.35)', borderRadius: 3, padding: '1px 5px', marginBottom: 5 }}>
                        REWARD DRINK
                      </span>
                      <h4 style={{ margin: '0 0 3px', fontSize: 12, fontWeight: 700, color: '#e8e2d8', lineHeight: 1.35 }}>
                        {coffee.name}
                      </h4>
                      <p style={{ margin: 0, fontSize: 10, lineHeight: 1.45, color: '#7a736d' }}>
                        {coffee.desc}
                      </p>
                    </div>

                    <div style={{ marginTop: 14 }}>
                      {user ? (
                        canAfford ? (
                          <button
                            disabled={isRedeeming}
                            onClick={() => handleRedeem(coffee)}
                            style={{
                              width: '100%',
                              background: '#c9a84c',
                              color: '#000',
                              border: 'none',
                              borderRadius: 6,
                              padding: '8px 0',
                              fontSize: 10,
                              fontWeight: 800,
                              letterSpacing: '0.04em',
                              cursor: 'pointer',
                              transition: 'background .2s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#e2bd60'}
                            onMouseLeave={e => e.currentTarget.style.background = '#c9a84c'}
                          >
                            REDEEM WITH POINTS
                          </button>
                        ) : (
                          <button
                            disabled
                            style={{
                              width: '100%',
                              background: 'rgba(255,255,255,.04)',
                              border: '1px solid rgba(255,255,255,.08)',
                              color: '#6a635d',
                              borderRadius: 6,
                              padding: '8px 0',
                              fontSize: 10,
                              fontWeight: 700,
                              cursor: 'not-allowed',
                            }}
                          >
                            Need {coffee.pointsCost - currentPoints} more pts
                          </button>
                        )
                      ) : (
                        <button
                          onClick={openLogin}
                          style={{
                            width: '100%',
                            background: 'rgba(201,168,76,.12)',
                            border: '1px solid rgba(201,168,76,.3)',
                            color: '#c9a84c',
                            borderRadius: 6,
                            padding: '8px 0',
                            fontSize: 10,
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Sign in to Redeem
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>

      {/* Smooth Animations */}
      <style>{`
        .reward-float {
          animation: floatReward 5s ease-in-out infinite;
        }
        @keyframes floatReward {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-6px) rotate(2deg);
          }
        }
      `}</style>
    </div>
  )
}
