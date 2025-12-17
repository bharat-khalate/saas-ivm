import { type ReactNode } from 'react'

type TableProps = {
  children: ReactNode
  className?: string
}

export function Table({ children, className = '' }: TableProps) {
  return (
    <table
      className={`mt-2 w-full border-collapse text-sm ${className}`}
    >
      {children}
    </table>
  )
}

type TableHeaderProps = {
  columns: string[]
  className?: string
}

export function TableHeader({ columns, className = '' }: TableHeaderProps) {
  return (
    <thead>
      <tr className={`border-b border-slate-600/40 ${className}`}>
        {columns.map((col, idx) => (
          <th key={idx} className="px-2 py-2.5 text-left">
            {col}
          </th>
        ))}
      </tr>
    </thead>
  )
}

type TableRowProps = {
  children: ReactNode
  className?: string
}

export function TableRow({ children, className = '' }: TableRowProps) {
  return (
    <tr className={`even:bg-slate-900/75 ${className}`}>{children}</tr>
  )
}

type TableCellProps = {
  children: ReactNode
  className?: string
}

export function TableCell({ children, className = '' }: TableCellProps) {
  return <td className={`px-2 py-2.5 ${className}`}>{children}</td>
}

