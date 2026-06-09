import { useMemo, useState } from 'react'
import { Star, Check, X } from 'lucide-react'
import { PageHeader, SearchBox, StatusBadge, DataTable } from '../components/ui'
import { useToast } from '../components/toast'
import { vendors as seed } from '../data/mockData'

export default function Vendors() {
  const toast = useToast()
  const [items, setItems] = useState(seed)
  const [q, setQ] = useState('')

  const rows = useMemo(
    () =>
      items.filter(
        (v) => v.name.toLowerCase().includes(q.toLowerCase()) || v.owner.toLowerCase().includes(q.toLowerCase()),
      ),
    [items, q],
  )

  const setStatus = (v, status) => {
    setItems((prev) => prev.map((x) => (x.id === v.id ? { ...x, status } : x)))
    toast(`${v.name} ${status === 'Approved' ? 'approved' : 'rejected'}`, status === 'Approved' ? 'success' : 'info')
  }

  const pending = items.filter((v) => v.status === 'Pending').length

  const columns = [
    { key: 'name', header: 'Vendor', render: (r) => (
      <div>
        <p className="font-semibold text-slate-800">{r.name}</p>
        <p className="text-xs text-slate-400">Owner: {r.owner}</p>
      </div>
    )},
    { key: 'products', header: 'Products' },
    { key: 'sales', header: 'Sales', render: (r) => <span className="font-semibold">₹{r.sales.toLocaleString('en-IN')}</span> },
    { key: 'rating', header: 'Rating', render: (r) => (
      r.rating ? (
        <span className="inline-flex items-center gap-1 font-medium text-slate-700">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {r.rating}
        </span>
      ) : <span className="text-slate-300">—</span>
    )},
    { key: 'status', header: 'Status', render: (r) => <StatusBadge value={r.status} /> },
    { key: 'actions', header: '', render: (r) => (
      r.status === 'Pending' ? (
        <div className="flex gap-1">
          <button onClick={() => setStatus(r, 'Approved')} title="Approve" className="rounded-md p-1.5 text-brand-600 hover:bg-brand-50"><Check className="h-4 w-4" /></button>
          <button onClick={() => setStatus(r, 'Rejected')} title="Reject" className="rounded-md p-1.5 text-rose-600 hover:bg-rose-50"><X className="h-4 w-4" /></button>
        </div>
      ) : <span className="text-xs text-slate-300">—</span>
    )},
  ]

  return (
    <div>
      <PageHeader
        title="Vendors"
        subtitle={`${items.length} vendors · ${pending} awaiting approval`}
      />
      <div className="mb-4">
        <SearchBox value={q} onChange={setQ} placeholder="Search vendors…" />
      </div>
      <DataTable columns={columns} rows={rows} />
    </div>
  )
}
