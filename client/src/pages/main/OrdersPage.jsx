import { useEffect, useState } from 'react'
import api from '../../api'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [message, setMessage] = useState('Loading orders…')
  useEffect(() => {
    api.get('/orders').then(({ data }) => {
      setOrders(data)
      setMessage(data.length ? '' : 'No orders yet. Create one from the Menu page.')
    }).catch(() => setMessage('Start the server and connect MongoDB to view orders.'))
  }, [])

  return <main className="min-h-screen bg-[#100c0a] px-5 py-8 font-sans text-[#f2e5d8] sm:px-8 lg:px-10">
    <div className="mx-auto max-w-[1280px]"><header><span className="text-xs font-bold tracking-[.2em] text-[#d18b4b]">YOUR ORDERS</span><h1 className="mt-2 font-serif text-5xl">Brewing now.</h1><p className="mt-3 text-sm text-[#c7b3a0]">Track every coffee you create from the menu.</p></header><section className="mt-8 space-y-3">{message && <p className="rounded-2xl border border-[#4d3426] bg-[#1a130f] p-6 text-sm text-[#c7b3a0]">{message}</p>}{orders.map(order => <article className="flex items-center justify-between rounded-2xl border border-[#4d3426] bg-[#1a130f] p-6" key={order._id}><div><span className="text-[10px] font-bold uppercase tracking-wider text-[#d18b4b]">{order.status}</span><h2 className="mt-1 font-serif text-2xl">{order.drink}</h2><p className="text-sm text-[#c7b3a0]">{order.customizations?.size} · {order.customizations?.milk} · {order.customizations?.extraShot ? 'Extra shot' : 'Single shot'}</p></div><div className="text-right"><b>₱{order.total}</b><small className="mt-1 block text-xs text-[#c7b3a0]">Ready in {order.pickupMinutes} min</small></div></article>)}</section></div>
  </main>
}
