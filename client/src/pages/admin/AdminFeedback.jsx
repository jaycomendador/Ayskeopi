import { useEffect, useState } from 'react'
import api from '../../api'

/* ── Custom Icons ── */
function RefreshIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" /></svg>
}

export default function AdminFeedback() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchReviews = async (isSilent = false) => {
    if (!isSilent) setLoading(true)
    else setRefreshing(true)
    try {
      const { data } = await api.get('/reviews')
      setReviews(data || [])
    } catch (err) {
      console.error('Error fetching reviews:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  // Calculate rating distribution
  const totalCount = reviews.length || 1
  const ratingsCount = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.forEach(r => {
    const rate = Math.round(r.rating)
    if (ratingsCount[rate] !== undefined) {
      ratingsCount[rate]++
    }
  })

  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1)

  // Format date helper
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })
    } catch {
      return dateString
    }
  }

  // Star rating helper
  const renderStars = (count) => {
    const stars = []
    const rounded = Math.round(count)
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= rounded ? '#f59e0b' : '#3a3530', fontSize: 13, marginRight: 2 }}>
          ★
        </span>
      )
    }
    return stars
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', color: '#10b981', fontSize: 13 }}>
        <div>Loading customer reviews...</div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }} className="md:grid-cols-3">
        {/* Average Rating Scorecard */}
        <div style={{ background: '#161a18', border: '1px solid rgba(255,255,255,.04)', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <span style={{ fontSize: 10, color: '#687e74', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Average Customer Score</span>
          <strong style={{ fontSize: 44, fontWeight: 900, color: '#fff', margin: '8px 0 4px' }}>{averageRating}</strong>
          <div style={{ display: 'flex', marginBottom: 8 }}>{renderStars(averageRating)}</div>
          <span style={{ fontSize: 11, color: '#526b60' }}>Based on {reviews.length} reviews</span>
        </div>

        {/* Rating Distribution Bar Chart */}
        <div style={{ background: '#161a18', border: '1px solid rgba(255,255,255,.04)', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 8, colSpan: 2 }} className="md:col-span-2">
          <span style={{ fontSize: 10, color: '#687e74', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Score Breakdown</span>
          
          {[5, 4, 3, 2, 1].map(stars => {
            const count = ratingsCount[stars]
            const percentage = Math.round((count / totalCount) * 100)
            return (
              <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11 }}>
                <span style={{ minWidth: 40, color: '#9a938d', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {stars} ★
                </span>
                <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,.03)', borderRadius: 10, overflow: 'hidden' }}>
                  <div style={{ width: `${percentage}%`, height: '100%', background: '#10b981', borderRadius: 10 }} />
                </div>
                <span style={{ minWidth: 28, color: '#687e74', textAlign: 'right' }}>{count}</span>
                <span style={{ minWidth: 32, color: '#526b60', textAlign: 'right' }}>{percentage}%</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Header and Refresh controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#fff' }}>Customer Comments &amp; Review Queue</h4>
        <button
          onClick={() => fetchReviews(true)}
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

      {/* Reviews list block */}
      <div style={{ background: '#161a18', border: '1px solid rgba(255,255,255,.04)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 600 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,.03)', fontSize: 10, color: '#687e74', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                <th style={{ padding: '14px 20px', width: '120px' }}>Date</th>
                <th style={{ padding: '14px 20px', width: '180px' }}>User Info</th>
                <th style={{ padding: '14px 20px', width: '130px' }}>Rating</th>
                <th style={{ padding: '14px 20px' }}>Review Comment</th>
              </tr>
            </thead>
            <tbody>
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: 48, textAlign: 'center', color: '#687e74', fontSize: 12 }}>
                    No reviews in the database.
                  </td>
                </tr>
              ) : (
                reviews.map(review => (
                  <tr
                    key={review._id}
                    style={{ borderBottom: '1px solid rgba(255,255,255,.02)', fontSize: 12 }}
                  >
                    {/* Date */}
                    <td style={{ padding: '14px 20px', color: '#9a938d' }}>
                      {formatDate(review.createdAt)}
                    </td>

                    {/* User Info */}
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontWeight: 700, color: '#fff' }}>{review.user?.name || 'Guest customer'}</div>
                      <div style={{ fontSize: 10, color: '#526b60' }}>{review.user?.email || 'guest@ayskeopi.com'}</div>
                    </td>

                    {/* Stars */}
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex' }}>
                        {renderStars(review.rating)}
                      </div>
                      <div style={{ fontSize: 10, color: '#526b60', marginTop: 2 }}>{review.rating} out of 5</div>
                    </td>

                    {/* Comment */}
                    <td style={{ padding: '14px 20px', color: '#ddd7d0', lineHeight: 1.6 }}>
                      {review.comment || <em style={{ color: '#526b60' }}>No comments left</em>}
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
