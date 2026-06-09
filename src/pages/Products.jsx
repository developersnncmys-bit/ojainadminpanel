import { useMemo, useRef, useState } from 'react'
import { Plus, Pencil, Trash2, Upload, ImagePlus, X, Package, FileDown } from 'lucide-react'
import { PageHeader, SearchBox, StatusBadge, DataTable, Modal, ConfirmDialog, Field, Select } from '../components/ui'
import { useToast } from '../components/toast'
import { products as seed, categories } from '../data/mockData'

const STATUSES = ['Active', 'Low Stock', 'Out of Stock', 'Inactive']
const VENDORS = ['Satvik Foods', 'Jain Rasoi', 'Amba Pickles', 'Gokul Dairy', 'Pure Satvik Co.']
const emptyForm = { name: '', category: categories[0].name, price: '', stock: '', vendor: VENDORS[0], status: 'Active', images: [] }

const BULK_COLUMNS = ['name', 'category', 'price', 'stock', 'vendor', 'status']
const BULK_TEMPLATE =
  'name,category,price,stock,vendor,status\n' +
  'Instant Dosa Premix,Instant Premix,129,200,Satvik Foods,Active\n' +
  'Garlic-Free Schezwan Sauce,Pickles,180,0,Amba Pickles,Out of Stock'

// Minimal CSV parser supporting quoted fields and commas inside quotes.
function parseCSV(text) {
  const rows = []
  let row = []
  let cell = ''
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++ }
      else if (ch === '"') inQuotes = false
      else cell += ch
    } else if (ch === '"') inQuotes = true
    else if (ch === ',') { row.push(cell); cell = '' }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++
      row.push(cell); cell = ''
      if (row.some((c) => c.trim() !== '')) rows.push(row)
      row = []
    } else cell += ch
  }
  if (cell !== '' || row.length) { row.push(cell); if (row.some((c) => c.trim() !== '')) rows.push(row) }
  return rows
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function Products() {
  const toast = useToast()
  const [items, setItems] = useState(seed)
  const [q, setQ] = useState('')
  const [editing, setEditing] = useState(null) // null = closed, {} = new, {...} = edit
  const [form, setForm] = useState(emptyForm)
  const [deleting, setDeleting] = useState(null)
  const [bulkOpen, setBulkOpen] = useState(false)
  const [bulkText, setBulkText] = useState('')
  const imageInput = useRef(null)
  const csvInput = useRef(null)

  const rows = useMemo(
    () =>
      items.filter(
        (p) =>
          p.name.toLowerCase().includes(q.toLowerCase()) ||
          p.category.toLowerCase().includes(q.toLowerCase()) ||
          p.vendor.toLowerCase().includes(q.toLowerCase()),
      ),
    [items, q],
  )

  const openAdd = () => { setForm(emptyForm); setEditing({}) }
  const openEdit = (p) => { setForm({ ...emptyForm, ...p, images: p.images || [] }); setEditing(p) }
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const addImages = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    const bad = files.find((f) => !f.type.startsWith('image/'))
    if (bad) toast(`Skipped non-image file “${bad.name}”`, 'error')
    const urls = await Promise.all(files.filter((f) => f.type.startsWith('image/')).map(readFileAsDataURL))
    setForm((f) => ({ ...f, images: [...f.images, ...urls] }))
    if (imageInput.current) imageInput.current.value = ''
  }

  const removeImage = (idx) => setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))

  const save = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return toast('Product name is required', 'error')
    const price = Number(form.price) || 0
    const stock = Number(form.stock) || 0
    const status = stock === 0 ? 'Out of Stock' : form.status
    if (editing.id) {
      setItems((prev) => prev.map((p) => (p.id === editing.id ? { ...p, ...form, price, stock, status } : p)))
      toast(`Updated “${form.name}”`)
    } else {
      const id = `P-${1000 + items.length + 1}`
      setItems((prev) => [{ ...form, id, price, stock, status }, ...prev])
      toast(`Added “${form.name}”`)
    }
    setEditing(null)
  }

  const remove = () => {
    setItems((prev) => prev.filter((p) => p.id !== deleting.id))
    toast(`Deleted “${deleting.name}”`, 'info')
  }

  // ---- Bulk import --------------------------------------------------------
  const parsedBulk = useMemo(() => {
    if (!bulkText.trim()) return { products: [], errors: [] }
    const grid = parseCSV(bulkText)
    if (!grid.length) return { products: [], errors: [] }
    const header = grid[0].map((h) => h.trim().toLowerCase())
    const hasHeader = header.includes('name')
    const cols = hasHeader ? header : BULK_COLUMNS
    const dataRows = hasHeader ? grid.slice(1) : grid
    const products = []
    const errors = []
    dataRows.forEach((cells, i) => {
      const rec = {}
      cols.forEach((c, idx) => { rec[c] = (cells[idx] || '').trim() })
      if (!rec.name) { errors.push(`Row ${i + 1}: missing name`); return }
      const stock = Number(rec.stock) || 0
      products.push({
        name: rec.name,
        category: rec.category || categories[0].name,
        price: Number(rec.price) || 0,
        stock,
        vendor: rec.vendor || VENDORS[0],
        status: stock === 0 ? 'Out of Stock' : STATUSES.includes(rec.status) ? rec.status : 'Active',
        images: [],
      })
    })
    return { products, errors }
  }, [bulkText])

  const loadCSVFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBulkText(await file.text())
    if (csvInput.current) csvInput.current.value = ''
  }

  const downloadTemplate = () => {
    const blob = new Blob([BULK_TEMPLATE], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ojain-products-template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const importBulk = () => {
    const { products } = parsedBulk
    if (!products.length) return toast('Nothing to import — check your CSV', 'error')
    setItems((prev) => {
      let n = prev.length
      const withIds = products.map((p) => ({ ...p, id: `P-${1000 + ++n}` }))
      return [...withIds, ...prev]
    })
    toast(`Imported ${products.length} product${products.length > 1 ? 's' : ''}`)
    setBulkOpen(false)
    setBulkText('')
  }

  const columns = [
    { key: 'name', header: 'Product', render: (r) => (
      <div className="flex items-center gap-3">
        <Thumb src={r.images?.[0]} />
        <div>
          <p className="font-semibold text-slate-800">{r.name}</p>
          <p className="text-xs text-slate-400">{r.id}{r.images?.length > 1 ? ` · ${r.images.length} images` : ''}</p>
        </div>
      </div>
    )},
    { key: 'category', header: 'Category' },
    { key: 'price', header: 'Price', render: (r) => <span className="font-semibold">₹{r.price}</span> },
    { key: 'stock', header: 'Stock', render: (r) => (
      <span className={r.stock === 0 ? 'text-rose-600 font-semibold' : r.stock < 50 ? 'text-amber-600 font-semibold' : ''}>
        {r.stock}
      </span>
    )},
    { key: 'vendor', header: 'Vendor' },
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
        title="Products"
        subtitle={`${items.length} products across all categories`}
        action={
          <div className="flex gap-2">
            <button onClick={() => { setBulkText(''); setBulkOpen(true) }} className="btn-ghost"><Upload className="h-4 w-4" /> Bulk Import</button>
            <button onClick={openAdd} className="btn-primary"><Plus className="h-4 w-4" /> Add Product</button>
          </div>
        }
      />
      <div className="mb-4">
        <SearchBox value={q} onChange={setQ} placeholder="Search products, vendors…" />
      </div>
      <DataTable columns={columns} rows={rows} />

      {/* Add / Edit product */}
      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing?.id ? 'Edit Product' : 'Add Product'}
        footer={
          <>
            <button className="btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
            <button className="btn-primary" onClick={save}>{editing?.id ? 'Save Changes' : 'Add Product'}</button>
          </>
        }
      >
        <form onSubmit={save} className="space-y-4">
          <Field label="Product Name" value={form.name} onChange={set('name')} placeholder="e.g. Instant Khichdi Premix" />

          {/* Images */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Product Images</label>
            <div className="flex flex-wrap gap-3">
              {form.images.map((src, i) => (
                <div key={i} className="group relative h-20 w-20 overflow-hidden rounded-lg border border-slate-200">
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute right-0.5 top-0.5 rounded-full bg-slate-900/60 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => imageInput.current?.click()}
                className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-slate-300 text-slate-400 hover:border-brand-400 hover:text-brand-600"
              >
                <ImagePlus className="h-5 w-5" />
                <span className="text-[10px] font-medium">Add</span>
              </button>
            </div>
            <input ref={imageInput} type="file" accept="image/*" multiple className="hidden" onChange={addImages} />
            <p className="mt-1.5 text-xs text-slate-400">PNG / JPG — the first image is used as the thumbnail.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select label="Category" options={categories.map((c) => c.name)} value={form.category} onChange={set('category')} />
            <Select label="Vendor" options={VENDORS} value={form.vendor} onChange={set('vendor')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Price (₹)" type="number" min="0" value={form.price} onChange={set('price')} placeholder="149" />
            <Field label="Stock" type="number" min="0" value={form.stock} onChange={set('stock')} placeholder="100" />
          </div>
          <Select label="Status" options={STATUSES} value={form.status} onChange={set('status')} />
        </form>
      </Modal>

      {/* Bulk import */}
      <Modal
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        title="Bulk Import Products"
        size="lg"
        footer={
          <>
            <button className="btn-ghost" onClick={() => setBulkOpen(false)}>Cancel</button>
            <button className="btn-primary disabled:opacity-50" onClick={importBulk} disabled={!parsedBulk.products.length}>
              Import {parsedBulk.products.length || ''} Product{parsedBulk.products.length === 1 ? '' : 's'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => csvInput.current?.click()} className="btn-ghost"><Upload className="h-4 w-4" /> Upload CSV</button>
            <button type="button" onClick={downloadTemplate} className="btn-ghost"><FileDown className="h-4 w-4" /> Download Template</button>
            <input ref={csvInput} type="file" accept=".csv,text/csv" className="hidden" onChange={loadCSVFile} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Paste CSV data</label>
            <textarea
              className="input h-40 resize-none font-mono text-xs"
              placeholder={BULK_TEMPLATE}
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
            />
            <p className="mt-1.5 text-xs text-slate-400">
              Columns: <code className="rounded bg-slate-100 px-1">{BULK_COLUMNS.join(', ')}</code>. A header row is optional.
            </p>
          </div>

          {parsedBulk.errors.length > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
              {parsedBulk.errors.slice(0, 5).map((er, i) => <div key={i}>{er}</div>)}
              {parsedBulk.errors.length > 5 && <div>…and {parsedBulk.errors.length - 5} more</div>}
            </div>
          )}

          {parsedBulk.products.length > 0 && (
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <div className="bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
                Preview — {parsedBulk.products.length} product{parsedBulk.products.length > 1 ? 's' : ''} ready
              </div>
              <div className="max-h-44 overflow-y-auto divide-y divide-slate-100">
                {parsedBulk.products.slice(0, 20).map((p, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2 text-sm">
                    <span className="font-medium text-slate-700">{p.name}</span>
                    <span className="text-xs text-slate-400">{p.category} · ₹{p.price} · {p.stock} in stock</span>
                  </div>
                ))}
                {parsedBulk.products.length > 20 && (
                  <div className="px-3 py-2 text-xs text-slate-400">…and {parsedBulk.products.length - 20} more</div>
                )}
              </div>
            </div>
          )}
        </div>
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={remove}
        title="Delete product"
        message={`This will permanently remove “${deleting?.name}” from the catalogue.`}
      />
    </div>
  )
}

function Thumb({ src }) {
  if (src) return <img src={src} alt="" className="h-10 w-10 shrink-0 rounded-lg border border-slate-200 object-cover" />
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-300">
      <Package className="h-4 w-4" />
    </div>
  )
}
