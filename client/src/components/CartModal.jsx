import { useState } from 'react'
import api from '../api'

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}>
      <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 18, height: 18 }}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  )
}

function IconCoffee() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28, color: '#c9a84c' }}>
      <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3" />
    </svg>
  )
}

function IconEmptyBag() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 36, height: 36, color: '#7a736d' }}>
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14, color: '#c9a84c', display: 'inline-block', verticalAlign: 'middle' }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export default function CartModal({ cart, onClose, onUpdateQty, onRemoveItem, onClearCart, user, onRequireAuth, onOrderSuccess }) {
  const [isPlacing, setIsPlacing] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successOrder, setSuccessOrder] = useState(null)

  const subtotal = cart.reduce((sum, item) => sum + (item.unitPrice * item.qty), 0)

  async function handleCheckout() {
    setErrorMsg('')
    if (!user) {
      onRequireAuth()
      return
    }
    if (cart.length === 0) return

    setIsPlacing(true)
    try {
      // Place each drink order to the server
      const orderPromises = cart.map(item =>
        api.post('/orders', {
          user: user.id || user._id,
          drink: item.name,
          customizations: {
            size: item.size || 'Medium',
            milk: item.milk || 'Oat milk',
            extraShot: Boolean(item.extraShot),
            syrup: item.sweetness || 'Regular',
          },
          total: item.unitPrice * item.qty,
        })
      )

      const results = await Promise.all(orderPromises)
      const lastData = results[results.length - 1]?.data
      
      // Update local storage user loyalty points if returned
      if (lastData?.loyaltyPoints !== undefined) {
        const stored = JSON.parse(localStorage.getItem('ayskeopiUser') || '{}')
        stored.loyaltyPoints = lastData.loyaltyPoints
        stored.passportStamps = lastData.passportStamps
        localStorage.setItem('ayskeopiUser', JSON.stringify(stored))
      }

      setSuccessOrder({
        itemCount: cart.reduce((sum, i) => sum + i.qty, 0),
        total: subtotal,
        pickupMinutes: lastData?.order?.pickupMinutes || 5,
        pointsEarned: cart.length * 10,
      })
      onClearCart()
      onOrderSuccess?.()
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Could not place order. Please verify your connection.')
    } finally {
      setIsPlacing(false)
    }
  }

  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      onClick={handleBackdrop}
      style={{
        position: 'fixed', inset: 0, zIndex: 1050,
        background: 'rgba(0,0,0,.8)',
        backdropFilter: 'blur(8px)',
        display: 'flex', justifyContent: 'flex-end',
      }}
    >
      <div style={{
        position: 'relative',
        width: '100%', maxWidth: 460,
        height: 'calc(100% - 64px)',
        marginTop: 64,
        background: '#111009',
        borderLeft: '1px solid rgba(255,255,255,.1)',
        display: 'flex', flexDirection: 'column',
        boxShadow: '-20px 0 60px rgba(0,0,0,.7)',
        animation: 'slideInRight .28s cubic-bezier(.22,1,.36,1)',
      }}>
        {/* Header */}
        <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#c9a84c' }}>YOUR CART</span>
            <h2 style={{ margin: '4px 0 0', fontSize: 20, fontWeight: 900, color: '#e8e2d8' }}>
              {cart.reduce((s, i) => s + i.qty, 0)} {cart.length === 1 && cart[0].qty === 1 ? 'Item' : 'Items'}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close cart"
            style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, width: 34, height: 34, display: 'grid', placeItems: 'center', cursor: 'pointer', color: '#9a938d' }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = '#9a938d'}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Order Success State */}
        {successOrder ? (
          <div style={{ flex: 1, padding: '36px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(201,168,76,.15)', border: '2px solid #c9a84c', display: 'grid', placeItems: 'center', marginBottom: 16 }}>
              <IconCoffee />
            </div>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c9a84c' }}>ORDER CONFIRMED</span>
            <h3 style={{ margin: '6px 0 10px', fontSize: 20, fontWeight: 900, color: '#e8e2d8' }}>Brewing Your Ice Coffee!</h3>
            <p style={{ margin: '0 0 20px', fontSize: 12, lineHeight: 1.6, color: '#9a938d', maxWidth: 280 }}>
              Your order for {successOrder.itemCount} drink(s) has been sent to our baristas. Estimated pickup in <strong style={{ color: '#c9a84c' }}>{successOrder.pickupMinutes} minutes</strong>.
            </p>
            <div style={{ background: '#161412', border: '1px solid rgba(201,168,76,.3)', borderRadius: 12, padding: '12px 16px', marginBottom: 24, width: '100%' }}>
              <p style={{ margin: 0, fontSize: 11, color: '#c9a84c', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <IconCheck /> +{successOrder.pointsEarned} Loyalty Points Added to Your Passport!
              </p>
            </div>
            <button
              onClick={() => { setSuccessOrder(null); onClose() }}
              style={{ width: '100%', background: '#c9a84c', color: '#000', border: 'none', borderRadius: 6, padding: '12px', fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', cursor: 'pointer' }}
            >
              DONE &amp; EXPLORE MENU
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '18px 24px' }}>
              {cart.length === 0 ? (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#7a736d' }}>
                  <div style={{ marginBottom: 12 }}>
                    <IconEmptyBag />
                  </div>
                  <h4 style={{ margin: '0 0 4px', fontSize: 14, color: '#ddd7d0', fontWeight: 700 }}>Your cart is empty</h4>
                  <p style={{ margin: '0 0 20px', fontSize: 11, maxWidth: 220, lineHeight: 1.5 }}>
                    Select any of our 10 handcrafted iced coffees to start your order.
                  </p>
                  <button
                    onClick={onClose}
                    style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 6, color: '#c9a84c', padding: '8px 16px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                  >
                    BROWSE MENU →
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {cart.map((item, index) => (
                    <div
                      key={item.cartId || index}
                      style={{
                        background: '#161412',
                        border: '1px solid rgba(255,255,255,.07)',
                        borderRadius: 14,
                        padding: '14px',
                        display: 'flex', gap: 14, alignItems: 'center',
                      }}
                    >
                      <img
                        src={item.img}
                        alt={item.name}
                        style={{ width: 64, height: 64, borderRadius: 10, objectFit: 'cover', background: '#e3d7c9', flexShrink: 0 }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ margin: '0 0 3px', fontSize: 13, fontWeight: 700, color: '#e8e2d8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.name}
                        </h4>
                        <p style={{ margin: '0 0 6px', fontSize: 10, color: '#7a736d', lineHeight: 1.4 }}>
                          {item.size || 'Medium'} · {item.milk || 'Oat milk'}
                          {item.sweetness ? ` · ${item.sweetness} Sweetness` : ''}
                          {item.extraShot ? ' · +1 Extra Shot' : ''}
                        </p>
                        <strong style={{ fontSize: 14, color: '#c9a84c', fontWeight: 800 }}>
                          ₱{item.unitPrice * item.qty}
                        </strong>
                      </div>

                      {/* Quantity Stepper */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 8, padding: '3px 6px' }}>
                        <button
                          onClick={() => onUpdateQty(item.cartId, item.qty - 1)}
                          style={{ background: 'none', border: 'none', color: '#ddd7d0', cursor: 'pointer', fontSize: 14, fontWeight: 700, padding: '2px 4px' }}
                        >
                          -
                        </button>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#e8e2d8', minWidth: 16, textAlign: 'center' }}>
                          {item.qty}
                        </span>
                        <button
                          onClick={() => onUpdateQty(item.cartId, item.qty + 1)}
                          style={{ background: 'none', border: 'none', color: '#ddd7d0', cursor: 'pointer', fontSize: 14, fontWeight: 700, padding: '2px 4px' }}
                        >
                          +
                        </button>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => onRemoveItem(item.cartId)}
                        aria-label="Remove item"
                        style={{ background: 'none', border: 'none', color: '#5a5450', cursor: 'pointer', padding: 4, display: 'grid', placeItems: 'center' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#e05d5d'}
                        onMouseLeave={e => e.currentTarget.style.color = '#5a5450'}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {cart.length > 0 && (
              <div style={{ padding: '20px 28px 28px', borderTop: '1px solid rgba(255,255,255,.08)', background: '#0d0c0b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12, color: '#7a736d' }}>
                  <span>Subtotal</span>
                  <span style={{ color: '#e8e2d8', fontWeight: 600 }}>₱{subtotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, fontSize: 12, color: '#7a736d' }}>
                  <span>Estimated Prep</span>
                  <span style={{ color: '#c9a84c' }}>~5-7 mins</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18, fontSize: 15, fontWeight: 800, color: '#e8e2d8', borderTop: '1px solid rgba(255,255,255,.06)', paddingTop: 10 }}>
                  <span>Total</span>
                  <span style={{ color: '#c9a84c', fontSize: 18 }}>₱{subtotal}</span>
                </div>

                {errorMsg && (
                  <p style={{ margin: '0 0 12px', background: 'rgba(220,60,60,.12)', border: '1px solid rgba(220,60,60,.3)', borderRadius: 8, padding: '8px 12px', fontSize: 11, color: '#f08080' }}>
                    {errorMsg}
                  </p>
                )}

                <button
                  disabled={isPlacing}
                  onClick={handleCheckout}
                  style={{
                    width: '100%',
                    background: '#c9a84c',
                    color: '#000',
                    border: 'none',
                    borderRadius: 8,
                    padding: '14px',
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    cursor: 'pointer',
                    opacity: isPlacing ? 0.7 : 1,
                    transition: 'background .2s',
                  }}
                  onMouseEnter={e => { if (!isPlacing) e.currentTarget.style.background = '#e2bd60' }}
                  onMouseLeave={e => e.currentTarget.style.background = '#c9a84c'}
                >
                  {isPlacing ? 'PLACING ORDER…' : user ? `ORDER NOW · ₱${subtotal}` : 'SIGN IN TO CHECKOUT'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
