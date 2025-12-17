import { type ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-700/35 bg-gradient-to-br from-sky-500/11 via-transparent to-indigo-500/13 p-6 shadow-2xl ${className}`}
    >
      {children}
    </div>
  )
}

