import { createContext, useContext, useEffect, useState } from 'react'
import { Leaf } from 'lucide-react'
import { api, setToken, getToken } from '../api/client'

const AuthContext = createContext(null)
const USER_KEY = 'ojain.user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || 'null')
    } catch {
      return null
    }
  })
  const [ready, setReady] = useState(false)

  // On boot, if we have a token, verify it and refresh the user.
  useEffect(() => {
    if (!getToken()) {
      setReady(true)
      return
    }
    api
      .get('/auth/me')
      .then((r) => {
        setUser(r.user)
        localStorage.setItem(USER_KEY, JSON.stringify(r.user))
      })
      .catch(() => {
        setToken(null)
        localStorage.removeItem(USER_KEY)
        setUser(null)
      })
      .finally(() => setReady(true))
  }, [])

  // Returns { ok: true } or { ok: false, error }
  const login = async ({ email, password }) => {
    try {
      const r = await api.post('/auth/login', { email, password })
      setToken(r.token)
      localStorage.setItem(USER_KEY, JSON.stringify(r.user))
      setUser(r.user)
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e.message }
    }
  }

  const logout = () => {
    setToken(null)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 animate-pulse items-center justify-center rounded-2xl bg-brand-600">
            <Leaf className="h-6 w-6 text-white" />
          </div>
          <p className="text-sm text-slate-500">Loading OJAIN…</p>
        </div>
      </div>
    )
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
