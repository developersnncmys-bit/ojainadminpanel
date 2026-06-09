import { createContext, useCallback, useContext, useState } from 'react'
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react'

const ToastContext = createContext(() => {})

const TONES = {
  success: { icon: CheckCircle2, cls: 'border-brand-200 bg-brand-50 text-brand-800', iconCls: 'text-brand-600' },
  error: { icon: AlertTriangle, cls: 'border-rose-200 bg-rose-50 text-rose-800', iconCls: 'text-rose-500' },
  info: { icon: Info, cls: 'border-blue-200 bg-blue-50 text-blue-800', iconCls: 'text-blue-500' },
}

let counter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remove = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), [])

  const toast = useCallback(
    (message, type = 'success') => {
      const id = ++counter
      setToasts((t) => [...t, { id, message, type }])
      setTimeout(() => remove(id), 3200)
    },
    [remove],
  )

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-xs flex-col gap-2">
        {toasts.map((t) => {
          const tone = TONES[t.type] || TONES.info
          const Icon = tone.icon
          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-sm font-medium shadow-card ${tone.cls}`}
            >
              <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${tone.iconCls}`} />
              <span className="flex-1">{t.message}</span>
              <button onClick={() => remove(t.id)} className="opacity-50 hover:opacity-100">
                <X className="h-4 w-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
