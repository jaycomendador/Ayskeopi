import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ── Hard-coded admin credentials ──────────────────────────────
// Email:    admin@ayskeopi.com
// Password: AyskeopiAdmin2026
const ADMIN_EMAIL    = 'admin@ayskeopi.com'
const ADMIN_PASSWORD = 'AyskeopiAdmin2026'
const ADMIN_PROFILE  = { name: 'Tony Robert', email: ADMIN_EMAIL, role: 'admin' }

/* ── Icons ── */
function CoffeeLogoIcon() {
  return (
    <div style={{ width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg,#10b981,#059669)', display: 'grid', placeItems: 'center', boxShadow: '0 0 28px rgba(16,185,129,.4)' }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 26, height: 26 }}>
        <path d="M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
        <line x1="6" y1="2" x2="6" y2="4" /><line x1="10" y1="2" x2="10" y2="4" /><line x1="14" y1="2" x2="14" y2="4" />
      </svg>
    </div>
  )
}
function LockIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
}
function MailIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
}
function EyeIcon({ hidden }) {
  return hidden
    ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}><path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 4.2A10.8 10.8 0 0 1 12 4c5 0 8.7 4.3 9.7 6.2a1.7 1.7 0 0 1 0 1.6 16 16 0 0 1-3 3.8M6.1 6.1A16 16 0 0 0 2.3 10.2a1.7 1.7 0 0 0 0 1.6C3.3 13.7 7 18 12 18c.8 0 1.6-.1 2.3-.4" /></svg>
    : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}><path d="M2.3 10.2C3.3 8.3 7 4 12 4s8.7 4.3 9.7 6.2a1.7 1.7 0 0 1 0 1.6C20.7 13.7 17 18 12 18s-8.7-4.3-9.7-6.2a1.7 1.7 0 0 1 0-1.6Z" /><circle cx="12" cy="11" r="3" /></svg>
}
function ArrowIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
}

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [showPwd, setShowPwd]     = useState(false)
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simulate brief latency for UX feel
    setTimeout(() => {
      if (
        email.trim().toLowerCase() === ADMIN_EMAIL &&
        password === ADMIN_PASSWORD
      ) {
        sessionStorage.setItem('ayskeopiAdmin', JSON.stringify(ADMIN_PROFILE))
        // Also store as the regular user so AdminLayout reads the name
        sessionStorage.setItem('ayskeopiUser', JSON.stringify(ADMIN_PROFILE))
        navigate('/admin')
      } else {
        setError('Invalid admin credentials. Please try again.')
        setLoading(false)
      }
    }, 480)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#071610',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Ambient glow blobs */}
      <div style={{ position: 'fixed', top: '15%', left: '20%', width: 360, height: 360, borderRadius: '50%', background: 'rgba(16,185,129,.07)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '20%', right: '15%', width: 280, height: 280, borderRadius: '50%', background: 'rgba(16,185,129,.04)', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <div style={{
        width: '100%',
        maxWidth: 420,
        background: '#0e1a15',
        border: '1px solid rgba(16,185,129,.12)',
        borderRadius: 24,
        overflow: 'hidden',
        boxShadow: '0 40px 80px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.02)',
        position: 'relative',
        zIndex: 1,
        animation: 'fadeSlideIn .35s cubic-bezier(.22,1,.36,1)',
      }}>
        {/* Emerald accent top bar */}
        <div style={{ height: 3, background: 'linear-gradient(90deg,#059669,#10b981,#34d399)' }} />

        <div style={{ padding: '40px 36px 36px' }}>
          {/* Brand header */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, marginBottom: 36, textAlign: 'center' }}>
            <CoffeeLogoIcon />
            <div>
              <p style={{ margin: 0, fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#10b981' }}>
                AYSKEOPI COFFEE
              </p>
              <h1 style={{ margin: '6px 0 4px', fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em' }}>
                Admin Portal
              </h1>
              <p style={{ margin: 0, fontSize: 12, color: '#4a675a' }}>
                Management Dashboard
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Email field */}
            <label style={{ display: 'flex', flexDirection: 'column', gap: 7, fontSize: 11, fontWeight: 600, color: '#4a675a', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Admin Email
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#4a675a', display: 'flex' }}>
                  <MailIcon />
                </span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@ayskeopi.com"
                  autoComplete="username"
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    background: 'rgba(255,255,255,.03)',
                    border: '1px solid rgba(16,185,129,.1)',
                    borderRadius: 10,
                    padding: '12px 14px 12px 38px',
                    fontSize: 13,
                    color: '#e8e2d8',
                    outline: 'none',
                    transition: 'border-color .2s',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(16,185,129,.1)'}
                />
              </div>
            </label>

            {/* Password field */}
            <label style={{ display: 'flex', flexDirection: 'column', gap: 7, fontSize: 11, fontWeight: 600, color: '#4a675a', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Password
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#4a675a', display: 'flex' }}>
                  <LockIcon />
                </span>
                <input
                  required
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••••••"
                  autoComplete="current-password"
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    background: 'rgba(255,255,255,.03)',
                    border: '1px solid rgba(16,185,129,.1)',
                    borderRadius: 10,
                    padding: '12px 40px 12px 38px',
                    fontSize: 13,
                    color: '#e8e2d8',
                    outline: 'none',
                    transition: 'border-color .2s',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(16,185,129,.1)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: 13,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#4a675a',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'color .2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#10b981'}
                  onMouseLeave={e => e.currentTarget.style.color = '#4a675a'}
                >
                  <EyeIcon hidden={showPwd} />
                </button>
              </div>
            </label>

            {/* Error message */}
            {error && (
              <div style={{
                background: 'rgba(239,68,68,.08)',
                border: '1px solid rgba(239,68,68,.2)',
                borderRadius: 8,
                padding: '9px 13px',
                fontSize: 12,
                color: '#f87171',
                lineHeight: 1.5,
              }}>
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                background: loading ? 'rgba(16,185,129,.4)' : '#10b981',
                color: '#000',
                border: 'none',
                borderRadius: 10,
                padding: '13px',
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: '0.05em',
                cursor: loading ? 'wait' : 'pointer',
                transition: 'background .2s, transform .1s',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#059669' }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#10b981' }}
              onMouseDown={e => { if (!loading) e.currentTarget.style.transform = 'scale(.98)' }}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {loading ? (
                <>
                  <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(0,0,0,.3)', borderTopColor: '#000', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
                  Authenticating…
                </>
              ) : (
                <>
                  Enter Admin Portal
                  <ArrowIcon />
                </>
              )}
            </button>
          </form>

          {/* Credentials Hint Card */}
          <div style={{
            marginTop: 24,
            background: 'rgba(16,185,129,.04)',
            border: '1px solid rgba(16,185,129,.08)',
            borderRadius: 10,
            padding: '14px 16px',
          }}>
            <p style={{ margin: '0 0 8px', fontSize: 10, fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Default Admin Credentials
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ color: '#4a675a', minWidth: 64 }}>Email:</span>
                <code style={{ color: '#10b981', fontFamily: 'monospace', fontSize: 11 }}>admin@ayskeopi.com</code>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ color: '#4a675a', minWidth: 64 }}>Password:</span>
                <code style={{ color: '#10b981', fontFamily: 'monospace', fontSize: 11 }}>AyskeopiAdmin2026</code>
              </div>
            </div>
          </div>

          {/* Back to Site Link */}
          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <button
              onClick={() => navigate('/')}
              style={{ background: 'none', border: 'none', fontSize: 11, color: '#4a675a', cursor: 'pointer', transition: 'color .2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#10b981'}
              onMouseLeave={e => e.currentTarget.style.color = '#4a675a'}
            >
              ← Back to Ayskeopi Coffee website
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(20px) scale(.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
