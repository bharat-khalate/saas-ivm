import { useEffect, useState } from 'react'
import type { NavigateFunction } from 'react-router-dom'
import { productService } from '../../services/productService'
import type { Product } from '../../services/productService'
import { categoryService, type Category } from '../../services/categoryService'
import { showToast } from '../../components'
import { TEXT } from '../../constants/text'

type Params = {
  mode: 'create' | 'edit'
  id?: string
  navigate: NavigateFunction
}

export type ProductFormValues = Product & {
  file: File | null
}

export function useProductForm({ mode, id, navigate }: Params) {
  const [product, setProduct] = useState<Product>({
    name: '',
    sku: '',
    description: '',
    quantityOnHand: 0,
    costPrice: undefined,
    sellingPrice: undefined,
    lowStockThreshold: undefined,
    categoryName: undefined,
    selectedSizes: [],
    isActive: true,
    isFeatured: false,
  })
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await categoryService.listCategories()
        setCategories(data)
      } catch (err) {
        console.error('Failed to load categories', err)
      }
    }
    loadCategories()
  }, [])

  useEffect(() => {
    if (mode !== 'edit' || !id) return
    const productId = id

    async function load() {
      setLoading(true)
      try {
        const data = await productService.getProduct(productId)
        setProduct((prev) => ({
          ...prev,
          ...data,
        }))
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id, mode])

  const initialValues: ProductFormValues = {
    ...product,
    file: null,
  }

  const submit = async (values: ProductFormValues) => {
    setSaving(true)
    try {
      if (mode === 'create') {
        const { file, ...payload } = values
        await productService.createProduct(payload as any, file)
      } else if (mode === 'edit' && id) {
        const { file, ...payload } = values
        await productService.updateProduct(id, payload as any, file)
      }

      navigate('/products')
      showToast(
        mode === 'create'
          ? TEXT.products.form.createdSuccess
          : TEXT.products.form.updatedSuccess,
        'success',
      )
    } catch (err) {
      if (err instanceof Error) {
        showToast(err.message ?? TEXT.common.saveFailed, 'error')
      } else {
        showToast(TEXT.common.saveFailed, 'error')
      }
    } finally {
      setSaving(false)
    }
  }

  return {
    initialValues,
    categories,
    loading,
    saving,
    submit,
  }
}

