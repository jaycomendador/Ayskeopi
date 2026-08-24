import { useEffect, useState } from 'react'
import api from '../../api'

/* ── Custom Icons ── */
function RefreshIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" /></svg>
}
function ClockIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [statusFilter, setStatusFilter] = useState('All')

  const fetchOrders = async (isSilent = false) => {
    if (!isSilent) setLoading(true)
    else setRefreshing(true)
    try {
      const { data } = await api.get('/orders')
      setOrders(data || [])
    } catch (err) {
      console.error('Error fetching orders:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleUpdateStatus = async (id, nextStatus) => {
    try {
      // Optimistic update
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status: nextStatus } : o))
      
      // Persist to server
      await api.patch(`/orders/${id}`, { status: nextStatus })
    } catch (err) {
      console.error('Error updating order status:', err)
      alert('Could not update order status on the server.')
      fetchOrders(true) // roll back
    }
  }

  // Filter logic
  const filteredOrders = orders.filter(o => {
    if (statusFilter === 'All') return true
    if (statusFilter === 'Active') return o.status !== 'picked-up'
    return o.status === statusFilter
  })

  // Format date helper
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' - ' + date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    } catch {
      return dateString
    }
  }

  // Helper for status badge style
  const getStatusBadgeStyle = (status) => {
    const base = { fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.03em' }
    if (status === 'received') return { ...base, background: 'rgba(245,158,11,.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,.2)' }
    if (status === 'preparing') return { ...base, background: 'rgba(59,130,246,.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,.2)' }
    if (status === 'ready') return { ...base, background: 'rgba(16,185,129,.1)', color: '#10b981', border: '1px solid rgba(16,185,129,.2)' }
    return { ...base, background: 'rgba(255,255,255,.05)', color: '#9a938d', border: '1px solid rgba(255,255,255,.05)' }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', color: '#10b981', fontSize: 13 }}>
        <div>Loading order queue...</div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Metrics overview widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }}>
        {[
          { label: 'Received Queue', val: orders.filter(o => o.status === 'received').length, color: '#f59e0b' },
          { label: 'Now Preparing', val: orders.filter(o => o.status === 'preparing').length, color: '#3b82f6' },
          { label: 'Ready for Pickup', val: orders.filter(o => o.status === 'ready').length, color: '#10b981' },
          { label: 'Completed Today', val: orders.filter(o => o.status === 'picked-up').length, color: '#9a938d' },
        ].map((w, idx) => (
          <div key={idx} style={{ background: '#161a18', border: '1px solid rgba(255,255,255,.04)', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 10, color: '#687e74', fontWeight: 600, textTransform: 'uppercase' }}>{w.label}</span>
            <strong style={{ fontSize: 20, color: w.color }}>{w.val}</strong>
          </div>
        ))}
      </div>

      {/* Filter and controls bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {['Active', 'All', 'received', 'preparing', 'ready', 'picked-up'].map(f => {
            const active = statusFilter === f
            return (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                style={{
                  background: active ? '#10b981' : '#161a18',
                  color: active ? '#000' : '#9a938d',
                  border: '1px solid rgba(255,255,255,.03)',
                  borderRadius: 12,
                  padding: '6px 12px',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all .2s'
                }}
              >
                {f}
              </button>
            )
          })}
        </div>

        <button
          onClick={() => fetchOrders(true)}
          disabled={refreshing}
          style={{
            background: '#161a18',
            border: '1px solid rgba(255,255,255,.04)',
            borderRadius: 10,
            width: 36,
            height: 36,
            display: 'grid',
            placeItems: 'center',
            color: '#9a938d',
            cursor: 'pointer',
            opacity: refreshing ? 0.6 : 1,
            transition: 'all .2s'
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#9a938d'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.04)' }}
        >
          <span className={refreshing ? 'animate-spin' : ''}><RefreshIcon /></span>
        </button>
      </div>

      {/* Table block */}
      <div style={{ background: '#161a18', border: '1px solid rgba(255,255,255,.04)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 700 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,.03)', fontSize: 10, color: '#687e74', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                <th style={{ padding: '14px 20px' }}>Placed At</th>
                <th style={{ padding: '14px 20px' }}>Customer</th>
                <th style={{ padding: '14px 20px' }}>Item Ordered</th>
                <th style={{ padding: '14px 20px' }}>Customizations</th>
                <th style={{ padding: '14px 20px' }}>Total Price</th>
                <th style={{ padding: '14px 20px' }}>Status</th>
                <th style={{ padding: '14px 20px' }}>Action Queue</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: 48, textAlign: 'center', color: '#687e74', fontSize: 12 }}>
                    No orders in the current queue.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr
                    key={order._id}
                    style={{ borderBottom: '1px solid rgba(255,255,255,.02)', fontSize: 12 }}
                  >
                    {/* Placed At */}
                    <td style={{ padding: '14px 20px', color: '#9a938d' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <ClockIcon />
                        {formatDate(order.createdAt)}
                      </div>
                    </td>

                    {/* Customer */}
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontWeight: 700, color: '#fff' }}>{order.user?.name || 'Guest User'}</div>
                      <div style={{ fontSize: 10, color: '#526b60' }}>{order.user?.email || 'guest@ayskeopi.com'}</div>
                    </td>

                    {/* Item */}
                    <td style={{ padding: '14px 20px', fontWeight: 600, color: '#fff' }}>
                      {order.drink}
                    </td>

                    {/* Customizations */}
                    <td style={{ padding: '14px 20px', color: '#9a938d', fontSize: 11 }}>
                      {order.customizations ? (
                        <div>
                          <span>Size: {order.customizations.size || 'Medium'}</span>
                          {order.customizations.milk && <span> · Milk: {order.customizations.milk}</span>}
                          {order.customizations.syrup && <span> · Syrup: {order.customizations.syrup}</span>}
                          {order.customizations.extraShot && <span style={{ color: '#10b981' }}> · +1 Shot</span>}
                        </div>
                      ) : (
                        'Standard Recipe'
                      )}
                    </td>

                    {/* Total Price */}
                    <td style={{ padding: '14px 20px', fontWeight: 800, color: '#fff' }}>
                      ₱{order.total}
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: '14px 20px' }}>
                      <span style={getStatusBadgeStyle(order.status)}>
                        {order.status}
                      </span>
                    </td>

                    {/* Progression Controls */}
                    <td style={{ padding: '14px 20px' }}>
                      {order.status === 'received' && (
                        <button
                          onClick={() => handleUpdateStatus(order._id, 'preparing')}
                          style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, padding: '5px 10px', fontSize: 10, fontWeight: 700, cursor: 'pointer', transition: 'opacity .2s' }}
                          onMouseEnter={e => e.currentTarget.style.opacity = 0.8}
                          onMouseLeave={e => e.currentTarget.style.opacity = 1}
                        >
                          Start Brewing
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button
                          onClick={() => handleUpdateStatus(order._id, 'ready')}
                          style={{ background: '#10b981', color: '#000', border: 'none', borderRadius: 8, padding: '5px 10px', fontSize: 10, fontWeight: 700, cursor: 'pointer', transition: 'opacity .2s' }}
                          onMouseEnter={e => e.currentTarget.style.opacity = 0.8}
                          onMouseLeave={e => e.currentTarget.style.opacity = 1}
                        >
                          Set to Ready
                        </button>
                      )}
                      {order.status === 'ready' && (
                        <button
                          onClick={() => handleUpdateStatus(order._id, 'picked-up')}
                          style={{ background: '#687e74', color: '#fff', border: 'none', borderRadius: 8, padding: '5px 10px', fontSize: 10, fontWeight: 700, cursor: 'pointer', transition: 'opacity .2s' }}
                          onMouseEnter={e => e.currentTarget.style.opacity = 0.8}
                          onMouseLeave={e => e.currentTarget.style.opacity = 1}
                        >
                          Mark Picked Up
                        </button>
                      )}
                      {order.status === 'picked-up' && (
                        <span style={{ color: '#526b60', fontSize: 11 }}>Served ✓</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
