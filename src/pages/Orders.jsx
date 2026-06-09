import { useMemo, useState } from 'react'
import { Eye } from 'lucide-react'
import { PageHeader, SearchBox, StatusBadge, DataTable, Modal, Select } from '../components/ui'
import { useToast } from '../components/toast'
import { useResource } from '../hooks/useResource'
import { api } from '../api/client'

const FILTERS = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

export default function Orders() {
  const toast = useToast()
  const { items, loading, action } = useResource('orders')
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('All')
  const [viewing, setViewing] = useState(null)

  const rows = useMemo(
    () =>
      items.filter((o) => {
        const matchQ = (o.code || '').toLowerCase().includes(q.toLowerCase()) || o.customer?.toLowerCase().includes(q.toLowerCase())
        const matchF = filter === 'All' || o.status === filter
        return matchQ && matchF
      }),
    [items, q, filter],
  )

  const updateStatus = async (id, status) => {
    try {
      await action(api.patch(`/orders/${id}/status`, { status }))
      setViewing((v) => (v && v.id === id ? { ...v, status } : v))
      toast(`Order marked ${status}`)
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  const columns = [
    { key: 'code', header: 'Order ID', render: (r) => <span className="font-semibold text-slate-800 dark:text-slate-100">{r.code || `#${r.id?.slice(-6)}`}</span> },
    { key: 'customer', header: 'Customer' },
    { key: 'date', header: 'Date' },
    { key: 'items', header: 'Items', render: (r) => `${r.items} item${r.items > 1 ? 's' : ''}` },
    { key: 'total', header: 'Total', render: (r) => <span className="font-semibold">₹{r.total}</span> },
    { key: 'payment', header: 'Payment', render: (r) => <span className="badge bg-slate-100 text-slate-600">{r.payment}</span> },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge value={r.status} /> },
    { key: 'actions', header: '', render: (r) => (
      <button onClick={() => setViewing(r)} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-brand-600"><Eye className="h-4 w-4" /></button>
    )},
  ]

  return (
    <div>
      <PageHeader title="Orders" subtitle={loading ? 'Loading…' : `${items.length} total orders`} />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                filter === f ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <SearchBox value={q} onChange={setQ} placeholder="Search by order or customer…" />
      </div>

      <DataTable columns={columns} rows={rows} empty={loading ? 'Loading orders…' : 'No orders found.'} />

      <Modal open={viewing !== null} onClose={() => setViewing(null)} title={`Order ${viewing?.code || ''}`}>
        {viewing && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Detail label="Customer" value={viewing.customer} />
              <Detail label="Date" value={viewing.date} />
              <Detail label="Items" value={`${viewing.items} item${viewing.items > 1 ? 's' : ''}`} />
              <Detail label="Payment" value={viewing.payment} />
              <Detail label="Order Total" value={<span className="font-bold text-slate-900">₹{viewing.total}</span>} />
              <Detail label="Current Status" value={<StatusBadge value={viewing.status} />} />
            </div>
            <div className="border-t border-slate-200 pt-4">
              <Select
                label="Update Status"
                options={STATUSES}
                value={viewing.status}
                onChange={(e) => updateStatus(viewing.id, e.target.value)}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-0.5 font-medium text-slate-700 dark:text-slate-200">{value}</p>
    </div>
  )
}
