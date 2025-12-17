import api from '../api/axios'
import type { ApiResponse } from '../api/types'

export type DashboardData = {
  totalProducts: number
  totalQuantity: number
  lowStockItems: Array<{
    id: number
    name: string
    sku: string
    quantityOnHand: number
    lowStockThreshold: number | null
  }>
}

export const dashboardService = {
  async getDashboard(): Promise<DashboardData> {
    const response = await api.get<ApiResponse<DashboardData>>('/dashboard')
    return response.data.data
  },
}
