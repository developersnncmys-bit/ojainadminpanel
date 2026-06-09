import { useState } from 'react'
import { Mail } from 'lucide-react'
import { PageHeader, SearchBox, StatusBadge, DataTable } from '../components/ui'
import { useToast } from '../components/toast'
import { customers } from '../data/mockData'

export default function Customers() {
  const toast = useToast()
  const [q, setQ] = useState('')
  const rows = customers.filter(
    (c) => c.name.toLowerCase().includes(q.toLowerCase()) || c.city.toLowerCase().includes(q.toLowerCase()),
  )

  const email = (c) => {
    window.location.href = `mailto:${c.email}?subject=${encodeURIComponent('OJAIN — A note for you')}`
    toast(`Opening email to ${c.name}`, 'info')
  }

  const columns = [
    { key: 'name', header: 'Customer', render: (r) => (
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
          {r.name.split(' ').map((n) => n[0]).join('')}
        </div>
        <div>
          <p className="font-semibold text-slate-800">{r.name}</p>
          <p className="text-xs text-slate-400">{r.email}</p>
        </div>
      </div>
    )},
    { key: 'city', header: 'City' },
    { key: 'orders', header: 'Orders' },
    { key: 'spent', header: 'Total Spent', render: (r) => <span className="font-semibold">₹{r.spent.toLocaleString('en-IN')}</span> },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge value={r.status} /> },
    { key: 'actions', header: '', render: (r) => (
      <button onClick={() => email(r)} title={`Email ${r.email}`} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-brand-600"><Mail className="h-4 w-4" /></button>
    )},
  ]

  return (
    <div>
      <PageHeader title="Customers" subtitle={`${customers.length} registered customers`} />
      <div className="mb-4">
        <SearchBox value={q} onChange={setQ} placeholder="Search customers, city…" />
      </div>
      <DataTable columns={columns} rows={rows} />
    </div>
  )
}
