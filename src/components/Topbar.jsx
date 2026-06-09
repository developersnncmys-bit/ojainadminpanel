import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Bell, Search, Sun, Moon, Monitor, Check, Package, ShoppingCart, Star, User, Settings as SettingsIcon, LogOut, ChevronDown, CalendarDays } from 'lucide-react'
import { useToast } from './toast'
import { useAuth } from './auth'
import { useTheme } from './theme'
import { navItems } from '../nav'

const NOTIFICATIONS = [
  { id: 1, icon: ShoppingCart, text: 'New order #ORD-7841 placed', time: '2m ago', to: '/orders' },
  { id: 2, icon: Package, text: 'Mango Pickle (Jain) is out of stock', time: '1h ago', to: '/products' },
  { id: 3, icon: Star, text: '2 reviews awaiting moderation', time: '3h ago', to: '/reviews' },
]

export default function Topbar({ onMenu }) {
  const navigate = useNavigate()
  const toast = useToast()
  const { user, logout } = useAuth()
  const { choice, isDark, setTheme } = useTheme()
  const [query, setQuery] = useState('')
  const [bellOpen, setBellOpen] = useState(false)
  const [unread, setUnread] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [themeOpen, setThemeOpen] = useState(false)
  const bellRef = useRef(null)
  const menuRef = useRef(null)
  const themeRef = useRef(null)

  useEffect(() => {
    const onClick = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false)
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
      if (themeRef.current && !themeRef.current.contains(e.target)) setThemeOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const signOut = () => {
    setMenuOpen(false)
    logout()
    toast('Signed out', 'info')
    navigate('/login', { replace: true })
  }

  const submitSearch = (e) => {
    e.preventDefault()
    const term = query.trim().toLowerCase()
    if (!term) return
    const match = navItems.find((n) => n.label.toLowerCase().includes(term))
    if (match) {
      navigate(match.to)
      toast(`Showing ${match.label}`, 'info')
    } else {
      toast(`No results for “${query}”`, 'error')
    }
    setQuery('')
  }

  const pickTheme = (value, label) => {
    setTheme(value)
    setThemeOpen(false)
    toast(`${label} mode enabled`, 'info')
  }

  const THEME_OPTIONS = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ]

  const openBell = () => {
    setBellOpen((o) => !o)
    setUnread(false)
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900 sm:px-6">
      <button
        onClick={onMenu}
        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <form onSubmit={submitSearch} className="relative hidden flex-1 max-w-md sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          className="input pl-9"
          placeholder="Search products, orders, customers…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <Clock />

        <div className="relative" ref={themeRef}>
          <button
            onClick={() => setThemeOpen((o) => !o)}
            title="Theme"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-amber-400 dark:hover:bg-slate-800"
          >
            {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>
          {themeOpen && (
            <div className="absolute right-0 mt-2 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-card dark:border-slate-800 dark:bg-slate-900">
              {THEME_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => pickTheme(opt.value, opt.label)}
                  className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800 ${
                    choice === opt.value ? 'font-semibold text-brand-600 dark:text-brand-400' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <opt.icon className="h-4 w-4" />
                  <span className="flex-1">{opt.label}</span>
                  {choice === opt.value && <Check className="h-4 w-4" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative" ref={bellRef}>
          <button onClick={openBell} className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
            <Bell className="h-5 w-5" />
            {unread && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500" />}
          </button>
          {bellOpen && (
            <div className="absolute right-0 mt-2 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-800 dark:border-slate-800 dark:text-slate-100">Notifications</div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {NOTIFICATIONS.map((n) => {
                  const Icon = n.icon
                  return (
                    <button
                      key={n.id}
                      onClick={() => { navigate(n.to); setBellOpen(false) }}
                      className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-sm text-slate-700 dark:text-slate-300">{n.text}</span>
                        <span className="text-xs text-slate-400">{n.time}</span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="relative ml-1" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg px-1 py-1 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <img src="https://i.pravatar.cc/64?img=12" alt="" className="h-8 w-8 rounded-full" />
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold leading-none text-slate-800 dark:text-slate-100">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-slate-400">{user?.role || 'Super Admin'}</p>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{user?.name || 'Admin User'}</p>
                <p className="truncate text-xs text-slate-400">{user?.email || 'admin@ojain.in'}</p>
              </div>
              <button onClick={() => { setMenuOpen(false); navigate('/settings') }} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">
                <User className="h-4 w-4" /> Profile
              </button>
              <button onClick={() => { setMenuOpen(false); navigate('/settings') }} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">
                <SettingsIcon className="h-4 w-4" /> Settings
              </button>
              <button onClick={signOut} className="flex w-full items-center gap-2.5 border-t border-slate-100 px-4 py-2.5 text-left text-sm text-rose-600 hover:bg-rose-50 dark:border-slate-800 dark:hover:bg-rose-950/40">
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

// Live date + time clock shown in the header.
function Clock() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const time = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
  const date = now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="mr-1 hidden items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 dark:border-slate-700 md:flex">
      <CalendarDays className="h-4 w-4 text-brand-500" />
      <div className="leading-tight">
        <p className="text-sm font-semibold tabular-nums text-slate-800 dark:text-slate-100">{time}</p>
        <p className="text-[11px] text-slate-400">{date}</p>
      </div>
    </div>
  )
}
