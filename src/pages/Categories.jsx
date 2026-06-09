import { useMemo, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { PageHeader, SearchBox, StatusBadge, DataTable, Modal, ConfirmDialog, Field, Select } from '../components/ui'
import { useToast } from '../components/toast'
import { useResource } from '../hooks/useResource'

const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
const emptyForm = { name: '', slug: '', status: 'Active' }

export default function Categories() {
  const toast = useToast()
  const { items, loading, create, update, remove } = useResource('categories')
  const [q, setQ] = useState('')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [deleting, setDeleting] = useState(null)
  const [saving, setSaving] = useState(false)

  const rows = useMemo(
    () => items.filter((c) => c.name?.toLowerCase().includes(q.toLowerCase())),
    [items, q],
  )

  const openAdd = () => { setForm(emptyForm); setEditing({}) }
  const openEdit = (c) => { setForm({ ...c }); setEditing(c) }
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const save = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return toast('Category name is required', 'error')
    const payload = { name: form.name, slug: form.slug.trim() || slugify(form.name), status: form.status }
    setSaving(true)
    try {
      if (editing.id) {
        await update(editing.id, payload)
        toast(`Updated “${form.name}”`)
      } else {
        await create(payload)
        toast(`Added category “${form.name}”`)
      }
      setEditing(null)
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    try {
      await remove(deleting.id)
      toast(`Deleted “${deleting.name}”`, 'info')
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  const columns = [
    { key: 'name', header: 'Category', render: (r) => <span className="font-semibold text-slate-800 dark:text-slate-100">{r.name}</span> },
    { key: 'slug', header: 'Slug', render: (r) => <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800 dark:text-slate-300">{r.slug}</code> },
    { key: 'products', header: 'Products', render: (r) => `${r.products || 0} items` },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge value={r.status} /> },
    { key: 'actions', header: '', render: (r) => (
      <div className="flex gap-1">
        <button onClick={() => openEdit(r)} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-brand-600"><Pencil className="h-4 w-4" /></button>
        <button onClick={() => setDeleting(r)} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button>
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader
        title="Categories"
        subtitle="Organise products into Jain & Satvik categories"
        action={<button onClick={openAdd} className="btn-primary"><Plus className="h-4 w-4" /> Add Category</button>}
      />
      <div className="mb-4">
        <SearchBox value={q} onChange={setQ} placeholder="Search categories…" />
      </div>
      <DataTable columns={columns} rows={rows} empty={loading ? 'Loading categories…' : 'No categories found.'} />

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing?.id ? 'Edit Category' : 'Add Category'}
        footer={
          <>
            <button className="btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
            <button className="btn-primary disabled:opacity-60" onClick={save} disabled={saving}>
              {saving ? 'Saving…' : editing?.id ? 'Save Changes' : 'Add Category'}
            </button>
          </>
        }
      >
        <form onSubmit={save} className="space-y-4">
          <Field label="Category Name" value={form.name} onChange={set('name')} placeholder="e.g. Beverages" />
          <Field label="Slug (optional)" value={form.slug} onChange={set('slug')} placeholder="auto-generated from name" />
          <Select label="Status" options={['Active', 'Inactive']} value={form.status} onChange={set('status')} />
        </form>
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title="Delete category"
        message={`Remove “${deleting?.name}”? Products in this category will need re-assigning.`}
      />
    </div>
  )
}
