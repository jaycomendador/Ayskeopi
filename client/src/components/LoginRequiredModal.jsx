import { useState } from 'react'

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 32, height: 32, color: '#c9a84c' }}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

export default function LoginRequiredModal({ onClose, onLoginClick, actionType = 'order' }) {
  const messages = {
    order: 'To customize your iced coffee and add it to your cart, please sign in or create an account first.',
    rewards: 'To redeem rewards and claim free handcrafted drinks, please sign in or create an account first.',
    cart: 'To view your cart items or checkout, please sign in or create an account first.',
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1100,
        background: 'rgba(0,0,0,.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px 16px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%', maxWidth: 400,
          background: '#111009',
          border: '1px solid rgba(201,168,76,.35)',
          borderRadius: 20,
          overflow: 'hidden',
          padding: '32px 24px 28px',
          textAlign: 'center',
          boxShadow: '0 30px 80px rgba(0,0,0,.9)',
          animation: 'modalZoomIn .22s cubic-bezier(.22,1,.36,1)',
        }}
      >
        {/* Top Gold Line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,#c9a84c,#e8d080,#c9a84c)' }} />

        {/* Lock Icon */}
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(201,168,76,.12)', display: 'grid', placeItems: 'center', margin: '0 auto 16px', border: '1px solid rgba(201,168,76,.25)' }}>
          <LockIcon />
        </div>

        {/* Text */}
        <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#c9a84c' }}>
          Authentication Required
        </span>
        <h3 style={{ margin: '6px 0 10px', fontSize: 18, fontWeight: 900, color: '#e8e2d8' }}>
          Sign In Required
        </h3>
        <p style={{ margin: '0 0 24px', fontSize: 12, lineHeight: 1.6, color: '#9a938d' }}>
          {messages[actionType] || messages.order}
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={() => {
              onLoginClick()
              onClose()
            }}
            style={{
              width: '100%', background: '#c9a84c', color: '#000',
              border: 'none', borderRadius: 8, padding: '12px',
              fontSize: 11, fontWeight: 800, letterSpacing: '0.06em',
              cursor: 'pointer', transition: 'background .2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#e2bd60'}
            onMouseLeave={e => e.currentTarget.style.background = '#c9a84c'}
          >
            SIGN IN / REGISTER
          </button>
          <button
            onClick={onClose}
            style={{
              width: '100%', background: 'transparent', color: '#b8b0a6',
              border: '1px solid rgba(255,255,255,.15)', borderRadius: 8, padding: '11px',
              fontSize: 11, fontWeight: 700,
              cursor: 'pointer', transition: 'all .2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#fff'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,.25)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#b8b0a6'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,.15)'
            }}
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  )
}
