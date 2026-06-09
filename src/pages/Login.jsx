import { useState } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { Leaf, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react'
import { useAuth } from '../components/auth'

const HIGHLIGHTS = [
  { icon: TrendingUp, title: 'Real-time insights', desc: 'Track sales, orders & vendors at a glance.' },
  { icon: ShieldCheck, title: '100% Jain & Satvik', desc: 'Curated, onion-garlic-free catalogue.' },
  { icon: Sparkles, title: 'Effortless control', desc: 'Manage products, coupons & banners fast.' },
]

export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to={from} replace />

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password) {
      setError('Please enter your email and password.')
      return
    }
    setLoading(true)
    const res = await login({ email, password })
    setLoading(false)
    if (res.ok) navigate(from, { replace: true })
    else setError(res.error)
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-slate-900">
      {/* Left — brand panel */}
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 lg:flex lg:flex-col lg:justify-between lg:p-12">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-brand-400/20 blur-3xl" />
        <div className="pointer-events-none absolute right-10 top-1/3 text-white/5">
          <Leaf className="h-72 w-72" />
        </div>

        {/* logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
            <Leaf className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-lg font-extrabold leading-none text-white">OJAIN</p>
            <p className="text-xs tracking-wide text-brand-100">Admin Panel</p>
          </div>
        </div>

        {/* headline */}
        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-extrabold leading-tight text-white">
            Run your Jain &amp; Satvik store with ease.
          </h2>
          <p className="mt-4 text-brand-100">
            One dashboard for products, orders, vendors and growth — pure, simple and powerful.
          </p>

          <div className="mt-10 space-y-5">
            {HIGHLIGHTS.map((h) => (
              <div key={h.title} className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15 text-white backdrop-blur">
                  <h.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-white">{h.title}</p>
                  <p className="text-sm text-brand-100">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-brand-200">© 2026 OJAIN. All rights reserved.</p>
      </div>

      {/* Right — form */}
      <div className="flex w-full items-center justify-center px-6 py-10 lg:w-1/2">
        <div className="w-full max-w-sm">
          {/* mobile logo */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <p className="text-lg font-extrabold text-slate-900 dark:text-white">OJAIN</p>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Welcome back 👋</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Sign in to your admin account to continue.</p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-700">
                {error}
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Email address</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  className="input h-12 pl-10"
                  placeholder="admin@ojain.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPw ? 'text' : 'password'}
                  className="input h-12 px-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                Remember me
              </label>
              <button type="button" className="font-medium text-brand-600 hover:text-brand-700">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? 'Signing in…' : 'Sign In'}
              {!loading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
            </button>

            <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <Sparkles className="h-3.5 w-3.5 text-brand-500" />
              Demo — <span className="font-semibold text-slate-700 dark:text-slate-200">admin@ojain.in</span> / <span className="font-semibold text-slate-700 dark:text-slate-200">admin123</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
