import { type ButtonHTMLAttributes, type ReactNode } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'link' | 'danger'
  children: ReactNode
}

export function Button({
  variant = 'primary',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-2.5 font-semibold transition-all disabled:opacity-50'

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-sm hover:brightness-105',
    secondary:
      'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-600/70 dark:bg-slate-900/95 dark:text-slate-300 dark:hover:bg-slate-800/95',
    link: 'bg-transparent border-none p-0 text-sky-600 dark:text-sky-400',
    danger:
      'bg-transparent border-none p-0 text-red-600 dark:text-red-300',
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

