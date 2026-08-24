import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'

/* ── Icons ── */
function SearchIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
}
function DashboardIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
}
function ProductsIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}><path d="m7.5 4.27 9 5.15M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.27 6.96 8.73 5 8.73-5M12 22.08V12" /></svg>
}
function OrdersIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18M16 10a4 4 0 0 1-8 0" /></svg>
}
function CustomerIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
}
function ChatIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
}
function EmailIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
}
function AnalyticsIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}><path d="M3 3v18h18M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" /></svg>
}
function IntegrationIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
}
function PerformanceIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
}
function HelpIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" /></svg>
}
function SettingsIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
}
function LogoutIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>
}
function InfoIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
}
function BellIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
}
function ExportIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
}

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Read current admin user from storage, or fallback to Tony
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem('ayskeopiUser')
      return stored ? JSON.parse(stored) : { name: 'Tony Robert', email: 'tony@vizora.com' }
    } catch {
      return { name: 'Tony Robert', email: 'tony@vizora.com' }
    }
  })

  function handleLogout() {
    sessionStorage.removeItem('ayskeopiUser')
    sessionStorage.removeItem('ayskeopiAdmin')
    navigate('/admin/login')
  }

  const menuItems = [
    { label: 'Dashboard', path: '/admin', icon: <DashboardIcon /> },
    { label: 'Products', path: '/admin/products', icon: <ProductsIcon /> },
    { label: 'Order', path: '/admin/orders', icon: <OrdersIcon /> },
    { label: 'Customer', path: '/admin/customers', icon: <CustomerIcon /> },
    { label: 'Feedback', path: '/admin/feedback', icon: <ChatIcon />, badge: '10' },
  ]

  const otherItems = [
    { label: 'Email', path: '#', icon: <EmailIcon /> },
    { label: 'Analytics', path: '#', icon: <AnalyticsIcon /> },
    { label: 'Integration', path: '#', icon: <IntegrationIcon /> },
    { label: 'Performance', path: '#', icon: <PerformanceIcon /> },
  ]

  const accountItems = [
    { label: 'Help Center', path: '#', icon: <HelpIcon /> },
    { label: 'Settings', path: '#', icon: <SettingsIcon /> },
  ]

  const activePath = location.pathname

  // Visual Title based on path
  const getPageTitle = () => {
    if (activePath === '/admin') return 'Dashboard'
    if (activePath.includes('/products')) return 'Products'
    if (activePath.includes('/orders')) return 'Orders'
    if (activePath.includes('/customers')) return 'Customers'
    if (activePath.includes('/feedback')) return 'Feedback & Chat'
    return 'Admin Portal'
  }

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px 20px', gap: 24 }}>
      {/* Brand logo */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#e8e2d8' }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: '#10b981', display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 900, color: '#fff' }}>
            V
          </div>
          <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>Vizora</span>
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden"
          style={{ background: 'none', border: 'none', color: '#9a938d', cursor: 'pointer', fontSize: 20 }}
        >
          &times;
        </button>
      </div>

      {/* Search box */}
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#526b60', display: 'flex', alignItems: 'center' }}>
          <SearchIcon />
        </span>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ width: '100%', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 10, padding: '9px 12px 9px 34px', fontSize: 12, color: '#fff', outline: 'none' }}
        />
        <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 9, background: 'rgba(255,255,255,.08)', color: '#9a938d', padding: '2px 5px', borderRadius: 4, letterSpacing: '0.05em', border: '1px solid rgba(255,255,255,.05)' }}>
          &#8984; F
        </span>
      </div>

      {/* Navigation Groups */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, flex: 1, overflowY: 'auto' }}>
        {/* Main Menu */}
        <div>
          <p style={{ margin: '0 0 8px', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4a675a' }}>Main Menu</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {menuItems.map(item => {
              const active = item.path === activePath
              return (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 12px',
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 500,
                      color: active ? '#10b981' : '#9a938d',
                      background: active ? 'rgba(16,185,129,.06)' : 'none',
                      border: active ? '1px solid rgba(16,185,129,.15)' : '1px solid transparent',
                      textDecoration: 'none',
                      transition: 'all .2s',
                    }}
                    onMouseEnter={e => {
                      if (!active) {
                        e.currentTarget.style.color = '#fff'
                        e.currentTarget.style.background = 'rgba(255,255,255,.02)'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!active) {
                        e.currentTarget.style.color = '#9a938d'
                        e.currentTarget.style.background = 'none'
                      }
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', color: active ? '#10b981' : '#6b7f75' }}>{item.icon}</span>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge && (
                      <span style={{ fontSize: 9, fontWeight: 700, background: '#111009', border: '1px solid rgba(255,255,255,.08)', color: '#10b981', padding: '2px 6px', borderRadius: 20 }}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Other */}
        <div>
          <p style={{ margin: '0 0 8px', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4a675a' }}>Other</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {otherItems.map(item => (
              <li key={item.label}>
                <a
                  href={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 12px',
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 500,
                    color: '#9a938d',
                    textDecoration: 'none',
                    transition: 'all .2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = '#fff'
                    e.currentTarget.style.background = 'rgba(255,255,255,.02)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = '#9a938d'
                    e.currentTarget.style.background = 'none'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', color: '#6b7f75' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Account */}
        <div>
          <p style={{ margin: '0 0 8px', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4a675a' }}>Account</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {accountItems.map(item => (
              <li key={item.label}>
                <a
                  href={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 12px',
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 500,
                    color: '#9a938d',
                    textDecoration: 'none',
                    transition: 'all .2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = '#fff'
                    e.currentTarget.style.background = 'rgba(255,255,255,.02)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = '#9a938d'
                    e.currentTarget.style.background = 'none'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', color: '#6b7f75' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* User details profile block */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,.06)', paddingTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 800 }}>
          {(adminUser.name || 'T')[0].toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{adminUser.name || 'Tony Robert'}</p>
          <p style={{ margin: 0, fontSize: 10, color: '#526b60', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{adminUser.email || 'tony@vizora.com'}</p>
        </div>
        <button
          onClick={handleLogout}
          title="Sign out from Admin Panel"
          style={{ background: 'none', border: 'none', color: '#9a938d', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'color .2s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
          onMouseLeave={e => e.currentTarget.style.color = '#9a938d'}
        >
          <LogoutIcon />
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0e1210', color: '#e8e2d8', fontFamily: "'Inter', sans-serif" }}>
      {/* ── Desktop Sidebar ── */}
      <aside style={{ width: 260, background: '#071610', borderRight: '1px solid rgba(255,255,255,.05)', display: 'flex', flexDirection: 'column', flexShrink: 0 }} className="hidden md:flex">
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar Drawer ── */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(3px)', display: 'flex' }}
          className="md:hidden"
        >
          <aside
            onClick={e => e.stopPropagation()}
            style={{ width: 270, height: '100%', background: '#071610', borderRight: '1px solid rgba(255,255,255,.05)' }}
          >
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* ── Main Content Container ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Header bar */}
        <header style={{ height: 72, background: 'rgba(14,18,16,.75)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', zIndex: 900, position: 'sticky', top: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden"
              style={{ background: 'none', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, padding: '7px 9px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              ☰
            </button>
            <div>
              <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>{getPageTitle()}</h1>
              <p style={{ margin: '2px 0 0', fontSize: 11, color: '#687e74' }}>Welcome back, {adminUser.name?.split(' ')[0] || 'Tony'}</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Avatars */}
            <div style={{ display: 'flex', alignItems: 'center' }} className="hidden sm:flex">
              {['/menu/01_Vanilla_Bean_Cold_Brew.png', '/menu/02_Pistachio_Cream_Cold_Coffee.png', '/menu/03_Salted_Caramel_Frappe.png'].map((src, i) => (
                <div
                  key={i}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    border: '2px solid #0e1210',
                    marginLeft: i > 0 ? -8 : 0,
                    overflow: 'hidden',
                    background: '#222',
                  }}
                >
                  <img src={src} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
              <button style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid #0e1210', background: 'rgba(255,255,255,.05)', marginLeft: -8, display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700, color: '#9a938d', cursor: 'pointer' }}>
                +
              </button>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button title="System Information" style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.05)', display: 'grid', placeItems: 'center', color: '#9a938d', cursor: 'pointer', transition: 'all .2s' }} onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.15)' }} onMouseLeave={e => { e.currentTarget.style.color = '#9a938d'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.05)' }}>
                <InfoIcon />
              </button>
              <button title="Notifications" style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.05)', display: 'grid', placeItems: 'center', color: '#9a938d', cursor: 'pointer', transition: 'all .2s', position: 'relative' }} onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.15)' }} onMouseLeave={e => { e.currentTarget.style.color = '#9a938d'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.05)' }}>
                <BellIcon />
                <span style={{ position: 'absolute', top: 10, right: 11, width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} />
              </button>
            </div>

            {/* Export CTA */}
            <button
              onClick={() => alert('Exporting dashboard report... (CSV)')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: '#0c2e22',
                border: '1px solid rgba(16,185,129,.2)',
                borderRadius: 10,
                padding: '9px 16px',
                fontSize: 12,
                fontWeight: 600,
                color: '#10b981',
                cursor: 'pointer',
                transition: 'all .2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#10b981'; e.currentTarget.style.color = '#000' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#0c2e22'; e.currentTarget.style.color = '#10b981' }}
            >
              <ExportIcon />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </header>

        {/* Content Outlet */}
        <main style={{ flex: 1, padding: 24, overflowY: 'auto' }} className="coffee-menu-enter">
          <Outlet />
        </main>
      </div>

      {/* Desktop utilities override styles */}
      <style>{`
        @media (max-width: 767px) {
          .hidden-mobile { display: none !important; }
        }
      `}</style>
    </div>
  )
}
