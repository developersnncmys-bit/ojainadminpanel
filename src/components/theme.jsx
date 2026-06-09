import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)
const STORAGE_KEY = 'ojain.theme'

const systemPrefersDark = () => window.matchMedia?.('(prefers-color-scheme: dark)').matches

function getInitialChoice() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'light' || saved === 'dark' || saved === 'system') return saved
  return 'system' // first visit → follow the OS
}

// Resolve the user's choice into the actual mode to render.
const resolve = (choice) => (choice === 'system' ? (systemPrefersDark() ? 'dark' : 'light') : choice)

export function ThemeProvider({ children }) {
  // `choice` is what the user picked (light | dark | system).
  const [choice, setChoice] = useState(getInitialChoice)

  useEffect(() => {
    const apply = () => document.documentElement.classList.toggle('dark', resolve(choice) === 'dark')
    apply()
    localStorage.setItem(STORAGE_KEY, choice)

    // When following the system, react to OS theme changes live.
    if (choice === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      mq.addEventListener('change', apply)
      return () => mq.removeEventListener('change', apply)
    }
  }, [choice])

  const setTheme = (next) => setChoice(next) // 'light' | 'dark' | 'system'
  const toggleTheme = () => setChoice((c) => (resolve(c) === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider value={{ choice, theme: resolve(choice), isDark: resolve(choice) === 'dark', setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
