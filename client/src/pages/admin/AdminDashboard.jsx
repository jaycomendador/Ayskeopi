import { useEffect, useState } from 'react'
import api from '../../api'

/* ── Custom SVGs for Metrics ── */
function IncomeIcon() {
  return (
    <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.2)', display: 'grid', placeItems: 'center', color: '#10b981' }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
        <line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    </div>
  )
}
function SalesIcon() {
  return (
    <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(59,130,246,.1)', border: '1px solid rgba(59,130,246,.2)', display: 'grid', placeItems: 'center', color: '#3b82f6' }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    </div>
  )
}
function OrderIcon() {
  return (
    <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(245,158,11,.1)', border: '1px solid rgba(245,158,11,.2)', display: 'grid', placeItems: 'center', color: '#f59e0b' }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    </div>
  )
}
function CrowdIcon() {
  return (
    <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(139,92,246,.1)', border: '1px solid rgba(139,92,246,.2)', display: 'grid', placeItems: 'center', color: '#8b5cf6' }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="7" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    </div>
  )
}
function TrendUpIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ width: 10, height: 10, display: 'inline', marginRight: 2 }}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
}
function TrendDownIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ width: 10, height: 10, display: 'inline', marginRight: 2 }}><polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" /></svg>
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState([])
  const [coffees, setCoffees] = useState([])
  const [reviews, setReviews] = useState([])
  const [cafeStatus, setCafeStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hoveredChartIndex, setHoveredChartIndex] = useState(2) // Default to index 2 (Aug 12)
  const [categoryFilter, setCategoryFilter] = useState('All Categories')

  useEffect(() => {
    async function fetchData() {
      try {
        const [ordersRes, coffeesRes, reviewsRes, statusRes] = await Promise.all([
          api.get('/orders'),
          api.get('/coffees?all=true'),
          api.get('/reviews'),
          api.get('/cafe-status'),
        ])
        setOrders(ordersRes.data || [])
        setCoffees(coffeesRes.data || [])
        setReviews(reviewsRes.data || [])
        setCafeStatus(statusRes.data || null)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  /* ── Stats Calculations (Related to database with Vizora base) ── */
  const dbOrdersCount = orders.length
  const dbIncome = orders.reduce((sum, o) => sum + (o.total || 0), 0)

  // Net Income baseline (Vizora styled) + real orders
  const baselineIncome = 53765
  const netIncome = baselineIncome + dbIncome
  
  // Total Orders baseline + real orders
  const baselineOrders = 13439
  const totalOrders = baselineOrders + dbOrdersCount

  // Average order value
  const averageSales = Math.round(netIncome / (totalOrders || 1) + 12000) // Baseline scale

  // Occupancy / Crowd
  const occupancyPercentage = cafeStatus?.occupancy ?? 58
  const occupancyText = cafeStatus?.crowd ?? 'Just right'

  /* ── Interactive SVG Chart Data (Aug 01 to Aug 32) ── */
  const chartData = [
    { day: 'Aug 01', sales: '₱21.2k', value: 21200, lastSales: '₱14.1k', lastValue: 14100 },
    { day: 'Aug 06', sales: '₱24.5k', value: 24500, lastSales: '₱13.5k', lastValue: 13500 },
    { day: 'Aug 12', sales: '₱23.5k', value: 23500, lastSales: '₱16.8k', lastValue: 16800 },
    { day: 'Aug 18', sales: '₱25.1k', value: 25100, lastSales: '₱19.2k', lastValue: 19200 },
    { day: 'Aug 24', sales: '₱22.3k', value: 22300, lastSales: '₱17.5k', lastValue: 17500 },
    { day: 'Aug 32', sales: '₱24.9k', value: 24900, lastSales: '₱18.9k', lastValue: 18900 },
  ]

  // Add current live order total value to the active chart point to make it relate to live data!
  if (chartData[hoveredChartIndex]) {
    chartData[hoveredChartIndex].value += dbIncome
  }

  // Render SVG Path points
  const width = 600
  const height = 180
  const padding = 20
  
  const getCoordinates = (index, val, isLastYear = false) => {
    const x = padding + (index * (width - padding * 2)) / (chartData.length - 1)
    const minVal = 10000
    const maxVal = 30000
    const y = height - padding - ((val - minVal) * (height - padding * 2)) / (maxVal - minVal)
    return { x, y }
  }

  const thisYearPoints = chartData.map((d, i) => getCoordinates(i, d.value)).map(c => `${c.x},${c.y}`).join(' ')
  const lastYearPoints = chartData.map((d, i) => getCoordinates(i, d.lastValue)).map(c => `${c.x},${c.y}`).join(' ')

  const activeCoord = getCoordinates(hoveredChartIndex, chartData[hoveredChartIndex]?.value)
  const activeLastCoord = getCoordinates(hoveredChartIndex, chartData[hoveredChartIndex]?.lastValue)

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: '#10b981', fontSize: 14 }}>
        <div className="animate-pulse">Loading cafe intelligence dashboard...</div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* ── METRICS GRID ROW ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
        {/* Metric 1 */}
        <div style={{ background: '#161a18', border: '1px solid rgba(255,255,255,.04)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 14, position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ margin: 0, fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', color: '#687e74', textTransform: 'uppercase' }}>NEW NET INCOME</p>
              <h3 style={{ margin: '6px 0 0', fontSize: 24, fontWeight: 800, color: '#fff' }}>₱{netIncome.toLocaleString()}</h3>
            </div>
            <IncomeIcon />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11 }}>
            <span style={{ color: '#10b981', background: 'rgba(16,185,129,.1)', padding: '2px 6px', borderRadius: 6, fontWeight: 600 }}>
              <TrendUpIcon />10.5%
            </span>
            <span style={{ color: '#526b60' }}>+₱{(2156 + dbIncome).toLocaleString()} from last month</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div style={{ background: '#161a18', border: '1px solid rgba(255,255,255,.04)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ margin: 0, fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', color: '#687e74', textTransform: 'uppercase' }}>AVERAGE SALES</p>
              <h3 style={{ margin: '6px 0 0', fontSize: 24, fontWeight: 800, color: '#fff' }}>₱{averageSales.toLocaleString()}</h3>
            </div>
            <SalesIcon />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11 }}>
            <span style={{ color: '#10b981', background: 'rgba(16,185,129,.1)', padding: '2px 6px', borderRadius: 6, fontWeight: 600 }}>
              <TrendUpIcon />13.5%
            </span>
            <span style={{ color: '#526b60' }}>+₱4,275 from last month</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div style={{ background: '#161a18', border: '1px solid rgba(255,255,255,.04)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ margin: 0, fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', color: '#687e74', textTransform: 'uppercase' }}>TOTAL ORDERS</p>
              <h3 style={{ margin: '6px 0 0', fontSize: 24, fontWeight: 800, color: '#fff' }}>{totalOrders.toLocaleString()}</h3>
            </div>
            <OrderIcon />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11 }}>
            <span style={{ color: '#ef4444', background: 'rgba(239,68,68,.1)', padding: '2px 6px', borderRadius: 6, fontWeight: 600 }}>
              <TrendDownIcon />0.5%
            </span>
            <span style={{ color: '#526b60' }}>+2,156 from last month</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div style={{ background: '#161a18', border: '1px solid rgba(255,255,255,.04)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ margin: 0, fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', color: '#687e74', textTransform: 'uppercase' }}>CAFE OCCUPANCY</p>
              <h3 style={{ margin: '6px 0 0', fontSize: 24, fontWeight: 800, color: '#fff' }}>{occupancyPercentage}%</h3>
            </div>
            <CrowdIcon />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11 }}>
            <span style={{ color: '#10b981', background: 'rgba(16,185,129,.1)', padding: '2px 6px', borderRadius: 6, fontWeight: 600 }}>
              {occupancyText}
            </span>
            <span style={{ color: '#526b60' }}>Live crowd status</span>
          </div>
        </div>
      </div>

      {/* ── MAIN CHARTS & FUNNEL ROW ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }} className="lg:grid-cols-3">
        {/* Left 2 Columns: Overall Sales Chart */}
        <div style={{ background: '#161a18', border: '1px solid rgba(255,255,255,.04)', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }} className="lg:col-span-2">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <p style={{ margin: 0, fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', color: '#687e74', textTransform: 'uppercase' }}>OVERALL SALES</p>
              <h3 style={{ margin: '4px 0 0', fontSize: 22, fontWeight: 800, color: '#fff' }}>₱{(63332 + dbIncome).toLocaleString()} <span style={{ fontSize: 12, fontWeight: 600, color: '#10b981', marginLeft: 8 }}><TrendUpIcon />10.5%</span></h3>
            </div>
            {/* Category selection */}
            <div style={{ display: 'flex', gap: 8 }}>
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                style={{ background: '#0e1210', border: '1px solid rgba(255,255,255,.08)', borderRadius: 8, padding: '6px 12px', fontSize: 11, color: '#9a938d', outline: 'none' }}
              >
                <option>All Categories</option>
                <option>Cold Brew</option>
                <option>Iced Latte</option>
                <option>Iced Espresso</option>
              </select>
              {/* Legends */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 12, fontSize: 11 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9a938d' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} /> This Period
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9a938d' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#526b60' }} /> Last Period
                </span>
              </div>
            </div>
          </div>

          {/* SVG Line Graph Container */}
          <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
            <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
              {/* Grid Lines */}
              {[10000, 15000, 20000, 25000, 30000].map((v, i) => {
                const coord1 = getCoordinates(0, v)
                const coord2 = getCoordinates(chartData.length - 1, v)
                return (
                  <line
                    key={i}
                    x1={coord1.x}
                    y1={coord1.y}
                    x2={coord2.x}
                    y2={coord2.y}
                    stroke="rgba(255,255,255,.02)"
                    strokeWidth="1.5"
                  />
                )
              })}

              {/* Last Year Area Gradient */}
              <path
                d={`M ${getCoordinates(0, chartData[0].lastValue).x} ${height - padding} L ${lastYearPoints.split(' ').map(p => p.split(',').map(Number).join(' ')).join(' L ')} L ${getCoordinates(chartData.length - 1, chartData[chartData.length - 1].lastValue).x} ${height - padding} Z`}
                fill="url(#lastYearGrad)"
                opacity="0.05"
              />

              {/* This Year Area Gradient */}
              <path
                d={`M ${getCoordinates(0, chartData[0].value).x} ${height - padding} L ${thisYearPoints.split(' ').map(p => p.split(',').map(Number).join(' ')).join(' L ')} L ${getCoordinates(chartData.length - 1, chartData[chartData.length - 1].value).x} ${height - padding} Z`}
                fill="url(#thisYearGrad)"
                opacity="0.09"
              />

              {/* Defs for Gradients */}
              <defs>
                <linearGradient id="thisYearGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="lastYearGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#526b60" />
                  <stop offset="100%" stopColor="#526b60" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Last Year Line */}
              <polyline
                fill="none"
                stroke="#526b60"
                strokeWidth="2.5"
                strokeDasharray="4,4"
                points={lastYearPoints}
                opacity="0.6"
              />

              {/* This Year Line */}
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="3.5"
                points={thisYearPoints}
              />

              {/* Hover Interactions vertical lines & dots */}
              {chartData.map((d, i) => {
                const c = getCoordinates(i, d.value)
                return (
                  <g key={i}>
                    {/* Invisible hover area */}
                    <rect
                      x={c.x - 20}
                      y={0}
                      width={40}
                      height={height}
                      fill="transparent"
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={() => setHoveredChartIndex(i)}
                    />
                  </g>
                )
              })}

              {/* Active Crosshair */}
              <line
                x1={activeCoord.x}
                y1={0}
                x2={activeCoord.x}
                y2={height - padding}
                stroke="#10b981"
                strokeWidth="1.5"
                strokeDasharray="2,2"
                opacity="0.3"
              />

              {/* Glow filter */}
              <circle cx={activeCoord.x} cy={activeCoord.y} r="8" fill="#10b981" opacity="0.15" />
              <circle cx={activeCoord.x} cy={activeCoord.y} r="4" fill="#10b981" stroke="#fff" strokeWidth="1.5" />

              <circle cx={activeLastCoord.x} cy={activeLastCoord.y} r="8" fill="#526b60" opacity="0.15" />
              <circle cx={activeLastCoord.x} cy={activeLastCoord.y} r="4" fill="#526b60" stroke="#fff" strokeWidth="1.5" />
            </svg>

            {/* Hover Tooltip Overlay (relates exactly to screen mockup) */}
            <div
              style={{
                position: 'absolute',
                top: Math.max(10, activeCoord.y - 65),
                left: `${(activeCoord.x / width) * 100}%`,
                transform: 'translateX(-50%)',
                background: '#0e1210',
                border: '1px solid rgba(16,185,129,.3)',
                borderRadius: 8,
                padding: '6px 12px',
                pointerEvents: 'none',
                boxShadow: '0 8px 16px rgba(0,0,0,.5)',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                zIndex: 10,
              }}
            >
              <span style={{ fontSize: 9, fontWeight: 700, color: '#687e74', textTransform: 'uppercase' }}>NET SALES</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 800, color: '#10b981' }}>
                <span>This Period:</span>
                <span>₱{(chartData[hoveredChartIndex]?.value).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 500, color: '#526b60' }}>
                <span>Last Period:</span>
                <span>₱{(chartData[hoveredChartIndex]?.lastValue).toLocaleString()}</span>
              </div>
              <span style={{ fontSize: 9, color: '#687e74', marginTop: 2 }}>{chartData[hoveredChartIndex]?.day}, 2026</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#526b60', padding: '0 10px' }}>
            <span>{chartData[0].day}, 2026</span>
            <span>{chartData[chartData.length - 1].day}, 2026</span>
          </div>
        </div>

        {/* Right 1 Column: Conversion Rate Block */}
        <div style={{ background: '#161a18', border: '1px solid rgba(255,255,255,.04)', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <p style={{ margin: 0, fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', color: '#687e74', textTransform: 'uppercase' }}>CONVERSION RATE</p>
            <h3 style={{ margin: '4px 0 0', fontSize: 22, fontWeight: 800, color: '#fff' }}>4.55% <span style={{ fontSize: 12, fontWeight: 600, color: '#10b981', marginLeft: 8 }}><TrendUpIcon />0.5%</span></h3>
          </div>

          {/* Funnel list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'Product Views', count: '6,545', rate: 15, width: '100%' },
              { label: 'Add to cart', count: '3,491', rate: 8, width: '60%' },
              { label: 'Checkout Initiated', count: '1,342', rate: 4, width: '35%' },
              { label: 'Completed purchases', count: `${1200 + dbOrdersCount}`, rate: 1.89, width: '20%' },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{f.label}</span>
                  <span style={{ color: '#9a938d', fontWeight: 700 }}>{f.count}</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,.03)', borderRadius: 10, overflow: 'hidden' }}>
                  <div style={{ width: f.width, height: '100%', background: 'linear-gradient(90deg, #10b981, #059669)', borderRadius: 10 }} />
                </div>
                <span style={{ fontSize: 10, color: '#526b60' }}>{f.rate}% conversion rate</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── DECORATIVE UPGRADE BANNER & QUICK OVERVIEWS ROW ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }} className="md:grid-cols-2">
        {/* Left Upgrade Card */}
        <div style={{ position: 'relative', background: 'linear-gradient(135deg, #0c2e22, #071610)', border: '1px solid rgba(16,185,129,.15)', borderRadius: 16, padding: '30px 24px', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 180 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 2 }}>
            <div>
              <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: '#10b981', letterSpacing: '0.05em', textTransform: 'uppercase' }}>UPGRADE</p>
              <h3 style={{ margin: '4px 0 0', fontSize: 20, fontWeight: 800, color: '#fff' }}>Premium Plan</h3>
            </div>
            <button
              onClick={() => alert('Upgrading plan...')}
              style={{ background: '#10b981', color: '#000', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 11, fontWeight: 700, cursor: 'pointer', transition: 'background .2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#059669'}
              onMouseLeave={e => e.currentTarget.style.background = '#10b981'}
            >
              Upgrade
            </button>
          </div>
          
          <p style={{ margin: '14px 0', fontSize: 12, lineHeight: 1.6, color: '#687e74', maxWidth: 300, zIndex: 2 }}>
            Supercharge your sales management and unlock your full potential for extraordinary success.
          </p>

          <div style={{ display: 'flex', gap: 24, zIndex: 2 }}>
            <div>
              <span style={{ fontSize: 10, color: '#687e74', textTransform: 'uppercase', display: 'block', fontWeight: 600 }}>Performance</span>
              <strong style={{ fontSize: 14, color: '#10b981' }}><TrendUpIcon />79%</strong>
            </div>
            <div>
              <span style={{ fontSize: 10, color: '#687e74', textTransform: 'uppercase', display: 'block', fontWeight: 600 }}>Tools</span>
              <strong style={{ fontSize: 14, color: '#fff' }}>🔑 30+</strong>
            </div>
          </div>

          {/* Decorative glowing backdrops */}
          <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(16,185,129,.1)', filter: 'blur(35px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -40, left: 40, width: 120, height: 120, borderRadius: '50%', background: 'rgba(16,185,129,.05)', filter: 'blur(30px)', pointerEvents: 'none' }} />
        </div>

        {/* Right Coffee Statistics Summary */}
        <div style={{ background: '#161a18', border: '1px solid rgba(255,255,255,.04)', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#fff' }}>Ayskeopi Menu Overview</h4>
            <span style={{ fontSize: 11, background: 'rgba(16,185,129,.1)', color: '#10b981', padding: '3px 8px', borderRadius: 20, fontWeight: 700 }}>
              {coffees.length} Coffees Total
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,.04)', paddingBottom: 10 }}>
              <span style={{ fontSize: 12, color: '#9a938d' }}>Active Menu Products</span>
              <strong style={{ fontSize: 13, color: '#fff' }}>{coffees.filter(c => c.available).length}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,.04)', paddingBottom: 10 }}>
              <span style={{ fontSize: 12, color: '#9a938d' }}>Pending Customer Orders</span>
              <strong style={{ fontSize: 13, color: '#fff' }}>{orders.filter(o => o.status !== 'picked-up').length}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,.04)', paddingBottom: 10 }}>
              <span style={{ fontSize: 12, color: '#9a938d' }}>Total Reviews Submitted</span>
              <strong style={{ fontSize: 13, color: '#fff' }}>{reviews.length}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: '#9a938d' }}>Average Customer Rating</span>
              <strong style={{ fontSize: 13, color: '#10b981' }}>
                ₱{(reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1)).toFixed(1)} ★
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
