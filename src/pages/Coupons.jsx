import { useMemo, useState } from 'react'
import { Plus, Copy, Trash2 } from 'lucide-react'
import { PageHeader, SearchBox, StatusBadge, DataTable, Modal, ConfirmDialog, Field, Select } from '../components/ui'
import { useToast } from '../components/toast'
import { useResource } from '../hooks/useResource'

const TYPES = ['Percent', 'Flat', 'Shipping']
const emptyForm = { code: '', type: 'Percent', value: '', minOrder: '', expiry: '' }

export default function Coupons() {
  const toast = useToast()
  const { items, loading, create, remove } = useResource('coupons')
  const [q, setQ] = useState('')
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [deleting, setDeleting] = useState(null)
  const [saving, setSaving] = useState(false)

  const rows = useMemo(
    () => items.filter((c) => c.code?.toLowerCase().includes(q.toLowerCase())),
    [items, q],
  )

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const copy = async (code) => {
    try {
      await navigator.clipboard.writeText(code)
      toast(`Copied “${code}” to clipboard`)
    } catch {
      toast('Could not copy to clipboard', 'error')
    }
  }

  const save = async (e) => {
    e.preventDefault()
    const code = form.code.trim().toUpperCase()
    if (!code) return toast('Coupon code is required', 'error')
    if (items.some((c) => c.code === code)) return toast(`“${code}” already exists`, 'error')
    const value =
      form.type === 'Percent' ? `${form.value || 0}%` : form.type === 'Flat' ? `₹${form.value || 0}` : 'Free'
    const expiry = form.expiry || '2026-12-31'
    const status = new Date(expiry) < new Date('2026-06-09') ? 'Expired' : 'Active'
    setSaving(true)
    try {
      await create({ code, type: form.type, value, minOrder: Number(form.minOrder) || 0, uses: 0, expiry, status })
      toast(`Created coupon “${code}”`)
      setCreating(false)
      setForm(emptyForm)
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    try {
      await remove(deleting.id)
      toast(`Deleted “${deleting.code}”`, 'info')
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  const columns = [
    { key: 'code', header: 'Code', render: (r) => (
      <span className="inline-flex items-center gap-2">
        <code className="rounded-md bg-brand-50 px-2 py-1 text-xs font-bold text-brand-700">{r.code}</code>
        <button onClick={() => copy(r.code)} className="text-slate-300 hover:text-slate-500"><Copy className="h-3.5 w-3.5" /></button>
      </span>
    )},
    { key: 'type', header: 'Type' },
    { key: 'value', header: 'Discount', render: (r) => <span className="font-semibold">{r.value}</span> },
    { key: 'minOrder', header: 'Min Order', render: (r) => `₹${r.minOrder}` },
    { key: 'uses', header: 'Used', render: (r) => (r.uses || 0).toLocaleString('en-IN') },
    { key: 'expiry', header: 'Expiry' },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge value={r.status} /> },
    { key: 'actions', header: '', render: (r) => (
      <button onClick={() => setDeleting(r)} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button>
    )},
  ]

  return (
    <div>
      <PageHeader
        title="Coupons"
        subtitle="Create and manage discount codes"
        action={<button onClick={() => { setForm(emptyForm); setCreating(true) }} className="btn-primary"><Plus className="h-4 w-4" /> Create Coupon</button>}
      />
      <div className="mb-4">
        <SearchBox value={q} onChange={setQ} placeholder="Search coupon code…" />
      </div>
      <DataTable columns={columns} rows={rows} empty={loading ? 'Loading coupons…' : 'No coupons found.'} />

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="Create Coupon"
        footer={
          <>
            <button className="btn-ghost" onClick={() => setCreating(false)}>Cancel</button>
            <button className="btn-primary disabled:opacity-60" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Create Coupon'}</button>
          </>
        }
      >
        <form onSubmit={save} className="space-y-4">
          <Field label="Coupon Code" value={form.code} onChange={set('code')} placeholder="e.g. JAIN20" />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Type" options={TYPES} value={form.type} onChange={set('type')} />
            <Field
              label={form.type === 'Percent' ? 'Percent (%)' : form.type === 'Flat' ? 'Amount (₹)' : 'Value'}
              type="number"
              min="0"
              value={form.value}
              onChange={set('value')}
              disabled={form.type === 'Shipping'}
              placeholder={form.type === 'Shipping' ? 'Free shipping' : '20'}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Min Order (₹)" type="number" min="0" value={form.minOrder} onChange={set('minOrder')} placeholder="499" />
            <Field label="Expiry Date" type="date" value={form.expiry} onChange={set('expiry')} />
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title="Delete coupon"
        message={`Customers will no longer be able to use “${deleting?.code}”.`}
      />
    </div>
  )
}
