import api from '../api/axios'
import type { ApiResponse } from '../api/types'

export type Settings = {
  defaultLowStockThreshold: number | null
}

export const settingsService = {
  async getSettings(): Promise<Settings> {
    const response = await api.get<ApiResponse<Settings>>('/settings')
    return response.data.data
  },

  async updateSettings(settings: Settings): Promise<Settings> {
    const response = await api.put<ApiResponse<Settings>>('/settings', settings)
    return response.data.data
  },
}
