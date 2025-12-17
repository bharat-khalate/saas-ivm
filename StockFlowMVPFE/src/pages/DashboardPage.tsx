import { useEffect, useState } from 'react'
import { dashboardService } from '../services/dashboardService'
import type { DashboardData } from '../services/dashboardService'
import { Card, Loading, Alert, Table, TableHeader, TableRow, TableCell } from '../components'

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await dashboardService.getDashboard()
        setData(data)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message ?? 'Failed to load dashboard')
        } else {
          setError('Failed to load dashboard')
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="w-full">
        <Loading message="Loading dashboard..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full">
        <Alert type="error">{error}</Alert>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="w-full">
      <h1 className="mb-6 text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
        <Card className="text-left">
          <h2 className="text-lg font-semibold">Total products</h2>
          <p className="mt-1 text-3xl font-semibold">{data.totalProducts}</p>
        </Card>
        <Card className="text-left">
          <h2 className="text-lg font-semibold">Total quantity on hand</h2>
          <p className="mt-1 text-3xl font-semibold">{data.totalQuantity}</p>
        </Card>
      </div>

      <Card className="mt-7">
        <h2 className="mb-4 text-lg font-semibold">Low stock items</h2>
        {data.lowStockItems.length === 0 ? (
          <p className="text-gray-400">No low stock items right now.</p>
        ) : (
          <Table>
            <TableHeader columns={['Name', 'SKU', 'Quantity', 'Threshold']} />
            <tbody>
              {data.lowStockItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>{item.quantityOnHand}</TableCell>
                  <TableCell>{item.lowStockThreshold ?? '-'}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  )
}
