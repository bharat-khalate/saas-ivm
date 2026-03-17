import { type ReactNode } from 'react'

type AlertProps = {
  type?: 'error' | 'success' | 'info'
  children: ReactNode
  className?: string
  onClose?: () => void
}

export function Alert({
  type = 'error',
  children,
  className = '',
  onClose,
}: AlertProps) {
  const typeClasses = {
    error:
      'border-red-300 bg-red-50 text-red-900 dark:border-red-500 dark:bg-red-900 dark:text-red-100',
    success:
      'border-green-300 bg-green-50 text-green-900 dark:border-green-500 dark:bg-green-900 dark:text-green-100',
    info: 'border-blue-300 bg-blue-50 text-blue-900 dark:border-blue-500 dark:bg-blue-900 dark:text-blue-100',
  }

  return (
    <div
      className={`rounded-lg border px-3 py-2.5 text-sm ${typeClasses[type]} ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span>{children}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-2 flex-shrink-0 text-current opacity-70 hover:opacity-100"
            aria-label="Close"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}

