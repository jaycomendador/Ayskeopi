import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

function EyeIcon({ hidden }) {
  return hidden
    ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}><path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 4.2A10.8 10.8 0 0 1 12 4c5 0 8.7 4.3 9.7 6.2a1.7 1.7 0 0 1 0 1.6 16 16 0 0 1-3 3.8M6.1 6.1A16 16 0 0 0 2.3 10.2a1.7 1.7 0 0 0 0 1.6C3.3 13.7 7 18 12 18c.8 0 1.6-.1 2.3-.4" /></svg>
    : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}><path d="M2.3 10.2C3.3 8.3 7 4 12 4s8.7 4.3 9.7 6.2a1.7 1.7 0 0 1 0 1.6C20.7 13.7 17 18 12 18s-8.7-4.3-9.7-6.2a1.7 1.7 0 0 1 0-1.6Z" /><circle cx="12" cy="11" r="3" /></svg>
}

function CloseIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 18, height: 18 }}><path d="m6 6 12 12M18 6 6 18" /></svg>
}

/* ─── Field ─────────────────────────────────────────────── */
function Field({ label, name, type = 'text', value, onChange, placeholder, autoComplete, extra }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, fontWeight: 600, color: '#b8b0a6' }}>
      {label}
      <div style={{ position: 'relative' }}>
        <input
          required
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, padding: '11px 14px', fontSize: 13, color: '#e8e2d8', outline: 'none' }}
          onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,.6)'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,.1)'}
        />
        {extra}
      </div>
    </label>
  )
}

/* ─── AuthModal ─────────────────────────────────────────── */
export default function AuthModal({ mode, onClose, onSwitch }) {
  const isLogin = mode === 'login'
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const update = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  async function submit(e) {
    e.preventDefault()
    setMessage('')
    setIsSubmitting(true)
    setIsError(false)
    try {
      const payload = isLogin ? { email: form.email, password: form.password } : form
      const { data } = await api.post(isLogin ? '/auth/login' : '/auth/register', payload)
      localStorage.setItem('ayskeopiUser', JSON.stringify(data.user))
      setMessage(isLogin ? 'Welcome back! Redirecting…' : 'Account created! Redirecting…')
      setTimeout(() => { onClose(); navigate('/app') }, 600)
    } catch (error) {
      setIsError(true)
      setMessage(error.response?.data?.error || 'We could not complete that request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  /* close on backdrop click */
  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      onClick={handleBackdrop}
      style={{
        position: 'fixed', inset: 0, zIndex: 999,
        background: 'rgba(0,0,0,.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px 16px',
      }}
    >
      <div style={{
        position: 'relative',
        width: '100%', maxWidth: 440,
        background: '#111009',
        border: '1px solid rgba(255,255,255,.1)',
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 40px 80px rgba(0,0,0,.7)',
        animation: 'modalIn .25s cubic-bezier(.22,1,.36,1)',
      }}>
        {/* Gold top bar */}
        <div style={{ height: 3, background: 'linear-gradient(90deg,#c9a84c,#e8d080,#c9a84c)' }} />

        <div style={{ padding: '36px 36px 32px' }}>
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
            <div>
              <p style={{ margin: '0 0 6px', fontSize: 10, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c9a84c' }}>
                {isLogin ? 'Welcome Back' : 'Join Ayskeopi'}
              </p>
              <h2 style={{ margin: 0, fontSize: 26, fontWeight: 900, letterSpacing: '-0.03em' }}>
                {isLogin ? 'Sign in' : 'Create account'}
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close modal"
              style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, width: 34, height: 34, display: 'grid', placeItems: 'center', cursor: 'pointer', color: '#9a938d', flexShrink: 0 }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = '#9a938d'}
            >
              <CloseIcon />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {!isLogin && (
              <Field label="Full name" name="name" value={form.name} onChange={update} placeholder="Your name" autoComplete="name" />
            )}
            <Field label="Email address" name="email" type="email" value={form.email} onChange={update} placeholder="you@example.com" autoComplete="email" />
            <Field
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={update}
              placeholder="••••••••"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              extra={
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9a938d', display: 'grid', placeItems: 'center' }}
                >
                  <EyeIcon hidden={showPassword} />
                </button>
              }
            />

            <button
              disabled={isSubmitting}
              style={{ marginTop: 4, background: '#c9a84c', color: '#000', border: 'none', borderRadius: 8, padding: '13px', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', cursor: 'pointer', opacity: isSubmitting ? 0.7 : 1, transition: 'background .2s' }}
              onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.background = '#e2bd60' }}
              onMouseLeave={e => e.currentTarget.style.background = '#c9a84c'}
            >
              {isSubmitting ? 'Please wait…' : isLogin ? 'Sign in →' : 'Create my account →'}
            </button>
          </form>

          {/* Message */}
          {message && (
            <p role="status" style={{ marginTop: 14, background: isError ? 'rgba(220,60,60,.1)' : 'rgba(201,168,76,.1)', border: `1px solid ${isError ? 'rgba(220,60,60,.25)' : 'rgba(201,168,76,.25)'}`, borderRadius: 8, padding: '10px 14px', fontSize: 12, lineHeight: 1.7, color: isError ? '#f08080' : '#c9a84c' }}>
              {message}
            </p>
          )}

          {/* Footer links */}
          <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
            <span style={{ color: '#5a5450' }}>
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button onClick={onSwitch} style={{ background: 'none', border: 'none', padding: 0, color: '#c9a84c', fontWeight: 600, cursor: 'pointer', fontSize: 12 }}>
                {isLogin ? 'Register' : 'Sign in'}
              </button>
            </span>
            {isLogin && (
              <button onClick={() => { onClose(); navigate('/forgot-password') }} style={{ background: 'none', border: 'none', padding: 0, color: '#5a5450', fontSize: 12, cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.color = '#c9a84c'}
                onMouseLeave={e => e.currentTarget.style.color = '#5a5450'}
              >
                Forgot password?
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(.94) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}
