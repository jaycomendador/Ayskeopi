import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function HamburgerIcon({ open }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 20, height: 20 }}>
      <path d={open ? 'm6 6 12 12M18 6 6 18' : 'M4 7h16M4 12h16M4 17h16'} />
    </svg>
  )
}

function Navbar({ onEnter, onLogin, onRegister, onMenu, onMatch, onRewards, onContact, user, cartCount = 0, onOpenCart, onOpenProfile, hidePoints }) {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const isRewardsPage = hidePoints || (typeof window !== 'undefined' && window.location.pathname === '/rewards')

  const home     = onEnter    ?? (() => navigate('/'))
  const login    = onLogin    ?? (() => navigate('/login'))
  const register = onRegister ?? (() => navigate('/register'))
  const menu     = onMenu     ?? (() => navigate('/coffee-menu'))
  const match    = onMatch    ?? (() => navigate('/coffee-match'))
  const rewards  = onRewards  ?? (() => navigate('/rewards'))
  const contact  = onContact  ?? (() => navigate('/contact'))
  const go = (action) => { setIsOpen(false); action?.() }

  const NAV_LINKS = [
    { label: 'HOME',    action: home },
    { label: 'MENU',    action: menu },
    { label: 'REWARDS', action: rewards },
    { label: 'CONTACT', action: contact },
  ]

  const s = {
    header: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      width: '100%',
      background: '#0d0c0b',
      borderBottom: '1px solid rgba(255,255,255,.08)',
    },
    nav: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      height: 64,
      maxWidth: 1200,
      margin: '0 auto',
      padding: '0 40px',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      color: '#e8e2d8',
    },
    logoDot: {
      width: 32,
      height: 32,
      borderRadius: '50%',
      background: '#c9a84c',
      display: 'grid',
      placeItems: 'center',
      fontSize: 13,
      fontWeight: 900,
      color: '#000',
      flexShrink: 0,
    },
    logoText: {
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: '0.14em',
      color: '#e8e2d8',
    },
    centerLinks: {
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      alignItems: 'center',
      gap: 32,
    },
    navLink: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '4px 0',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.1em',
      color: '#9a938d',
      transition: 'color .2s',
      position: 'relative',
    },
    rightGroup: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    },
    iconBtn: {
      position: 'relative',
      background: 'none',
      border: '1px solid rgba(255,255,255,.12)',
      borderRadius: '50%',
      width: 36,
      height: 36,
      display: 'grid',
      placeItems: 'center',
      cursor: 'pointer',
      color: '#9a938d',
      transition: 'border-color .2s, color .2s',
    },
    userBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: 'rgba(255,255,255,.05)',
      border: '1px solid rgba(201,168,76,.3)',
      borderRadius: 20,
      padding: '4px 12px 4px 6px',
      cursor: 'pointer',
      color: '#e8e2d8',
      transition: 'border-color .2s',
    },
    avatar: {
      width: 26,
      height: 26,
      borderRadius: '50%',
      background: '#c9a84c',
      color: '#000',
      display: 'grid',
      placeItems: 'center',
      fontSize: 11,
      fontWeight: 800,
    },
    orderBtn: {
      background: '#c9a84c',
      color: '#000',
      border: 'none',
      borderRadius: 6,
      padding: '9px 20px',
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.1em',
      cursor: 'pointer',
      transition: 'background .2s',
    },
    cartBadge: {
      position: 'absolute',
      top: -4,
      right: -4,
      background: '#c9a84c',
      color: '#000',
      borderRadius: '50%',
      width: 18,
      height: 18,
      fontSize: 10,
      fontWeight: 800,
      display: 'grid',
      placeItems: 'center',
      boxShadow: '0 2px 6px rgba(0,0,0,.6)',
    },
    hamburger: {
      marginLeft: 'auto',
      background: 'none',
      border: '1px solid rgba(255,255,255,.12)',
      borderRadius: 6,
      width: 36,
      height: 36,
      display: 'grid',
      placeItems: 'center',
      cursor: 'pointer',
      color: '#e8e2d8',
    },
    mobileMenu: {
      borderTop: '1px solid rgba(255,255,255,.08)',
      background: '#111009',
      padding: '12px 40px 20px',
    },
    mobileLinkBtn: {
      display: 'block',
      width: '100%',
      background: 'none',
      border: 'none',
      padding: '10px 0',
      textAlign: 'left',
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '0.1em',
      color: '#9a938d',
      cursor: 'pointer',
    },
    mobileDivider: {
      borderTop: '1px solid rgba(255,255,255,.08)',
      margin: '8px 0',
    },
    mobileOrderBtn: {
      marginTop: 8,
      width: '100%',
      background: '#c9a84c',
      color: '#000',
      border: 'none',
      borderRadius: 6,
      padding: '11px 0',
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.1em',
      cursor: 'pointer',
    },
  }

  return (
    <header style={s.header}>
      <nav style={s.nav}>

        {/* Logo */}
        <button onClick={() => go(home)} style={s.logo}>
          <img
            src="/logo.png"
            alt="Ayskeopi"
            style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid rgba(201,168,76,0.5)', flexShrink: 0 }}
          />
          <span style={s.logoText}>AYSKEOPI</span>
        </button>

        {/* Desktop center links */}
        <div id="nav-desktop-links" style={{ ...s.centerLinks, display: 'flex' }} className="nav-desktop-links">
          {NAV_LINKS.map(({ label, action }) => (
            <button
              key={label}
              onClick={() => go(action)}
              style={s.navLink}
              onMouseEnter={e => e.currentTarget.style.color = '#c9a84c'}
              onMouseLeave={e => e.currentTarget.style.color = '#9a938d'}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Desktop right group */}
        <div id="nav-desktop-right" style={s.rightGroup} className="nav-desktop-right">
          {/* User Button — only first letter */}
          {user ? (
            <button
              onClick={onOpenProfile}
              title={`Profile: ${user.name}`}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'rgba(201,168,76,.15)',
                border: '1px solid rgba(201,168,76,.5)',
                color: '#c9a84c',
                display: 'grid',
                placeItems: 'center',
                fontSize: 13,
                fontWeight: 900,
                cursor: 'pointer',
                transition: 'all .2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#c9a84c'; e.currentTarget.style.color = '#000'; e.currentTarget.style.borderColor = '#c9a84c' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(201,168,76,.15)'; e.currentTarget.style.color = '#c9a84c'; e.currentTarget.style.borderColor = 'rgba(201,168,76,.5)' }}
            >
              {(user.name || 'U')[0].toUpperCase()}
            </button>
          ) : (
            <button
              onClick={() => go(login)}
              style={s.iconBtn}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,.5)'; e.currentTarget.style.color = '#c9a84c' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.12)'; e.currentTarget.style.color = '#9a938d' }}
            >
              <UserIcon />
            </button>
          )}

          {/* Cart Button with Live Counter Badge */}
          <button
            onClick={onOpenCart}
            style={s.iconBtn}
            aria-label="View Cart"
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,.5)'; e.currentTarget.style.color = '#c9a84c' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.12)'; e.currentTarget.style.color = '#9a938d' }}
          >
            <CartIcon />
            {cartCount > 0 && (
              <span style={s.cartBadge}>{cartCount}</span>
            )}
          </button>

          {/* Order / Menu CTA */}
          <button
            onClick={() => go(menu)}
            style={s.orderBtn}
            onMouseEnter={e => e.currentTarget.style.background = '#e2bd60'}
            onMouseLeave={e => e.currentTarget.style.background = '#c9a84c'}
          >
            ORDER NOW
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setIsOpen(o => !o)}
          aria-label="Toggle menu"
          style={s.hamburger}
          className="nav-hamburger"
        >
          <HamburgerIcon open={isOpen} />
        </button>
      </nav>

      {/* Mobile dropdown */}
      {isOpen && (
        <div style={s.mobileMenu}>
          {NAV_LINKS.map(({ label, action }) => (
            <button key={label} onClick={() => go(action)} style={s.mobileLinkBtn}>{label}</button>
          ))}
          <div style={s.mobileDivider} />
          {user ? (
            <>
              <button onClick={() => { setIsOpen(false); onOpenProfile?.() }} style={{ ...s.mobileLinkBtn, color: '#c9a84c', fontWeight: 700 }}>
                PROFILE: {user.name}
              </button>
              <button onClick={() => { setIsOpen(false); onOpenCart?.() }} style={{ ...s.mobileLinkBtn, color: '#e8e2d8' }}>
                CART ({cartCount})
              </button>
            </>
          ) : (
            <button onClick={() => go(login)} style={{ ...s.mobileLinkBtn, color: '#e8e2d8' }}>LOGIN / REGISTER</button>
          )}
          <button onClick={() => go(menu)} style={s.mobileOrderBtn}>ORDER NOW</button>
        </div>
      )}

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 767px) {
          .nav-desktop-links { display: none !important; }
          .nav-desktop-right { display: none !important; }
          .nav-hamburger { display: grid !important; }
        }
        @media (min-width: 768px) {
          .nav-hamburger { display: none !important; }
        }
      `}</style>
    </header>
  )
}

export default Navbar
