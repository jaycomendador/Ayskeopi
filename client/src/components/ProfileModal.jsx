import { useState, useEffect } from 'react'
import api from '../api'

function CloseIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 18, height: 18 }}><path d="m6 6 12 12M18 6 6 18" /></svg>
}

export default function ProfileModal({ user, onClose, onLogout }) {
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)

  useEffect(() => {
    if (user) {
      api.get('/orders')
        .then(({ data }) => {
          const userOrders = data.filter(o => {
            const uid = typeof o.user === 'object' ? o.user?._id : o.user
            return uid === (user.id || user._id)
          })
          setOrders(userOrders)
        })
        .catch(() => {})
        .finally(() => setLoadingOrders(false))
    }
  }, [user])

  if (!user) return null

  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose()
  }

  const stamps = user.passportStamps || (orders.length % 10)
  const points = user.loyaltyPoints || (orders.length * 10)

  return (
    <div
      onClick={handleBackdrop}
      style={{
        position: 'fixed', inset: 0, zIndex: 1050,
        background: 'rgba(0,0,0,.8)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px 16px',
      }}
    >
      <div style={{
        position: 'relative',
        width: '100%', maxWidth: 520,
        maxHeight: '90vh',
        background: '#111009',
        border: '1px solid rgba(255,255,255,.1)',
        borderRadius: 22,
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 30px 80px rgba(0,0,0,.8)',
        animation: 'modalFadeIn .22s cubic-bezier(.22,1,.36,1)',
      }}>
        {/* Header */}
        <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: '50%', background: '#c9a84c', display: 'grid', placeItems: 'center', fontSize: 18, fontWeight: 900, color: '#000', flexShrink: 0 }}>
              {(user.name || 'U')[0].toUpperCase()}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#e8e2d8' }}>{user.name}</h3>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: '#7a736d' }}>{user.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, width: 34, height: 34, display: 'grid', placeItems: 'center', cursor: 'pointer', color: '#9a938d' }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px 28px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Rewards & Passport Card */}
          <div style={{ background: 'linear-gradient(135deg,#251a0e,#161009)', border: '1px solid rgba(201,168,76,.3)', borderRadius: 16, padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div>
                <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c' }}>COFFEE PASSPORT</span>
                <p style={{ margin: '4px 0 0', fontSize: 14, fontWeight: 700, color: '#e8e2d8' }}>
                  {stamps} of 10 Cups Collected
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c' }}>POINTS</span>
                <p style={{ margin: '4px 0 0', fontSize: 16, fontWeight: 900, color: '#c9a84c' }}>{points} pts</p>
              </div>
            </div>

            {/* Passport Stamps Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 6, margin: '14px 0 10px' }}>
              {Array.from({ length: 10 }, (_, i) => (
                <div
                  key={i}
                  style={{
                    aspectRatio: '1',
                    borderRadius: '50%',
                    border: i < stamps ? '1px solid #c9a84c' : '1px solid rgba(255,255,255,.15)',
                    background: i < stamps ? '#c9a84c' : 'rgba(255,255,255,.04)',
                    color: '#000',
                    display: 'grid', placeItems: 'center',
                    boxShadow: i < stamps ? '0 0 0 1px rgba(201,168,76,.15)' : 'none',
                  }}
                />
              ))}
            </div>
            <p style={{ margin: 0, fontSize: 11, color: '#9a938d' }}>
              {10 - stamps === 0 ? 'You earned a Free Iced Coffee reward!' : `${10 - stamps} more cups until your next free handcrafted iced coffee!`}
            </p>
          </div>

          {/* Recent Orders Section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c9a84c' }}>
                ORDER HISTORY ({orders.length})
              </span>
            </div>

            {loadingOrders ? (
              <p style={{ fontSize: 12, color: '#7a736d' }}>Loading order history…</p>
            ) : orders.length === 0 ? (
              <div style={{ background: '#161412', border: '1px solid rgba(255,255,255,.06)', borderRadius: 12, padding: '24px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: 12, color: '#7a736d' }}>No orders placed yet. Choose your first cold brew!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {orders.slice(0, 5).map(order => (
                  <div
                    key={order._id}
                    style={{
                      background: '#161412',
                      border: '1px solid rgba(255,255,255,.06)',
                      borderRadius: 12,
                      padding: '12px 16px',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#e8e2d8' }}>{order.drink}</h4>
                        <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', color: '#c9a84c', background: 'rgba(201,168,76,.12)', borderRadius: 4, padding: '1px 6px' }}>
                          {order.status || 'Received'}
                        </span>
                      </div>
                      <p style={{ margin: '4px 0 0', fontSize: 10, color: '#7a736d' }}>
                        {order.customizations?.size || 'Medium'} · {order.customizations?.milk || 'Oat milk'}
                        {order.customizations?.extraShot ? ' · +Shot' : ''}
                      </p>
                    </div>
                    <strong style={{ fontSize: 14, color: '#c9a84c', fontWeight: 800 }}>
                      ₱{order.total}
                    </strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer with Logout */}
        <div style={{ padding: '16px 28px', borderTop: '1px solid rgba(255,255,255,.08)', background: '#0a0908', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#5a5450' }}>Ayskeopi Member</span>
          <button
            onClick={() => { onLogout(); onClose() }}
            style={{ background: 'rgba(220,60,60,.12)', border: '1px solid rgba(220,60,60,.25)', borderRadius: 8, padding: '8px 16px', fontSize: 11, fontWeight: 700, color: '#f08080', cursor: 'pointer', transition: 'background .2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(220,60,60,.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(220,60,60,.12)'}
          >
            Log out
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
