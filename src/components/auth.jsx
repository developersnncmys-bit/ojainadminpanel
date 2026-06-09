import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)
const STORAGE_KEY = 'ojain.auth'

// Demo credentials — replace with a real API call in production.
const DEMO_USERS = [
  { email: 'admin@ojain.in', password: 'admin123', name: 'Admin User', role: 'Super Admin' },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else localStorage.removeItem(STORAGE_KEY)
  }, [user])

  // Returns { ok: true } or { ok: false, error }
  const login = ({ email, password }) =>
    new Promise((resolve) => {
      setTimeout(() => {
        const match = DEMO_USERS.find(
          (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
        )
        if (!match) return resolve({ ok: false, error: 'Invalid email or password.' })
        const { password: _pw, ...safe } = match
        setUser(safe)
        resolve({ ok: true })
      }, 500) // simulate network latency
    })

  const logout = () => setUser(null)

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
