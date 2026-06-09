import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { Download } from 'lucide-react'
import { PageHeader } from '../components/ui'
import { useToast } from '../components/toast'
import { salesData, topProducts } from '../data/mockData'

function toCSV(rows) {
  const headers = Object.keys(rows[0])
  const escape = (v) => {
    const s = String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  return [headers.join(','), ...rows.map((r) => headers.map((h) => escape(r[h])).join(','))].join('\n')
}

export default function Reports() {
  const toast = useToast()

  const exportCSV = () => {
    const csv = toCSV(topProducts)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ojain-top-products.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast('Exported ojain-top-products.csv')
  }

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Sales and performance analytics"
        action={<button onClick={exportCSV} className="btn-ghost"><Download className="h-4 w-4" /> Export CSV</button>}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Avg. Order Value', value: '₹259' },
          { label: 'Conversion Rate', value: '3.8%' },
          { label: 'Repeat Customers', value: '42%' },
        ].map((k) => (
          <div key={k.label} className="card p-5">
            <p className="text-sm text-slate-500 dark:text-slate-400">{k.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h3 className="mb-4 font-semibold text-slate-800 dark:text-slate-100">Monthly Orders</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={salesData} margin={{ left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="orders" fill="#16a34a" radius={[6, 6, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="mb-4 font-semibold text-slate-800 dark:text-slate-100">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={salesData} margin={{ left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#16a34a" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 card p-5">
        <h3 className="mb-4 font-semibold text-slate-800 dark:text-slate-100">Top Performing Products</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-400">
              <tr>
                <th className="pb-2 font-semibold">Product</th>
                <th className="pb-2 font-semibold">Units Sold</th>
                <th className="pb-2 font-semibold">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {topProducts.map((p) => (
                <tr key={p.name}>
                  <td className="py-2.5 font-medium text-slate-700 dark:text-slate-200">{p.name}</td>
                  <td className="py-2.5 text-slate-600 dark:text-slate-400">{p.sold.toLocaleString('en-IN')}</td>
                  <td className="py-2.5 font-semibold text-slate-700 dark:text-slate-200">₹{p.revenue.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
