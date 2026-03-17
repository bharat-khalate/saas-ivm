import type { ReactNode } from 'react'

export type DataTableColumn<T> = {
  key: string
  header: string
  value?: (row: T) => ReactNode
  className?: string
}

type DataTableProps<T> = {
  columns: Array<DataTableColumn<T>>
  data: T[]
  rowKey: (row: T, index: number) => string | number
  footerRow?: ReactNode
}

export function DataTable<T>({
  columns,
  data,
  rowKey,
  footerRow,
}: DataTableProps<T>) {
  return (
    <table className="mt-2 w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-slate-200 dark:border-slate-600/40">
          {columns.map((col) => (
            <th
              key={col.key}
              className={`px-2 py-2.5 text-left text-slate-700 dark:text-slate-200 ${col.className ?? ''}`}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr
            key={rowKey(row, idx)}
            className="even:bg-slate-50 dark:even:bg-slate-900/75"
          >
            {columns.map((col) => (
              <td
                key={col.key}
                className={`px-2 py-2.5 text-slate-800 dark:text-slate-200 ${col.className ?? ''}`}
              >
                {col.value ? col.value(row) : (row as any)?.[col.key]}
              </td>
            ))}
          </tr>
        ))}
        {footerRow}
      </tbody>
    </table>
  )
}

