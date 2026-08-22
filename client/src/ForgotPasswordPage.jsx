import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './components/Navbar'
import api from './api'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setMessage('')
    try {
      const { data } = await api.post('/auth/forgot-password', { email })
      setMessage(data.message)
    } catch (error) {
      setMessage(error.response?.data?.error || 'We could not process that request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0d0c0b', color: '#e8e2d8', fontFamily: "'Inter', sans-serif" }}>
      <Navbar onEnter={() => navigate('/')} onLogin={() => navigate('/login')} onRegister={() => navigate('/register')} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: '32px 16px' }}>
        <section style={{ width: '100%', maxWidth: 420, background: '#111009', border: '1px solid rgba(255,255,255,.08)', borderRadius: 20, padding: '40px 36px', boxShadow: '0 32px 64px rgba(0,0,0,.5)' }}>
          <p style={{ margin: '0 0 8px', fontSize: 10, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c9a84c' }}>Account Recovery</p>
          <h1 style={{ margin: '0 0 12px', fontSize: 28, fontWeight: 900, letterSpacing: '-0.03em' }}>Forgot password?</h1>
          <p style={{ margin: '0 0 28px', fontSize: 13, lineHeight: 1.8, color: '#7a736d' }}>Enter the email address used for your account and we'll send password reset instructions.</p>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, fontWeight: 600, color: '#b8b0a6' }}>
              Email address
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                placeholder="you@example.com"
                style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, padding: '11px 14px', fontSize: 13, color: '#e8e2d8', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,.6)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,.1)'}
              />
            </label>
            <button
              disabled={isSubmitting}
              style={{ background: '#c9a84c', color: '#000', border: 'none', borderRadius: 8, padding: '12px', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', cursor: 'pointer', opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? 'Sending…' : 'Send reset instructions'}
            </button>
          </form>
          {message && (
            <p role="status" style={{ marginTop: 16, background: 'rgba(201,168,76,.1)', border: '1px solid rgba(201,168,76,.2)', borderRadius: 8, padding: '12px 14px', fontSize: 12, lineHeight: 1.7, color: '#c9a84c' }}>
              {message}
            </p>
          )}
          <p style={{ marginTop: 20, fontSize: 12, color: '#5a5450' }}>
            <Link style={{ color: '#c9a84c', fontWeight: 600, textDecoration: 'none' }} to="/login">← Back to sign in</Link>
          </p>
        </section>
      </div>
    </main>
  )
}
