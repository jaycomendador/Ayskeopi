import { useState } from 'react'

function CloseIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 18, height: 18 }}><path d="m6 6 12 12M18 6 6 18" /></svg>
}

export default function OrderCustomizeModal({ coffee, onClose, onAddToCart }) {
  const [size, setSize] = useState('Medium')
  const [milk, setMilk] = useState('Oat milk')
  const [sweetness, setSweetness] = useState('100%')
  const [iceLevel, setIceLevel] = useState('Regular Ice')
  const [extraShot, setExtraShot] = useState(false)
  const [qty, setQty] = useState(1)

  if (!coffee) return null

  const basePrice = typeof coffee.price === 'number' ? coffee.price : parseInt(String(coffee.price).replace(/[^0-9]/g, '') || '165', 10)
  const sizeDiff = size === 'Large' ? 20 : size === 'Small' ? -10 : 0
  const shotDiff = extraShot ? 30 : 0
  const unitPrice = basePrice + sizeDiff + shotDiff
  const totalPrice = unitPrice * qty

  function handleAdd() {
    onAddToCart({
      cartId: `${coffee.name}-${size}-${milk}-${sweetness}-${iceLevel}-${extraShot}-${Date.now()}`,
      id: coffee.id || coffee._id,
      name: coffee.name,
      img: coffee.img || coffee.image || '/menu/01_Vanilla_Bean_Cold_Brew.png',
      size,
      milk,
      sweetness,
      iceLevel,
      extraShot,
      unitPrice,
      qty,
    })
    onClose()
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
          width: '100%', maxWidth: 480,
          maxHeight: '90vh',
          background: '#111009',
          border: '1px solid rgba(255,255,255,.12)',
          borderRadius: 20,
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 30px 80px rgba(0,0,0,.9)',
          animation: 'modalZoomIn .22s cubic-bezier(.22,1,.36,1)',
        }}
      >
        {/* Header Preview */}
        <div style={{ position: 'relative', height: 160, background: '#e3d7c9', overflow: 'hidden' }}>
          <img
            src={coffee.img || coffee.image || '/menu/01_Vanilla_Bean_Cold_Brew.png'}
            alt={coffee.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #111009 0%, transparent 70%)' }} />
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(0,0,0,.6)', border: '1px solid rgba(255,255,255,.15)', borderRadius: 8, width: 34, height: 34, display: 'grid', placeItems: 'center', cursor: 'pointer', color: '#e8e2d8' }}
          >
            <CloseIcon />
          </button>
          <div style={{ position: 'absolute', bottom: 12, left: 24, right: 24 }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c9a84c', border: '1px solid rgba(201,168,76,.4)', borderRadius: 4, padding: '2px 7px', background: 'rgba(0,0,0,.5)' }}>
              ❄ ICE COFFEE
            </span>
            <h3 style={{ margin: '6px 0 0', fontSize: 18, fontWeight: 900, color: '#e8e2d8' }}>{coffee.name}</h3>
          </div>
        </div>

        {/* Customization Options */}
        <div style={{ padding: '18px 24px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ margin: 0, fontSize: 12, lineHeight: 1.6, color: '#9a938d' }}>
            {coffee.desc || coffee.description || 'Crafted fresh over crystal ice.'}
          </p>

          {/* Size Choice */}
          <div>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c9a84c' }}>Cup Size</span>
            <div style={{ marginTop: 6, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {[['Small', '12 oz (-₱10)'], ['Medium', '16 oz (Standard)'], ['Large', '20 oz (+₱20)']].map(([s, label]) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  style={{
                    background: size === s ? 'rgba(201,168,76,.15)' : 'rgba(255,255,255,.04)',
                    border: size === s ? '1px solid #c9a84c' : '1px solid rgba(255,255,255,.08)',
                    borderRadius: 10, padding: '8px 4px', textAlign: 'center', cursor: 'pointer', transition: 'all .15s',
                  }}
                >
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: size === s ? '#c9a84c' : '#e8e2d8' }}>{s}</p>
                  <span style={{ fontSize: 9, color: size === s ? '#e8d080' : '#5a5450' }}>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Milk Choice */}
          <div>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c9a84c' }}>Milk Type</span>
            <div style={{ marginTop: 6, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {['Oat milk', 'Whole milk', 'Almond milk'].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMilk(m)}
                  style={{
                    background: milk === m ? 'rgba(201,168,76,.15)' : 'rgba(255,255,255,.04)',
                    border: milk === m ? '1px solid #c9a84c' : '1px solid rgba(255,255,255,.08)',
                    borderRadius: 10, padding: '8px 6px', fontSize: 11, fontWeight: 600,
                    color: milk === m ? '#c9a84c' : '#b8b0a6', cursor: 'pointer',
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Sweetness & Ice */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c9a84c' }}>Sweetness</span>
              <select
                value={sweetness}
                onChange={e => setSweetness(e.target.value)}
                style={{ width: '100%', marginTop: 6, background: '#161412', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, padding: '8px 10px', fontSize: 12, color: '#e8e2d8', outline: 'none' }}
              >
                <option value="100%">100% (Standard)</option>
                <option value="70%">70% (Less Sweet)</option>
                <option value="50%">50% (Half Sweet)</option>
                <option value="0%">0% (Unsweetened)</option>
              </select>
            </div>
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c9a84c' }}>Ice Level</span>
              <select
                value={iceLevel}
                onChange={e => setIceLevel(e.target.value)}
                style={{ width: '100%', marginTop: 6, background: '#161412', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, padding: '8px 10px', fontSize: 12, color: '#e8e2d8', outline: 'none' }}
              >
                <option value="Regular Ice">Regular Ice</option>
                <option value="Less Ice">Less Ice</option>
                <option value="Extra Ice">Extra Ice</option>
              </select>
            </div>
          </div>

          {/* Extra Shot Option */}
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 10, padding: '10px 14px', cursor: 'pointer' }}>
            <div>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#e8e2d8' }}>Add Extra Espresso Shot</p>
              <span style={{ fontSize: 10, color: '#7a736d' }}>Extra bold &amp; rich boost (+ ₱30)</span>
            </div>
            <input
              type="checkbox"
              checked={extraShot}
              onChange={e => setExtraShot(e.target.checked)}
              style={{ width: 18, height: 18, accentColor: '#c9a84c', cursor: 'pointer' }}
            />
          </label>
        </div>

        {/* Footer Actions */}
        <div style={{ padding: '16px 24px 20px', borderTop: '1px solid rgba(255,255,255,.08)', background: '#0a0908', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
          {/* Quantity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, padding: '4px 8px' }}>
            <button
              type="button"
              onClick={() => setQty(q => Math.max(1, q - 1))}
              style={{ background: 'none', border: 'none', color: '#e8e2d8', fontSize: 16, fontWeight: 700, cursor: 'pointer', padding: '0 4px' }}
            >
              -
            </button>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#c9a84c', minWidth: 18, textAlign: 'center' }}>{qty}</span>
            <button
              type="button"
              onClick={() => setQty(q => q + 1)}
              style={{ background: 'none', border: 'none', color: '#e8e2d8', fontSize: 16, fontWeight: 700, cursor: 'pointer', padding: '0 4px' }}
            >
              +
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAdd}
            style={{
              flex: 1,
              background: '#c9a84c',
              color: '#000',
              border: 'none',
              borderRadius: 8,
              padding: '12px 18px',
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: '0.06em',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              transition: 'background .2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#e2bd60'}
            onMouseLeave={e => e.currentTarget.style.background = '#c9a84c'}
          >
            <span>ADD TO CART</span>
            <span>₱{totalPrice}</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalZoomIn {
          from { opacity: 0; transform: scale(.93); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
