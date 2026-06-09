import { useState } from 'react'
import { Plus, Image as ImageIcon, MousePointerClick, Trash2 } from 'lucide-react'
import { PageHeader, Modal, ConfirmDialog, Field, Select, Pagination, usePagination } from '../components/ui'
import { useToast } from '../components/toast'
import { useResource } from '../hooks/useResource'
import { api } from '../api/client'

const PLACEMENTS = ['Home Hero', 'Category Top', 'Sidebar', 'Checkout']
const emptyForm = { title: '', placement: PLACEMENTS[0], active: true }

export default function Banners() {
  const toast = useToast()
  const { items, loading, create, remove, action } = useResource('banners')
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [deleting, setDeleting] = useState(null)
  const [saving, setSaving] = useState(false)

  const toggle = async (b) => {
    try {
      await action(api.patch(`/banners/${b.id}/toggle`))
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const save = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return toast('Banner title is required', 'error')
    setSaving(true)
    try {
      await create({ title: form.title, placement: form.placement, active: form.active, clicks: 0 })
      toast(`Created banner “${form.title}”`)
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
      toast(`Deleted “${deleting.title}”`, 'info')
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  const { page, setPage, totalPages, pageItems, start, end, total } = usePagination(items, 6)

  return (
    <div>
      <PageHeader
        title="Banners"
        subtitle="Manage promotional banners shown across the storefront"
        action={<button onClick={() => { setForm(emptyForm); setCreating(true) }} className="btn-primary"><Plus className="h-4 w-4" /> New Banner</button>}
      />
      {total === 0 && (
        <div className="card p-10 text-center text-slate-400">{loading ? 'Loading banners…' : 'No banners yet.'}</div>
      )}
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
                  <p className="font-semibold text-slate-800 dark:text-slate-100">{b.title}</p>
                  <p className="text-xs text-slate-400">{b.placement}</p>
                </div>
                <button
                  onClick={() => toggle(b)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${b.active ? 'bg-brand-500' : 'bg-slate-300'}`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${b.active ? 'left-[22px]' : 'left-0.5'}`} />
                </button>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-sm text-slate-500">
                <MousePointerClick className="h-4 w-4" />
                {(b.clicks || 0).toLocaleString('en-IN')} clicks
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
            <button className="btn-primary disabled:opacity-60" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Create Banner'}</button>
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
        onConfirm={confirmDelete}
        title="Delete banner"
        message={`Remove “${deleting?.title}” from the storefront?`}
      />
    </div>
  )
}
