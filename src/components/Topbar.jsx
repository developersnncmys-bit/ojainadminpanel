import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Bell, Search, Sun, Moon, Package, ShoppingCart, Star, User, Settings as SettingsIcon, LogOut, ChevronDown } from 'lucide-react'
import { useToast } from './toast'
import { useAuth } from './auth'
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
  const [query, setQuery] = useState('')
  const [dark, setDark] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)
  const [unread, setUnread] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const bellRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    const onClick = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false)
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
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

  const toggleTheme = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    toast(`${next ? 'Dark' : 'Light'} mode enabled`, 'info')
  }

  const openBell = () => {
    setBellOpen((o) => !o)
    setUnread(false)
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 sm:px-6">
      <button
        onClick={onMenu}
        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
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
        <button onClick={toggleTheme} title="Toggle theme" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
          {dark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </button>

        <div className="relative" ref={bellRef}>
          <button onClick={openBell} className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100">
            <Bell className="h-5 w-5" />
            {unread && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500" />}
          </button>
          {bellOpen && (
            <div className="absolute right-0 mt-2 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
              <div className="border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-800">Notifications</div>
              <div className="divide-y divide-slate-100">
                {NOTIFICATIONS.map((n) => {
                  const Icon = n.icon
                  return (
                    <button
                      key={n.id}
                      onClick={() => { navigate(n.to); setBellOpen(false) }}
                      className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-slate-50"
                    >
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-sm text-slate-700">{n.text}</span>
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
            className="flex items-center gap-2 rounded-lg px-1 py-1 hover:bg-slate-100"
          >
            <img src="https://i.pravatar.cc/64?img=12" alt="" className="h-8 w-8 rounded-full" />
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold leading-none text-slate-800">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-slate-400">{user?.role || 'Super Admin'}</p>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-semibold text-slate-800">{user?.name || 'Admin User'}</p>
                <p className="truncate text-xs text-slate-400">{user?.email || 'admin@ojain.in'}</p>
              </div>
              <button onClick={() => { setMenuOpen(false); navigate('/settings') }} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-slate-600 hover:bg-slate-50">
                <User className="h-4 w-4" /> Profile
              </button>
              <button onClick={() => { setMenuOpen(false); navigate('/settings') }} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-slate-600 hover:bg-slate-50">
                <SettingsIcon className="h-4 w-4" /> Settings
              </button>
              <button onClick={signOut} className="flex w-full items-center gap-2.5 border-t border-slate-100 px-4 py-2.5 text-left text-sm text-rose-600 hover:bg-rose-50">
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
