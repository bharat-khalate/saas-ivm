import { type FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { productService } from '../services/productService'
import type { Product } from '../services/productService'
import {
  Card,
  Button,
  FormField,
  Alert,
  Loading,
  showToast,
} from '../components'

export function ProductFormPage({ mode }: { mode: 'create' | 'edit' }) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product>({
    name: '',
    sku: '',
    description: '',
    quantityOnHand: 0,
    costPrice: undefined,
    sellingPrice: undefined,
    lowStockThreshold: undefined,
  })
  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (mode === 'edit' && id) {
      const productId = id
      async function load() {
        setLoading(true)
        try {
          const data = await productService.getProduct(productId)
          setProduct(data)
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message ?? 'Failed to load product')
          } else {
            setError('Failed to load product')
          }
        } finally {
          setLoading(false)
        }
      }
      load()
    }
  }, [id, mode])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      if (mode === 'create') {
        await productService.createProduct(product)
      } else if (mode === 'edit' && id) {
        await productService.updateProduct(id, product)
      }

      navigate('/products')
      showToast(
        mode === 'create'
          ? 'Product created successfully'
          : 'Product updated successfully',
        'success',
      )
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message ?? 'Save failed')
        showToast(err.message ?? 'Save failed', 'error')
      } else {
        setError('Save failed')
        showToast('Save failed', 'error')
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full">
        <Loading message="Loading product..." />
      </div>
    )
  }

  const inputClassName =
    'rounded-xl border border-slate-600/50 bg-slate-900/80 px-3 py-2.5 text-slate-200 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400/60'

  return (
    <div className="w-full">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="mb-0 text-2xl font-semibold">
          {mode === 'create' ? 'Add product' : 'Edit product'}
        </h1>
      </div>

      <Card>
        {error && (
          <Alert type="error" className="mb-3">
            {error}
          </Alert>
        )}
        <form
          className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4"
          onSubmit={handleSubmit}
        >
          <FormField label="Name">
            <input
              type="text"
              value={product.name}
              onChange={(e) =>
                setProduct((p) => ({ ...p, name: e.target.value }))
              }
              required
              className={inputClassName}
            />
          </FormField>

          <FormField label="SKU">
            <input
              type="text"
              value={product.sku}
              onChange={(e) =>
                setProduct((p) => ({ ...p, sku: e.target.value }))
              }
              required
              className={inputClassName}
            />
          </FormField>

          <FormField label="Description" fullWidth>
            <textarea
              value={product.description ?? ''}
              onChange={(e) =>
                setProduct((p) => ({ ...p, description: e.target.value }))
              }
              rows={3}
              className={inputClassName}
            />
          </FormField>

          <FormField label="Quantity on hand">
            <input
              type="number"
              value={product.quantityOnHand ?? 0}
              onChange={(e) =>
                setProduct((p) => ({
                  ...p,
                  quantityOnHand:
                    e.target.value === ''
                      ? undefined
                      : Number(e.target.value),
                }))
              }
              className={inputClassName}
            />
          </FormField>

          <FormField label="Cost price">
            <input
              type="number"
              step="0.01"
              value={product.costPrice ?? ''}
              onChange={(e) =>
                setProduct((p) => ({
                  ...p,
                  costPrice:
                    e.target.value === ''
                      ? undefined
                      : Number(e.target.value),
                }))
              }
              className={inputClassName}
            />
          </FormField>

          <FormField label="Selling price">
            <input
              type="number"
              step="0.01"
              value={product.sellingPrice ?? ''}
              onChange={(e) =>
                setProduct((p) => ({
                  ...p,
                  sellingPrice:
                    e.target.value === ''
                      ? undefined
                      : Number(e.target.value),
                }))
              }
              className={inputClassName}
            />
          </FormField>

          <FormField label="Low stock threshold">
            <input
              type="number"
              value={product.lowStockThreshold ?? ''}
              onChange={(e) =>
                setProduct((p) => ({
                  ...p,
                  lowStockThreshold:
                    e.target.value === ''
                      ? undefined
                      : Number(e.target.value),
                }))
              }
              className={inputClassName}
            />
          </FormField>

          <div className="col-span-full mt-2 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => navigate('/products')}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving
                ? 'Saving...'
                : mode === 'create'
                  ? 'Create product'
                  : 'Save changes'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
