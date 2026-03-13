import { useEffect, useState } from 'react'
import { Alert } from './Alert'

type Toast = {
  id: string
  type: 'error' | 'success' | 'info'
  message: string
}

let toastListeners: Array<(toasts: Toast[]) => void> = []
let toasts: Toast[] = []

function notify() {
  toastListeners.forEach((listener) => listener([...toasts]))
}

export function showToast(
  message: string,
  type: 'error' | 'success' | 'info' = 'info',
) {
  const id = Math.random().toString(36).substring(7)
  toasts = [...toasts, { id, type, message }]
  notify()

  // Auto-remove after 5 seconds
  setTimeout(() => {
    removeToast(id)
  }, 5000)
}

function removeToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id)
  notify()
}

export function ToastContainer() {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>([])

  useEffect(() => {
    const listener = (newToasts: Toast[]) => {
      setCurrentToasts(newToasts)
    }
    toastListeners.push(listener)
    setCurrentToasts([...toasts])

    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener)
    }
  }, [])

  if (currentToasts.length === 0) return null

  return (
    <div className="fixed right-4 top-4 z-50 flex flex-col gap-2">
      {currentToasts.map((toast) => (
        <Alert
          key={toast.id}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
          className="min-w-[300px] shadow-lg"
        >
          {toast.message}
        </Alert>
      ))}
    </div>
  )
}

