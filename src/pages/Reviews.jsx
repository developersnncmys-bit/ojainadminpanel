import { useState } from 'react'
import { Star, Check, Trash2 } from 'lucide-react'
import { PageHeader, StatusBadge, ConfirmDialog, Pagination, usePagination } from '../components/ui'
import { useToast } from '../components/toast'
import { useResource } from '../hooks/useResource'
import { api } from '../api/client'

function Stars({ n }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`h-4 w-4 ${i <= n ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
      ))}
    </div>
  )
}

export default function Reviews() {
  const toast = useToast()
  const { items, loading, remove, action } = useResource('reviews')
  const [deleting, setDeleting] = useState(null)

  const approve = async (r) => {
    try {
      await action(api.patch(`/reviews/${r.id}/approve`))
      toast(`Approved review by ${r.customer}`)
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  const confirmDelete = async () => {
    try {
      await remove(deleting.id)
      toast(`Deleted review by ${deleting.customer}`, 'info')
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  const pending = items.filter((r) => r.status === 'Pending').length
  const { page, setPage, totalPages, pageItems, start, end, total } = usePagination(items, 6)

  return (
    <div>
      <PageHeader
        title="Reviews"
        subtitle={loading ? 'Loading…' : `${items.length} reviews · ${pending} pending moderation`}
      />
      {total === 0 && (
        <div className="card p-10 text-center text-slate-400">{loading ? 'Loading reviews…' : 'No reviews yet.'}</div>
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {pageItems.map((r) => (
          <div key={r.id} className="card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-100">{r.customer}</p>
                <p className="text-xs text-slate-400">{r.product}</p>
              </div>
              <StatusBadge value={r.status} />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Stars n={r.rating} />
              <span className="text-xs text-slate-400">{r.date}</span>
            </div>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">“{r.comment}”</p>
            <div className="mt-4 flex gap-2">
              {r.status === 'Pending' && (
                <button onClick={() => approve(r)} className="btn-primary px-3 py-1.5 text-xs"><Check className="h-3.5 w-3.5" /> Approve</button>
              )}
              <button onClick={() => setDeleting(r)} className="btn-ghost px-3 py-1.5 text-xs text-rose-600"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
            </div>
          </div>
        ))}
      </div>

      {total > 6 && (
        <div className="card mt-4">
          <Pagination page={page} totalPages={totalPages} onChange={setPage} start={start} end={end} total={total} />
        </div>
      )}

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title="Delete review"
        message={`Permanently remove the review by ${deleting?.customer}?`}
      />
    </div>
  )
}
