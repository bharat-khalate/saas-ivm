import api from '../api/axios'
import type { ApiResponse } from '../api/types'

export type Category = {
  categoryId: number
  category: string
}

export const categoryService = {
  async listCategories(): Promise<Category[]> {
    const response = await api.get<ApiResponse<Category[]>>('/categories')
    return response.data.data
  },
}

