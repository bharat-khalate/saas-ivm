import { Button } from './Button'

type ConfirmDialogProps = {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'default'
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
}: ConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="md:w-full md:mx-0 mx-10 max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700/35 dark:bg-gradient-to-br dark:from-sky-500/11 dark:via-transparent dark:to-indigo-500/13">
        <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
        <p className="mb-6 text-slate-600 dark:text-slate-300">{message}</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}

