import { useEffect, useState } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, TrendingDown, IndianRupee, ShoppingCart, Users, Store, ArrowUpRight } from 'lucide-react'
import { StatusBadge } from '../components/ui'
import { useAuth } from '../components/auth'
import { api } from '../api/client'

const ICONS = { revenue: IndianRupee, orders: ShoppingCart, customers: Users, vendors: Store }
const ACCENTS = {
  revenue: 'from-emerald-500 to-green-600',
  orders: 'from-sky-500 to-blue-600',
  customers: 'from-violet-500 to-purple-600',
  vendors: 'from-amber-500 to-orange-600',
}
const PIE_COLORS = ['#16a34a', '#4ade80', '#86efac', '#bbf7d0', '#22c55e', '#15803d']

function StatCard({ s }) {
  const Icon = ICONS[s.key] || IndianRupee
  const Trend = s.up ? TrendingUp : TrendingDown
  return (
    <div className="card group relative overflow-hidden p-5">
      <div className={`absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br opacity-10 transition-transform group-hover:scale-125 ${ACCENTS[s.key]}`} />
      <div className="relative flex items-start justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm ${ACCENTS[s.key]}`}>
          <Icon className="h-6 w-6" />
        </div>
        {s.delta && (
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${s.up ? 'bg-brand-100 text-brand-700' : 'bg-rose-100 text-rose-600'}`}>
            <Trend className="h-3.5 w-3.5" />
            {s.delta}
          </span>
        )}
      </div>
      <p className="relative mt-4 text-sm text-slate-500 dark:text-slate-400">{s.label}</p>
      <p className="relative mt-0.5 text-2xl font-extrabold text-slate-900 dark:text-white">{s.value}</p>
    </div>
  )
}

const EMPTY = { stats: [], salesData: [], categorySplit: [], recentOrders: [], topProducts: [] }

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const firstName = (user?.name || 'Admin').split(' ')[0]

  const [data, setData] = useState(EMPTY)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const [stats, overview, reports] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/overview'),
          api.get('/dashboard/reports'),
        ])
        if (!alive) return

        const cats = overview.data?.productsByCategory || []
        const totalCat = cats.reduce((sum, c) => sum + (c.value || 0), 0) || 1
        const categorySplit = cats.map((c) => ({ name: c.name || 'Uncategorised', value: c.value, pct: Math.round((c.value / totalCat) * 100) }))

        setData({
          stats: stats.data || [],
          salesData: overview.data?.salesByMonth || [],
          categorySplit,
          recentOrders: overview.data?.recentOrders || [],
          topProducts: reports.data?.topProducts || [],
        })
      } catch (e) {
        if (alive) setError(e.message)
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  const { stats, salesData, categorySplit, recentOrders, topProducts } = data

  return (
    <div>
      {/* Hero greeting */}
      <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 right-1/3 h-48 w-48 rounded-full bg-brand-400/20 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-brand-100">Welcome back,</p>
            <h1 className="text-2xl font-extrabold text-white sm:text-3xl">{firstName} 👋</h1>
            <p className="mt-1 max-w-md text-sm text-brand-100">
              Here's what's happening at OJAIN today — {recentOrders.length} recent order{recentOrders.length === 1 ? '' : 's'} to review.
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/orders')} className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-brand-700 shadow-sm transition-colors hover:bg-brand-50">
              View Orders
            </button>
            <button onClick={() => navigate('/reports')} className="rounded-xl bg-white/15 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/25">
              Reports
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Couldn't load live data: {error}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="card h-32 animate-pulse bg-slate-100 dark:bg-slate-800" />)
          : stats.map((s) => <StatCard key={s.key} s={s} />)}
      </div>

      {/* Charts */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">Revenue Overview</h3>
            <span className="badge bg-brand-100 text-brand-700">2026</span>
          </div>
          {salesData.length === 0 ? (
            <EmptyChart label="No revenue yet" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={salesData} margin={{ left: -10, right: 10 }}>
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="sales" stroke="#16a34a" strokeWidth={2} fill="url(#g)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card p-5">
          <h3 className="mb-4 font-semibold text-slate-800">Products by Category</h3>
          {categorySplit.length === 0 ? (
            <EmptyChart label="No categories yet" />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={categorySplit} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                    {categorySplit.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 space-y-2">
                {categorySplit.map((c, i) => (
                  <div key={c.name} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      {c.name}
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{c.value} ({c.pct}%)</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom: recent orders + top products */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">Recent Orders</h3>
            <button onClick={() => navigate('/orders')} className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700">
              View all <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
          {recentOrders.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase text-slate-400">
                  <tr>
                    <th className="pb-2 font-semibold">Order</th>
                    <th className="pb-2 font-semibold">Customer</th>
                    <th className="pb-2 font-semibold">Total</th>
                    <th className="pb-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="transition-colors hover:bg-slate-50">
                      <td className="py-2.5 font-medium text-slate-700 dark:text-slate-200">{o.code || `#${String(o.id).slice(-6)}`}</td>
                      <td className="py-2.5 text-slate-600 dark:text-slate-400">{o.customer}</td>
                      <td className="py-2.5 font-semibold text-slate-700 dark:text-slate-200">₹{o.total}</td>
                      <td className="py-2.5"><StatusBadge value={o.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card p-5">
          <h3 className="mb-4 font-semibold text-slate-800">Top Products</h3>
          {topProducts.length === 0 ? (
            <EmptyChart label="No products yet" />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={topProducts} layout="vertical" margin={{ left: 10, right: 10 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="sold" fill="#16a34a" radius={[0, 6, 6, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}

function EmptyChart({ label }) {
  return (
    <div className="flex h-[220px] items-center justify-center text-sm text-slate-400">{label}</div>
  )
}
