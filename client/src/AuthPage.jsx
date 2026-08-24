import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import api from './api'

function InputIcon({ type }) {
  const paths = {
    user: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0" />,
    email: <path d="M3 5h18v14H3zM3 7l9 6 9-6" />,
    lock: <path d="M6 10V7a6 6 0 0 1 12 0v3M5 10h14v10H5z" />,
  }

  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">{paths[type]}</svg>
}

function EyeIcon({ hidden }) {
  return hidden
    ? <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 4.2A10.8 10.8 0 0 1 12 4c5 0 8.7 4.3 9.7 6.2a1.7 1.7 0 0 1 0 1.6 16 16 0 0 1-3 3.8M6.1 6.1A16 16 0 0 0 2.3 10.2a1.7 1.7 0 0 0 0 1.6C3.3 13.7 7 18 12 18c.8 0 1.6-.1 2.3-.4" /></svg>
    : <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M2.3 10.2C3.3 8.3 7 4 12 4s8.7 4.3 9.7 6.2a1.7 1.7 0 0 1 0 1.6C20.7 13.7 17 18 12 18s-8.7-4.3-9.7-6.2a1.7 1.7 0 0 1 0-1.6Z" /><circle cx="12" cy="11" r="3" /></svg>
}

export default function AuthPage({ mode }) {
  const isLogin = mode === 'login'
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const updateField = (event) => setForm(current => ({ ...current, [event.target.name]: event.target.value }))

  async function submit(event) {
    event.preventDefault()
    setMessage('')
    setIsSubmitting(true)
    try {
      const payload = isLogin ? { email: form.email, password: form.password } : form
      const { data } = await api.post(isLogin ? '/auth/login' : '/auth/register', payload)
      sessionStorage.setItem('ayskeopiUser', JSON.stringify(data.user))
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
        <form className="mt-6 space-y-3" onSubmit={submit}>
          {!isLogin && <label className="block text-xs font-medium">Full name<div className="relative mt-1.5"><span className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center text-[#cdbbab]"><InputIcon type="user" /></span><input required name="name" value={form.name} onChange={updateField} className="w-full rounded-lg border border-white/10 bg-white/[.06] py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#cdbbab]" placeholder="Your name" /></div></label>}
          <label className="block text-xs font-medium">Email address<div className="relative mt-1.5"><span className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center text-[#cdbbab]"><InputIcon type="email" /></span><input required name="email" value={form.email} onChange={updateField} type="email" autoComplete="email" className="w-full rounded-lg border border-white/10 bg-white/[.06] py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#cdbbab]" placeholder="you@example.com" /></div></label>
          <label className="block text-xs font-medium">Password<div className="relative mt-1.5"><span className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center text-[#cdbbab]"><InputIcon type="lock" /></span><input required name="password" value={form.password} onChange={updateField} minLength="6" type={showPassword ? 'text' : 'password'} autoComplete={isLogin ? 'current-password' : 'new-password'} className="w-full rounded-lg border border-white/10 bg-white/[.06] py-2.5 pl-10 pr-11 text-sm outline-none focus:border-[#cdbbab]" placeholder="••••••••" /><button type="button" onClick={() => setShowPassword(visible => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute inset-y-0 right-3 grid place-items-center text-[#cdbbab] transition hover:text-white"><EyeIcon hidden={showPassword} /></button></div></label>
          <button disabled={isSubmitting} className="w-full rounded-lg bg-[#e0ddd8] px-4 py-2.5 text-sm font-bold text-[#302f2d] transition hover:bg-white disabled:cursor-wait disabled:opacity-70">{isSubmitting ? 'Please wait…' : isLogin ? 'Sign in →' : 'Create my account →'}</button>
        </form>
        {message && <p role="status" className="mt-3 rounded-lg bg-white/10 p-3 text-xs text-[#e0d8d1]">{message}</p>}
        {isLogin && <p className="mt-4 text-right text-xs"><Link className="font-semibold text-[#e0ddd8]" to="/forgot-password">Forgot password?</Link></p>}
        <p className="mt-5 text-xs text-[#d5ccc5]/70">{isLogin ? 'New here?' : 'Already have an account?'} <Link className="font-semibold text-[#e0ddd8]" to={isLogin ? '/register' : '/login'}>{isLogin ? 'Create one' : 'Sign in'}</Link></p>
      </div>
    </section>
  </main>
}
