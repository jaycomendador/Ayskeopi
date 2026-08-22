import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import AuthModal from '../../components/AuthModal'
import CartModal from '../../components/CartModal'
import ProfileModal from '../../components/ProfileModal'
import LoginRequiredModal from '../../components/LoginRequiredModal'

function IconLocation() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22, color: '#c9a84c' }}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function IconClock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22, color: '#c9a84c' }}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22, color: '#c9a84c' }}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}

function IconPhone() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22, color: '#c9a84c' }}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 36, height: 36, color: '#c9a84c' }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export default function AyskeopiContactPage({ onHome, onLogin, onRegister, onMenu, onMatch, onRewards }) {
  const navigate = useNavigate()
  const [authModal, setAuthModal] = useState(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  // Form State
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('General Inquiry')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loginRequired, setLoginRequired] = useState(null)

  // User state
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ayskeopiUser'))
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
      setUser(JSON.parse(localStorage.getItem('ayskeopiUser')))
    } catch {}
  }
  const switchModal  = () => setAuthModal(m => m === 'login' ? 'register' : 'login')

  const goLogin    = onLogin    ?? openLogin
  const goRegister = onRegister ?? openRegister
  const goHome     = onHome     ?? (() => navigate('/'))
  const goMenu     = onMenu     ?? (() => navigate('/coffee-menu'))
  const goMatch    = onMatch    ?? (() => navigate('/coffee-match'))
  const goRewards  = onRewards  ?? (() => navigate('/rewards'))

  function handleSubmit(e) {
    e.preventDefault()
    if (!name || !email || !message) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 600)
  }

  function handleLogout() {
    localStorage.removeItem('ayskeopiUser')
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
            try { setUser(JSON.parse(localStorage.getItem('ayskeopiUser'))) } catch {}
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

      <Navbar
        onEnter={goHome}
        onLogin={goLogin}
        onRegister={goRegister}
        onMenu={goMenu}
        onMatch={goMatch}
        onRewards={goRewards}
        onContact={() => {}}
        user={user}
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '56px 40px 96px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <p style={{ margin: '0 0 8px', fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c9a84c' }}>Direct Support</p>
          <h1 style={{ margin: '0 0 12px', fontSize: 'clamp(1.8rem,3.8vw,2.8rem)', fontWeight: 900, letterSpacing: '-0.03em' }}>CONTACT US</h1>
          <p style={{ margin: '0 auto', maxWidth: 480, fontSize: 12, lineHeight: 1.7, color: '#7a736d' }}>
            Have a question about your order, beans, or custom catering? Reach out to our baristas and we’ll get back to you promptly.
          </p>
        </div>

        {/* 2 Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 32, alignItems: 'start' }}>
          {/* Left Info Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: '#161412', border: '1px solid rgba(255,255,255,.07)', borderRadius: 16, padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(201,168,76,.12)', border: '1px solid rgba(201,168,76,.3)', display: 'grid', placeItems: 'center' }}>
                  <IconLocation />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#e8e2d8' }}>Flagship Coffee Bar</h3>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: '#7a736d' }}>Makati City, Metro Manila, Philippines</p>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: 11, lineHeight: 1.6, color: '#9a938d' }}>
                Visit our brew bar for slow-dripped iced coffees, cold foam flights, and roasted beans.
              </p>
            </div>

            <div style={{ background: '#161412', border: '1px solid rgba(255,255,255,.07)', borderRadius: 16, padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(201,168,76,.12)', border: '1px solid rgba(201,168,76,.3)', display: 'grid', placeItems: 'center' }}>
                  <IconClock />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#e8e2d8' }}>Operating Hours</h3>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: '#7a736d' }}>Monday – Sunday: 7:00 AM – 10:00 PM</p>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: 11, lineHeight: 1.6, color: '#9a938d' }}>
                Orders placed online are queued immediately for barista pickup or local express dispatch.
              </p>
            </div>

            <div style={{ background: '#161412', border: '1px solid rgba(255,255,255,.07)', borderRadius: 16, padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(201,168,76,.12)', border: '1px solid rgba(201,168,76,.3)', display: 'grid', placeItems: 'center' }}>
                  <IconMail />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#e8e2d8' }}>Direct Inquiries</h3>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: '#7a736d' }}>hello@ayskeopi.com · +63 912 345 6789</p>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: 11, lineHeight: 1.6, color: '#9a938d' }}>
                For partnership, franchise, and catering queries, contact our management team directly.
              </p>
            </div>
          </div>

          {/* Right Form Card */}
          <div style={{ background: '#161412', border: '1px solid rgba(201,168,76,.25)', borderRadius: 18, padding: '32px 28px', boxShadow: '0 16px 40px rgba(0,0,0,.6)' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '36px 12px' }}>
                <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'rgba(201,168,76,.15)', border: '2px solid #c9a84c', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
                  <IconCheck />
                </div>
                <h3 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 900, color: '#e8e2d8' }}>Message Received!</h3>
                <p style={{ margin: '0 0 24px', fontSize: 12, lineHeight: 1.7, color: '#9a938d', maxWidth: 320, marginLeft: 'auto', marginRight: 'auto' }}>
                  Thank you, <strong style={{ color: '#c9a84c' }}>{name}</strong>! Your note has been dispatched to our coffee support team. We will email you at <span style={{ color: '#e8e2d8' }}>{email}</span> within 24 hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setMessage('') }}
                  style={{ background: '#c9a84c', color: '#000', border: 'none', borderRadius: 6, padding: '11px 24px', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}
                >
                  SEND ANOTHER NOTE
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c' }}>SEND A MESSAGE</span>
                <h2 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 900, color: '#e8e2d8' }}>How Can We Help You?</h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#9a938d', marginBottom: 5 }}>Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      style={{ width: '100%', boxSizing: 'border-box', background: '#0d0c0b', border: '1px solid rgba(255,255,255,.12)', borderRadius: 6, padding: '10px 12px', fontSize: 11, color: '#fff', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#9a938d', marginBottom: 5 }}>Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      style={{ width: '100%', boxSizing: 'border-box', background: '#0d0c0b', border: '1px solid rgba(255,255,255,.12)', borderRadius: 6, padding: '10px 12px', fontSize: 11, color: '#fff', outline: 'none' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#9a938d', marginBottom: 5 }}>Subject / Topic</label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', background: '#0d0c0b', border: '1px solid rgba(255,255,255,.12)', borderRadius: 6, padding: '10px 12px', fontSize: 11, color: '#fff', outline: 'none' }}
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Order & Delivery Support">Order &amp; Delivery Support</option>
                    <option value="Bulk & Catering Order">Bulk &amp; Catering Order</option>
                    <option value="Rewards & Loyalty Points">Rewards &amp; Loyalty Points</option>
                    <option value="Feedback & Suggestions">Feedback &amp; Suggestions</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#9a938d', marginBottom: 5 }}>Your Message</label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Tell us what's on your mind or how we can improve your cold coffee experience..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', background: '#0d0c0b', border: '1px solid rgba(255,255,255,.12)', borderRadius: 6, padding: '10px 12px', fontSize: 11, color: '#fff', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    marginTop: 8,
                    background: '#c9a84c',
                    color: '#000',
                    border: 'none',
                    borderRadius: 6,
                    padding: '12px',
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    cursor: 'pointer',
                    transition: 'background .2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#e2bd60'}
                  onMouseLeave={e => e.currentTarget.style.background = '#c9a84c'}
                >
                  {loading ? 'TRANSMITTING MESSAGE...' : 'SEND MESSAGE'}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
