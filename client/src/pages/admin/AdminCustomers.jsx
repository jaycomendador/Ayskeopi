import { useEffect, useState } from 'react'
import api from '../../api'

/* ── Custom Icons ── */
function RefreshIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" /></svg>
}
function SearchIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const fetchCustomers = async (isSilent = false) => {
    if (!isSilent) setLoading(true)
    else setRefreshing(true)
    try {
      const { data } = await api.get('/users')
      setCustomers(data || [])
    } catch (err) {
      console.error('Error fetching customers:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  // Filter customers
  const filteredCustomers = customers.filter(c => {
    return c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           c.email.toLowerCase().includes(searchQuery.toLowerCase())
  })

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', color: '#10b981', fontSize: 13 }}>
        <div>Loading customer database...</div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Search & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: 300 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#687e74', display: 'flex' }}>
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ background: '#161a18', border: '1px solid rgba(255,255,255,.04)', borderRadius: 10, padding: '8px 12px 8px 34px', fontSize: 12, color: '#fff', width: '100%', outline: 'none' }}
          />
        </div>

        <button
          onClick={() => fetchCustomers(true)}
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

      {/* Database table block */}
      <div style={{ background: '#161a18', border: '1px solid rgba(255,255,255,.04)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 700 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,.03)', fontSize: 10, color: '#687e74', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                <th style={{ padding: '14px 20px' }}>Customer Name</th>
                <th style={{ padding: '14px 20px' }}>Coffee Profile</th>
                <th style={{ padding: '14px 20px' }}>Passport Stamps</th>
                <th style={{ padding: '14px 20px' }}>Loyalty Points</th>
                <th style={{ padding: '14px 20px' }}>Active Streak</th>
                <th style={{ padding: '14px 20px' }}>Achievements</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: 48, textAlign: 'center', color: '#687e74', fontSize: 12 }}>
                    No registered customers found.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(customer => (
                  <tr
                    key={customer._id}
                    style={{ borderBottom: '1px solid rgba(255,255,255,.02)', fontSize: 12 }}
                  >
                    {/* Name */}
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontWeight: 700, color: '#fff' }}>{customer.name}</div>
                      <div style={{ fontSize: 10, color: '#526b60' }}>{customer.email}</div>
                    </td>

                    {/* Coffee Profile */}
                    <td style={{ padding: '14px 20px', color: '#9a938d' }}>
                      {customer.coffeeProfile ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <span>☕ {customer.coffeeProfile.temperature || 'Cold'} · {customer.coffeeProfile.flavor || 'Rich'}</span>
                          <span style={{ fontSize: 10, color: '#526b60' }}>Strength: {customer.coffeeProfile.strength || 'Medium'}</span>
                        </div>
                      ) : (
                        <span style={{ color: '#526b60' }}>No profile selected</span>
                      )}
                    </td>

                    {/* Passport Stamps */}
                    <td style={{ padding: '14px 20px', fontWeight: 600, color: '#fff' }}>
                      🎟️ {customer.passportStamps || 0} stamps
                    </td>

                    {/* Loyalty Points */}
                    <td style={{ padding: '14px 20px', fontWeight: 700, color: '#10b981' }}>
                      🪙 {customer.loyaltyPoints || 0} pts
                    </td>

                    {/* Streak */}
                    <td style={{ padding: '14px 20px', color: '#f59e0b', fontWeight: 600 }}>
                      🔥 {customer.streak || 0} days
                    </td>

                    {/* Achievements */}
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {customer.achievements && customer.achievements.length > 0 ? (
                          customer.achievements.map((ach, idx) => (
                            <span key={idx} style={{ fontSize: 9, fontWeight: 700, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.07)', color: '#e8e2d8', padding: '2px 6px', borderRadius: 20 }}>
                              {ach}
                            </span>
                          ))
                        ) : (
                          <span style={{ color: '#526b60', fontSize: 10 }}>None</span>
                        )}
                      </div>
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
