import { NavLink } from 'react-router-dom'
import { Leaf, X } from 'lucide-react'
import { navItems } from '../nav'
import { useAuth } from './auth'

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth()
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-900 text-slate-300 transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="flex h-16 items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-base font-extrabold leading-none text-white">OJAIN</p>
              <p className="text-[11px] tracking-wide text-slate-400">Admin Panel</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map(({ to, label, icon: Icon, end, badge }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="flex-1">{label}</span>
              {badge && (
                <span className="badge bg-brand-500/20 text-brand-300">{badge}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/64?img=12"
              alt="Admin"
              className="h-9 w-9 rounded-full"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{user?.name || 'Admin User'}</p>
              <p className="truncate text-xs text-slate-400">{user?.email || 'admin@ojain.in'}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
