import api from '../api/axios'
import { loadAuth } from '../api/types'
import type { ApiResponse, AppUser } from '../api/types'
import type { PaginationMeta } from '../config/pagination.config'


export type Product = {
  productId?: number
  organizationId?: number
  name: string
  sku: string
  description?: string
  quantityOnHand?: number
  costPrice?: number
  sellingPrice?: number
  lowStockThreshold?: number | null
  categoryId?: number
  categoryName?: string
  selectedSizes?: string[]
  isActive?: boolean
  isFeatured?: boolean
  fileUrl?: string
  createdAt?: string
  updatedAt?: string
}

export type ProductResponse = {
  products: Product[],
  meta: PaginationMeta
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
  async listProducts(pageData: Omit<PaginationMeta, "total" | "totalPages">): Promise<ProductResponse> {
    const organisationId = getOrganizationId()
    const response = await api.get<ApiResponse<ProductResponse>>(
      `/products/organization/${organisationId}`,
      {
        params: pageData,
      }
    )
    return response.data.data;

  },


  async listProductsBySkuOrName(pageData: Omit<PaginationMeta, "total" | "totalPages">, searchValue: string): Promise<ProductResponse> {
    const organisationId = getOrganizationId()
    console.log({
      ...pageData,
      searchValue
    })
    const response = await api.get<ApiResponse<ProductResponse>>(
      `/products/search/${organisationId}`,
      {
        params: {
          ...pageData,
          searchValue
        },
      }
    )
    return response.data.data;
  },

  async getProduct(id: number | string): Promise<Product> {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`)
    return response.data.data
  },

  async createProduct(
    product: Omit<
      Product,
      | 'productId'
      | 'organizationId'
      | 'fileUrl'
      | 'createdAt'
      | 'updatedAt'

    >,
    file?: File | null,
  ): Promise<Product> {
    const organisationId = getOrganizationId()

    // Ensure organizationId is always a number
    if (!organisationId || typeof organisationId !== 'number') {
      throw new Error(`Invalid organization ID: ${organisationId}`)
    }

    const formData = new FormData()

    formData.append('organizationId', String(organisationId))
    formData.append('name', product.name)
    formData.append('sku', product.sku)

    if (product.description !== undefined) {
      formData.append('description', product.description)
    }
    if (product.quantityOnHand !== undefined) {
      formData.append('quantityOnHand', String(product.quantityOnHand))
    }
    if (product.costPrice !== undefined) {
      formData.append('costPrice', String(product.costPrice))
    }
    if (product.sellingPrice !== undefined) {
      formData.append('sellingPrice', String(product.sellingPrice))
    }
    if (product.lowStockThreshold !== undefined && product.lowStockThreshold !== null) {
      formData.append('lowStockThreshold', String(product.lowStockThreshold))
    }
    if (product.categoryName !== undefined) {
      formData.append('categoryName', String(product.categoryName))
    }
    if (product.selectedSizes && product.selectedSizes.length > 0) {
      product.selectedSizes.forEach((size) => {
        formData.append('selectedSizes', size)
      })
    }
    if (product.isActive !== undefined) {
      formData.append('isActive', String(product.isActive))
    }
    if (product.isFeatured !== undefined) {
      formData.append('isFeatured', String(product.isFeatured))
    }

    if (file) {
      formData.append('file', file)
    }
    const response = await api.post<ApiResponse<Product>>('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.data

  },

  async updateProduct(
    id: number | string,
    product: Partial<Product>,
    file?: File | null,
  ): Promise<Product> {
    const organisationId = getOrganizationId()

    const formData = new FormData()

    formData.append('organizationId', String(organisationId))

    if (product.name !== undefined) {
      formData.append('name', product.name)
    }
    if (product.sku !== undefined) {
      formData.append('sku', product.sku)
    }
    if (product.description !== undefined) {
      formData.append('description', product.description)
    }
    if (product.quantityOnHand !== undefined) {
      formData.append('quantityOnHand', String(product.quantityOnHand))
    }
    if (product.costPrice !== undefined) {
      formData.append('costPrice', String(product.costPrice))
    }
    if (product.sellingPrice !== undefined) {
      formData.append('sellingPrice', String(product.sellingPrice))
    }
    if (product.lowStockThreshold !== undefined && product.lowStockThreshold !== null) {
      formData.append('lowStockThreshold', String(product.lowStockThreshold))
    }
    if (product.categoryName !== undefined) {
      formData.append('categoryName', String(product.categoryName))
    }
    if (product.selectedSizes && product.selectedSizes.length > 0) {
      product.selectedSizes.forEach((size) => {
        formData.append('selectedSizes', size)
      })
    }
    if (product.isActive !== undefined) {
      formData.append('isActive', String(product.isActive))
    }
    if (product.isFeatured !== undefined) {
      formData.append('isFeatured', String(product.isFeatured))
    }

    if (file) {
      formData.append('file', file)
    }

    const response = await api.patch<ApiResponse<Product>>(
      `/products/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    return response.data.data
  },

  async deleteProduct(id: number | string): Promise<void> {
    await api.delete<ApiResponse<null>>(`/products/${id}`)
  },
}
