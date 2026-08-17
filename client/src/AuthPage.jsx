import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './components/Navbar'
import api from './api'

export default function AuthPage({ mode }) {
  const isLogin = mode === 'login'
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const updateField = (event) => setForm(current => ({ ...current, [event.target.name]: event.target.value }))

  async function submit(event) {
    event.preventDefault()
    setMessage('')
    setIsSubmitting(true)
    try {
      const payload = isLogin ? { email: form.email, password: form.password } : form
      const { data } = await api.post(isLogin ? '/auth/login' : '/auth/register', payload)
      localStorage.setItem('ayskeopiUser', JSON.stringify(data.user))
      setMessage(isLogin ? 'Welcome back — opening your coffee ritual.' : 'Your account is ready — welcome to Ayskeopi.')
      setTimeout(() => navigate('/app'), 450)
    } catch (error) {
      setMessage(error.response?.data?.error || 'We could not complete that request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return <main className="min-h-screen bg-[#292826] px-4 pb-8 font-sans text-[#e7e2dd] sm:px-6">
    <Navbar onEnter={() => navigate('/')} onLogin={() => navigate('/login')} onRegister={() => navigate('/register')} />
    <section className="mx-auto mt-5 grid w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-[#33312f] shadow-2xl shadow-black/20 md:mt-8 md:min-h-[430px] md:grid-cols-2">
      <div className="hidden bg-[radial-gradient(circle_at_50%_30%,#76533f,#41302a_45%,#292826_80%)] p-8 md:block"><span className="text-[10px] tracking-[.2em] text-[#d5c8bd]">AYSKEOPI COFFEE</span><h1 className="mt-6 font-serif text-4xl leading-none">Coffee made<br />for your<br /><em>moment.</em></h1><p className="mt-5 max-w-xs text-xs leading-5 text-[#d5ccc5]/80">Save your favorites, track your coffee passport, and make every visit count.</p></div>
      <div className="p-6 sm:p-8"><p className="text-[10px] font-semibold tracking-[.2em] text-[#cdbbab]">{isLogin ? 'WELCOME BACK' : 'JOIN AYSKEOPI'}</p><h2 className="mt-2 font-serif text-3xl">{isLogin ? 'Sign in' : 'Create account'}</h2>
        <form className="mt-6 space-y-3" onSubmit={submit}>{!isLogin && <label className="block text-xs font-medium">Full name<input required name="name" value={form.name} onChange={updateField} className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/[.06] px-3 py-2.5 text-sm outline-none focus:border-[#cdbbab]" placeholder="Your name" /></label>}<label className="block text-xs font-medium">Email address<input required name="email" value={form.email} onChange={updateField} type="email" autoComplete="email" className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/[.06] px-3 py-2.5 text-sm outline-none focus:border-[#cdbbab]" placeholder="you@example.com" /></label><label className="block text-xs font-medium">Password<input required name="password" value={form.password} onChange={updateField} minLength="6" type="password" autoComplete={isLogin ? 'current-password' : 'new-password'} className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/[.06] px-3 py-2.5 text-sm outline-none focus:border-[#cdbbab]" placeholder="••••••••" /></label><button disabled={isSubmitting} className="w-full rounded-lg bg-[#e0ddd8] px-4 py-2.5 text-sm font-bold text-[#302f2d] transition hover:bg-white disabled:cursor-wait disabled:opacity-70">{isSubmitting ? 'Please wait…' : isLogin ? 'Sign in →' : 'Create my account →'}</button></form>
        {message && <p role="status" className="mt-3 rounded-lg bg-white/10 p-3 text-xs text-[#e0d8d1]">{message}</p>}<p className="mt-5 text-xs text-[#d5ccc5]/70">{isLogin ? 'New here?' : 'Already have an account?'} <Link className="font-semibold text-[#e0ddd8]" to={isLogin ? '/register' : '/login'}>{isLogin ? 'Create one' : 'Sign in'}</Link></p>
      </div>
    </section>
  </main>
}
