import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './components/Navbar'
import api from './api'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setMessage('')
    try {
      const { data } = await api.post('/auth/forgot-password', { email })
      setMessage(data.message)
    } catch (error) {
      setMessage(error.response?.data?.error || 'We could not process that request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return <main className="min-h-screen bg-[#292826] px-4 pb-8 font-sans text-[#e7e2dd] sm:px-6"><Navbar onEnter={() => navigate('/')} onLogin={() => navigate('/login')} onRegister={() => navigate('/register')} /><section className="mx-auto mt-5 w-full max-w-md rounded-2xl border border-white/10 bg-[#33312f] p-6 shadow-2xl shadow-black/20 sm:mt-8 sm:p-8"><p className="text-[10px] font-semibold tracking-[.2em] text-[#cdbbab]">ACCOUNT RECOVERY</p><h1 className="mt-2 font-serif text-3xl">Forgot password?</h1><p className="mt-3 text-sm leading-6 text-[#d5ccc5]/75">Enter the email address used for your account and we’ll send password reset instructions.</p><form className="mt-6 space-y-4" onSubmit={submit}><label className="block text-xs font-medium">Email address<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/[.06] px-3 py-2.5 text-sm outline-none focus:border-[#cdbbab]" placeholder="you@example.com" /></label><button disabled={isSubmitting} className="w-full rounded-lg bg-[#e0ddd8] px-4 py-2.5 text-sm font-bold text-[#302f2d] transition hover:bg-white disabled:opacity-70">{isSubmitting ? 'Sending…' : 'Send reset instructions'}</button></form>{message && <p role="status" className="mt-4 rounded-lg bg-white/10 p-3 text-xs leading-5 text-[#e0d8d1]">{message}</p>}<p className="mt-5 text-xs text-[#d5ccc5]/70"><Link className="font-semibold text-[#e0ddd8]" to="/login">Back to sign in</Link></p></section></main>
}
