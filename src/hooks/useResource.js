import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/client'

// Loads a resource list once and exposes optimistic CRUD helpers.
// Pagination & search stay client-side (handled by DataTable), so we
// fetch a generous page size up front.
export function useResource(resource, { limit = 1000 } = {}) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get(`/${resource}?limit=${limit}`)
      setItems(res.data || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [resource, limit])

  useEffect(() => {
    reload()
  }, [reload])

  const create = async (body) => {
    const res = await api.post(`/${resource}`, body)
    setItems((prev) => [res.data, ...prev])
    return res.data
  }

  const update = async (id, body) => {
    const res = await api.put(`/${resource}/${id}`, body)
    setItems((prev) => prev.map((x) => (x.id === id ? res.data : x)))
    return res.data
  }

  const remove = async (id) => {
    await api.del(`/${resource}/${id}`)
    setItems((prev) => prev.filter((x) => x.id !== id))
  }

  // For custom endpoints (status changes, toggles, bulk, …).
  // Replaces the matching item in state when the call returns a doc.
  const action = async (promise) => {
    const res = await promise
    if (res?.data?.id) setItems((prev) => prev.map((x) => (x.id === res.data.id ? res.data : x)))
    return res
  }

  return { items, setItems, loading, error, reload, create, update, remove, action }
}
