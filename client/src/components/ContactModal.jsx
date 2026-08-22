import { useState } from 'react'

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 18, height: 18 }}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  )
}

function IconLocation() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18, color: '#c9a84c' }}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function IconClock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18, color: '#c9a84c' }}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18, color: '#c9a84c' }}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 32, height: 32, color: '#c9a84c' }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export default function ContactModal({ onClose }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('General Inquiry')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!name || !email || !message) return

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 600)
  }

  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      onClick={handleBackdrop}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,.82)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px 16px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%', maxWidth: 520,
          maxHeight: '90vh',
          background: '#111009',
          border: '1px solid rgba(201,168,76,.3)',
          borderRadius: 20,
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 30px 80px rgba(0,0,0,.9)',
          animation: 'modalZoomIn .22s cubic-bezier(.22,1,.36,1)',
        }}
      >
        {/* Header */}
        <div style={{ padding: '22px 26px 16px', borderBottom: '1px solid rgba(255,255,255,.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#c9a84c' }}>GET IN TOUCH</span>
            <h3 style={{ margin: '4px 0 0', fontSize: 18, fontWeight: 900, color: '#e8e2d8' }}>Contact Ayskeopi</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 8, width: 32, height: 32, display: 'grid', placeItems: 'center', cursor: 'pointer', color: '#9a938d', transition: 'all .2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#c9a84c' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#9a938d'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.12)' }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px 26px 26px', overflowY: 'auto' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '28px 12px' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(201,168,76,.15)', border: '2px solid #c9a84c', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
                <IconCheck />
              </div>
              <h4 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 900, color: '#e8e2d8' }}>Message Received!</h4>
              <p style={{ margin: '0 0 24px', fontSize: 12, lineHeight: 1.6, color: '#9a938d', maxWidth: 300, marginLeft: 'auto', marginRight: 'auto' }}>
                Thanks for reaching out, <strong style={{ color: '#c9a84c' }}>{name}</strong>. Our barista support team will respond to your email at <span style={{ color: '#e8e2d8' }}>{email}</span> shortly.
              </p>
              <button
                onClick={onClose}
                style={{ background: '#c9a84c', color: '#000', border: 'none', borderRadius: 6, padding: '10px 24px', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}
              >
                CLOSE
              </button>
            </div>
          ) : (
            <>
              {/* Quick Info Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
                <div style={{ background: '#161412', border: '1px solid rgba(255,255,255,.06)', borderRadius: 10, padding: '12px 10px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}><IconLocation /></div>
                  <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: '#e8e2d8' }}>Makati City</p>
                  <p style={{ margin: '2px 0 0', fontSize: 9, color: '#7a736d' }}>Metro Manila, PH</p>
                </div>
                <div style={{ background: '#161412', border: '1px solid rgba(255,255,255,.06)', borderRadius: 10, padding: '12px 10px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}><IconClock /></div>
                  <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: '#e8e2d8' }}>Daily Hours</p>
                  <p style={{ margin: '2px 0 0', fontSize: 9, color: '#7a736d' }}>7:00 AM - 10:00 PM</p>
                </div>
                <div style={{ background: '#161412', border: '1px solid rgba(255,255,255,.06)', borderRadius: 10, padding: '12px 10px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}><IconMail /></div>
                  <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: '#e8e2d8' }}>Email Support</p>
                  <p style={{ margin: '2px 0 0', fontSize: 9, color: '#7a736d' }}>hello@ayskeopi.com</p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#9a938d', marginBottom: 5 }}>Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      style={{ width: '100%', boxSizing: 'border-box', background: '#161412', border: '1px solid rgba(255,255,255,.1)', borderRadius: 6, padding: '9px 12px', fontSize: 11, color: '#fff', outline: 'none' }}
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
                      style={{ width: '100%', boxSizing: 'border-box', background: '#161412', border: '1px solid rgba(255,255,255,.1)', borderRadius: 6, padding: '9px 12px', fontSize: 11, color: '#fff', outline: 'none' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#9a938d', marginBottom: 5 }}>Subject</label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', background: '#161412', border: '1px solid rgba(255,255,255,.1)', borderRadius: 6, padding: '9px 12px', fontSize: 11, color: '#fff', outline: 'none' }}
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Order & Delivery Support">Order &amp; Delivery Support</option>
                    <option value="Bulk & Catering Order">Bulk &amp; Catering Order</option>
                    <option value="Rewards & Loyalty Points">Rewards &amp; Loyalty Points</option>
                    <option value="Feedback & Suggestions">Feedback &amp; Suggestions</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#9a938d', marginBottom: 5 }}>Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can our coffee team assist you today?"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', background: '#161412', border: '1px solid rgba(255,255,255,.1)', borderRadius: 6, padding: '9px 12px', fontSize: 11, color: '#fff', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    marginTop: 6,
                    background: '#c9a84c',
                    color: '#000',
                    border: 'none',
                    borderRadius: 6,
                    padding: '11px',
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    cursor: 'pointer',
                    transition: 'background .2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#e2bd60'}
                  onMouseLeave={e => e.currentTarget.style.background = '#c9a84c'}
                >
                  {loading ? 'SENDING MESSAGE...' : 'SEND MESSAGE'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
