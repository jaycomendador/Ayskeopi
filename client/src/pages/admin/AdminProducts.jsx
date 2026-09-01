import { useEffect, useState } from 'react'
import api from '../../api'

/* ── Custom Icons ── */
function RefreshIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" /></svg>
}
function SearchIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
}
function CoffeeIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}><path d="M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" /><line x1="6" y1="2" x2="6" y2="4" /><line x1="10" y1="2" x2="10" y2="4" /><line x1="14" y1="2" x2="14" y2="4" /></svg>
}

export default function AdminProducts() {
  const [coffees, setCoffees] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [refreshing, setRefreshing] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: 'Cold Brew',
    price: '',
    rewardPoints: '',
    image: '',
    available: true,
  })
  const [submitting, setSubmitting] = useState(false)

  const fetchProducts = async (isSilent = false) => {
    if (!isSilent) setLoading(true)
    else setRefreshing(true)
    try {
      // Pass query parameter all=true to get both available and unavailable items
      const { data } = await api.get('/coffees?all=true')
      setCoffees(data || [])
    } catch (err) {
      console.error('Error fetching coffees:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleToggleActive = async (id, currentVal) => {
    try {
      setCoffees(prev => prev.map(c => c._id === id ? { ...c, available: !currentVal } : c))
      await api.patch(`/coffees/${id}`, { available: !currentVal })
    } catch (err) {
      console.error('Could not toggle active state:', err)
      setCoffees(prev => prev.map(c => c._id === id ? { ...c, available: currentVal } : c))
      alert('Failed to update product availability on the server.')
    }
  }

  const handleCreateProduct = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const payload = {
        name: newProduct.name.trim(),
        description: newProduct.description.trim() || 'Freshly crafted coffee.',
        category: newProduct.category,
        price: Number(newProduct.price),
        rewardPoints: Number(newProduct.rewardPoints || 0),
        image: newProduct.image.trim() || '/menu/01_Vanilla_Bean_Cold_Brew.png',
        available: newProduct.available,
      }

      if (!payload.name || Number.isNaN(payload.price) || payload.price <= 0) {
        alert('Please enter a valid product name and price.')
        return
      }

      await api.post('/coffees', payload)
      setShowAddModal(false)
      setNewProduct({
        name: '',
        description: '',
        category: 'Cold Brew',
        price: '',
        rewardPoints: '',
        image: '',
        available: true,
      })
      await fetchProducts(true)
    } catch (err) {
      console.error('Could not create product:', err)
      alert(err.response?.data?.error || 'Failed to create product.')
    } finally {
      setSubmitting(false)
    }
  }

  // Filter coffees list
  const filteredProducts = coffees.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  // Categories list
  const categories = ['All', 'Cold Brew', 'Iced Coffee', 'Iced Espresso', 'Iced Latte', 'Frappé', 'Espresso']

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', color: '#10b981', fontSize: 13 }}>
        <div>Loading product catalog...</div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Search and Filters Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="sm:flex-row sm:items-center sm:justify-between">
        {/* Category filtering pills */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 6 }} className="scrollbar-none">
          {categories.map(cat => {
            const active = categoryFilter === cat
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                style={{
                  background: active ? '#10b981' : '#161a18',
                  color: active ? '#000' : '#9a938d',
                  border: '1px solid rgba(255,255,255,.03)',
                  borderRadius: 20,
                  padding: '6px 14px',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all .2s'
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.color = '#fff'
                    e.currentTarget.style.background = '#1e2420'
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.color = '#9a938d'
                    e.currentTarget.style.background = '#161a18'
                  }
                }}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* Search & Refresh Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#687e74', display: 'flex' }}>
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ background: '#161a18', border: '1px solid rgba(255,255,255,.04)', borderRadius: 10, padding: '8px 12px 8px 34px', fontSize: 12, color: '#fff', width: '100%', minWidth: 180, outline: 'none' }}
            />
          </div>
          
          <button
            onClick={() => fetchProducts(true)}
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
      </div>

      {/* Main product inventory block */}
      <div style={{ background: '#161a18', border: '1px solid rgba(255,255,255,.04)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#687e74', letterSpacing: '0.05em', textTransform: 'uppercase' }}>PRODUCT LIST</span>
            <h3 style={{ margin: '4px 0 0', fontSize: 18, fontWeight: 800, color: '#fff' }}>
              {coffees.length} Coffees <span style={{ fontSize: 11, background: 'rgba(16,185,129,.1)', color: '#10b981', padding: '2px 6px', borderRadius: 20, marginLeft: 6 }}>+{coffees.filter(c => c.available).length} Active</span>
            </h3>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            style={{
              background: '#10b981',
              color: '#000',
              border: 'none',
              borderRadius: 10,
              padding: '10px 16px',
              fontSize: 12,
              fontWeight: 800,
              cursor: 'pointer',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Add Product
          </button>
        </div>

        {/* Scrollable table container */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 600 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,.03)', fontSize: 10, color: '#687e74', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                <th style={{ padding: '14px 24px' }}>Product Info</th>
                <th style={{ padding: '14px 24px' }}>Category</th>
                <th style={{ padding: '14px 24px' }}>Price</th>
                <th style={{ padding: '14px 24px' }}>Points</th>
                <th style={{ padding: '14px 24px' }}>Stock</th>
                <th style={{ padding: '14px 24px' }}>Active Switch</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: 48, textAlign: 'center', color: '#687e74', fontSize: 12 }}>
                    No coffee items matched your filter search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(item => (
                  <tr
                    key={item._id}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,.02)',
                      transition: 'background .2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.01)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Info */}
                    <td style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 14 }}>
                      <img
                        src={item.image || '/menu/01_Vanilla_Bean_Cold_Brew.png'}
                        alt={item.name}
                        style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', background: '#e3d7c9', flexShrink: 0 }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                        <p style={{ margin: '2px 0 0', fontSize: 10, color: '#526b60' }}>ID: {item._id.substring(item._id.length - 8)}</p>
                      </div>
                    </td>

                    {/* Category */}
                    <td style={{ padding: '12px 24px', fontSize: 12, color: '#9a938d' }}>
                      {item.category}
                    </td>

                    {/* Price */}
                    <td style={{ padding: '12px 24px', fontSize: 13, fontWeight: 800, color: '#fff' }}>
                      ₱{item.price}
                    </td>

                    {/* Points */}
                    <td style={{ padding: '12px 24px', fontSize: 12, color: '#10b981', fontWeight: 600 }}>
                      {item.rewardPoints || 10}
                    </td>

                    {/* Stock */}
                    <td style={{ padding: '12px 24px', fontSize: 12, color: '#9a938d' }}>
                      {item.available ? 'Available' : 'Hidden'}
                    </td>

                    {/* Switch availability */}
                    <td style={{ padding: '12px 24px' }}>
                      <button
                        onClick={() => handleToggleActive(item._id, item.available)}
                        style={{
                          background: item.available ? '#10b981' : 'rgba(255,255,255,.05)',
                          border: `1px solid ${item.available ? '#10b981' : 'rgba(255,255,255,.1)'}`,
                          borderRadius: 20,
                          width: 44,
                          height: 22,
                          position: 'relative',
                          cursor: 'pointer',
                          transition: 'all .25s cubic-bezier(.22,1,.36,1)'
                        }}
                      >
                        <span
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            background: item.available ? '#000' : '#9a938d',
                            position: 'absolute',
                            top: 2,
                            left: item.available ? 24 : 2,
                            transition: 'all .25s cubic-bezier(.22,1,.36,1)'
                          }}
                        />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 1000 }}>
          <div style={{ width: '100%', maxWidth: 520, background: '#111714', border: '1px solid rgba(255,255,255,.08)', borderRadius: 18, padding: 24, boxShadow: '0 30px 80px rgba(0,0,0,.6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: '#10b981', letterSpacing: '0.08em', textTransform: 'uppercase' }}>New Product</p>
                <h3 style={{ margin: '6px 0 0', fontSize: 22, fontWeight: 800, color: '#fff' }}>Add Coffee Item</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,.08)', color: '#fff', borderRadius: 8, width: 32, height: 32, cursor: 'pointer' }}>×</button>
            </div>

            <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11, color: '#9a938d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Name
                  <input required value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} style={{ background: '#171d1a', border: '1px solid rgba(255,255,255,.06)', borderRadius: 10, padding: '10px 12px', color: '#fff', outline: 'none' }} />
                </label>

                <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11, color: '#9a938d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Category
                  <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} style={{ background: '#171d1a', border: '1px solid rgba(255,255,255,.06)', borderRadius: 10, padding: '10px 12px', color: '#fff', outline: 'none' }}>
                    {categories.filter(c => c !== 'All').map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </label>
              </div>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11, color: '#9a938d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Description
                <textarea rows={3} value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} style={{ background: '#171d1a', border: '1px solid rgba(255,255,255,.06)', borderRadius: 10, padding: '10px 12px', color: '#fff', outline: 'none', resize: 'vertical' }} />
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11, color: '#9a938d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Price
                  <input required type="number" min="1" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} style={{ background: '#171d1a', border: '1px solid rgba(255,255,255,.06)', borderRadius: 10, padding: '10px 12px', color: '#fff', outline: 'none' }} />
                </label>

                <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11, color: '#9a938d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Reward Points
                  <input type="number" min="0" value={newProduct.rewardPoints} onChange={(e) => setNewProduct({ ...newProduct, rewardPoints: e.target.value })} style={{ background: '#171d1a', border: '1px solid rgba(255,255,255,.06)', borderRadius: 10, padding: '10px 12px', color: '#fff', outline: 'none' }} />
                </label>
              </div>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11, color: '#9a938d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Image URL
                <input value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} placeholder="/menu/01_Vanilla_Bean_Cold_Brew.png" style={{ background: '#171d1a', border: '1px solid rgba(255,255,255,.06)', borderRadius: 10, padding: '10px 12px', color: '#fff', outline: 'none' }} />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#e8e2d8' }}>
                <input type="checkbox" checked={newProduct.available} onChange={(e) => setNewProduct({ ...newProduct, available: e.target.checked })} />
                Available in menu
              </label>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,.08)', color: '#9a938d', borderRadius: 10, padding: '10px 16px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={submitting} style={{ background: '#10b981', color: '#000', border: 'none', borderRadius: 10, padding: '10px 18px', cursor: 'pointer', fontWeight: 800 }}>{submitting ? 'Saving...' : 'Save Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
