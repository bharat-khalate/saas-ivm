import { type ReactNode } from 'react'

type FormFieldProps = {
  label: string
  children: ReactNode
  fullWidth?: boolean
  className?: string
}

export function FormField({
  label,
  children,
  fullWidth = false,
  className = '',
}: FormFieldProps) {
  return (
    <label
      className={`flex flex-col gap-1.5 text-sm ${fullWidth ? 'col-span-full' : ''} ${className}`}
    >
      <span className="text-slate-300">{label}</span>
      {children}
    </label>
  )
}

