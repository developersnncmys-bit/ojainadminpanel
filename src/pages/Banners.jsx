import { useState } from 'react'
import { Plus, Image as ImageIcon, MousePointerClick, Trash2 } from 'lucide-react'
import { PageHeader, Modal, ConfirmDialog, Field, Select, Pagination, usePagination } from '../components/ui'
import { useToast } from '../components/toast'
import { banners as seed } from '../data/mockData'

const PLACEMENTS = ['Home Hero', 'Category Top', 'Sidebar', 'Checkout']
const emptyForm = { title: '', placement: PLACEMENTS[0], active: true }

export default function Banners() {
  const toast = useToast()
  const [items, setItems] = useState(seed)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [deleting, setDeleting] = useState(null)

  const toggle = (id) =>
    setItems((prev) => prev.map((b) => (b.id === id ? { ...b, active: !b.active } : b)))

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const save = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return toast('Banner title is required', 'error')
    setItems((prev) => [
      ...prev,
      { id: `B-${prev.length + 1}`, title: form.title, placement: form.placement, active: form.active, clicks: 0 },
    ])
    toast(`Created banner “${form.title}”`)
    setCreating(false)
    setForm(emptyForm)
  }

  const remove = () => {
    setItems((prev) => prev.filter((b) => b.id !== deleting.id))
    toast(`Deleted “${deleting.title}”`, 'info')
  }

  const { page, setPage, totalPages, pageItems, start, end, total } = usePagination(items, 6)

  return (
    <div>
      <PageHeader
        title="Banners"
        subtitle="Manage promotional banners shown across the storefront"
        action={<button onClick={() => { setForm(emptyForm); setCreating(true) }} className="btn-primary"><Plus className="h-4 w-4" /> New Banner</button>}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pageItems.map((b) => (
          <div key={b.id} className="card overflow-hidden">
            <div className="relative flex h-32 items-center justify-center bg-gradient-to-br from-brand-500 to-brand-700">
              <ImageIcon className="h-10 w-10 text-white/70" />
              <button
                onClick={() => setDeleting(b)}
                title="Delete banner"
                className="absolute right-2 top-2 rounded-md bg-white/20 p-1.5 text-white backdrop-blur hover:bg-white/30"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{b.title}</p>
                  <p className="text-xs text-slate-400">{b.placement}</p>
                </div>
                <button
                  onClick={() => toggle(b.id)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${b.active ? 'bg-brand-500' : 'bg-slate-300'}`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${b.active ? 'left-[22px]' : 'left-0.5'}`} />
                </button>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-sm text-slate-500">
                <MousePointerClick className="h-4 w-4" />
                {b.clicks.toLocaleString('en-IN')} clicks
              </div>
            </div>
          </div>
        ))}
      </div>

      {total > 6 && (
        <div className="card mt-4">
          <Pagination page={page} totalPages={totalPages} onChange={setPage} start={start} end={end} total={total} />
        </div>
      )}

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="New Banner"
        footer={
          <>
            <button className="btn-ghost" onClick={() => setCreating(false)}>Cancel</button>
            <button className="btn-primary" onClick={save}>Create Banner</button>
          </>
        }
      >
        <form onSubmit={save} className="space-y-4">
          <Field label="Banner Title" value={form.title} onChange={set('title')} placeholder="e.g. Monsoon Premix Sale" />
          <Select label="Placement" options={PLACEMENTS} value={form.placement} onChange={set('placement')} />
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            Active immediately
          </label>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={remove}
        title="Delete banner"
        message={`Remove “${deleting?.title}” from the storefront?`}
      />
    </div>
  )
}
