import { type ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' , ...rest}: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-xl backdrop-blur-sm dark:border-slate-700/35 dark:bg-gradient-to-br dark:from-sky-500/11 dark:via-transparent dark:to-indigo-500/13 ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}

