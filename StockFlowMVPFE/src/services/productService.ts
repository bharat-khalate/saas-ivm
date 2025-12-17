import api from '../api/axios'
import { loadAuth } from '../api/types'
import type { ApiResponse, AppUser } from '../api/types'

export type Product = {
  id?: number
  organizationId?: number
  name: string
  sku: string
  description?: string
  quantityOnHand?: number
  costPrice?: number
  sellingPrice?: number
  lowStockThreshold?: number | null
}

function getOrganizationId(): number {
  const { user } = loadAuth()
  const typedUser = user as AppUser | null

  if (!typedUser) {
    throw new Error('User not authenticated')
  }

  const organisationId =
    typedUser.organizationId ??
    typedUser.userId ??
    (typedUser as unknown as { organisationId?: number })?.organisationId ??
    (typedUser as unknown as { organisationID?: number })?.organisationID

  if (!organisationId || typeof organisationId !== 'number') {
    console.error('User object:', typedUser)
    throw new Error(
      `Organisation ID missing on user. User ID: ${typedUser.userId}, Organization ID: ${typedUser.organizationId}`,
    )
  }

  return organisationId
}

export const productService = {
  async listProducts(): Promise<Product[]> {
    const organisationId = getOrganizationId()
    const response = await api.get<ApiResponse<Product[]>>(
      `/products/organization/${organisationId}`,
    )
    return response.data.data
  },

  async getProduct(id: number | string): Promise<Product> {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`)
    return response.data.data
  },

  async createProduct(
    product: Omit<Product, 'id' | 'organizationId'>,
  ): Promise<Product> {
    const organisationId = getOrganizationId()

    // Ensure organizationId is always a number
    if (!organisationId || typeof organisationId !== 'number') {
      throw new Error(`Invalid organization ID: ${organisationId}`)
    }

    const payload = {
      ...product,
      organizationId: Number(organisationId),
    }

    const response = await api.post<ApiResponse<Product>>('/products', payload)
    return response.data.data
  },

  async updateProduct(
    id: number | string,
    product: Partial<Omit<Product, 'id' | 'organizationId'>>,
  ): Promise<Product> {
    const organisationId = getOrganizationId()
    const payload = {
      ...product,
      organizationId: Number(organisationId),
    }
    const response = await api.patch<ApiResponse<Product>>(
      `/products/${id}`,
      payload,
    )
    return response.data.data
  },

  async deleteProduct(id: number | string): Promise<void> {
    await api.delete<ApiResponse<null>>(`/products/${id}`)
  },
}
