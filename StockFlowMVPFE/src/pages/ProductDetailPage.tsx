import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { productService, type Product } from '../services/productService'
import { Card, Button, Loading, Alert } from '../components'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import { TEXT } from '../constants/text'
import PageTitle from '../components/PageTitle'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const productId = id

    async function load() {
      try {
        const data = await productService.getProduct(productId)
        setProduct(data)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message ?? TEXT.products.detail.loadFailed)
        } else {
          setError(TEXT.products.detail.loadFailed)
        }
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id])

  if (loading) {
    return (
      <div className="w-full">
        <Loading message={TEXT.products.form.loading} />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-xl">
        {error && (
          <Alert type="error" className="mb-3">
            {error}
          </Alert>
        )}
        <Button variant="secondary" onClick={() => navigate('/products')}>
          {TEXT.products.detail.backToProducts}
        </Button>
      </div>
    )
  }

  const labelClassName =
    'text-xs font-medium uppercase tracking-wide text-slate-600 dark:text-slate-400'
  const tileClassName =
    'rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-900/30'
  const valueClassName = 'mt-1 text-slate-900 dark:text-slate-100'

  return (
    <>
      <PageTitle
        title={TEXT.products.pageTitle}
        subTitle={TEXT.products.detail.pageTitle}
      />

      <div className="flex justify-center items-center min-h-100">
        <div className="w-full max-w-5xl">
          <div className="mb-5 mx-auto w-60 flex items-center justify-between">
            <h1 className="mb-0 text-2xl font-semibold text-slate-900 dark:text-slate-100">
              {TEXT.products.detail.title}
            </h1>
          </div>

          <Card>
            <div className="mb-4 flex justify-end">
              <Button variant="secondary" onClick={() => navigate('/products')}>
                {TEXT.common.back}
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
              <div>
                <p className={`mb-2 ${labelClassName}`}>
                  {TEXT.products.detail.imageLabel}
                </p>
                {product.fileUrl ? (
                  <div className="max-w-full overflow-hidden rounded-2xl border border-slate-200 bg-white/70 p-2 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-900/30">
                    <Zoom>
                      <img
                        src={product.fileUrl}
                        alt={product.name}
                        className="max-h-[420px] w-full rounded-xl object-contain cursor-zoom-in"
                      />
                    </Zoom>
                  </div>
                ) : (
                  <div className="flex h-[420px] w-full items-center justify-center rounded-2xl border border-dashed border-slate-300 text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    {TEXT.products.detail.noImage}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
                <div className={tileClassName}>
                  <p className={labelClassName}>
                    {TEXT.products.detail.labels.name}
                  </p>

                  <p
                    className={`text-base font-semibold ${valueClassName} line-clamp-2`}
                    title={product.name}   
                  >
                    {product.name}
                  </p>
                </div>

                <div className={tileClassName}>
                  <p className={labelClassName}>
                    {TEXT.products.detail.labels.sku}
                  </p>
                  <p className={valueClassName}>{product.sku}</p>
                </div>

                <div className={tileClassName}>
                  <p className={labelClassName}>
                    {TEXT.products.detail.labels.category}
                  </p>
                  <p className={valueClassName}>
                    {product.categoryName ?? TEXT.products.detail.values.na}
                  </p>
                </div>

                <div className={tileClassName}>
                  <p className={labelClassName}>
                    {TEXT.products.detail.labels.quantityOnHand}
                  </p>
                  <p className={valueClassName}>{product.quantityOnHand ?? 0}</p>
                </div>

                <div className={tileClassName}>
                  <p className={labelClassName}>
                    {TEXT.products.detail.labels.costPrice}
                  </p>
                  <p className={valueClassName}>
                    {product.costPrice != null
                      ? Number(product.costPrice).toFixed(2)
                      : TEXT.products.detail.values.na}
                  </p>
                </div>

                <div className={tileClassName}>
                  <p className={labelClassName}>
                    {TEXT.products.detail.labels.sellingPrice}
                  </p>
                  <p className={valueClassName}>
                    {product.sellingPrice != null
                      ? Number(product.sellingPrice).toFixed(2)
                      : TEXT.products.detail.values.na}
                  </p>
                </div>

                <div className={tileClassName}>
                  <p className={labelClassName}>
                    {TEXT.products.detail.labels.lowStockThreshold}
                  </p>
                  <p className={valueClassName}>
                    {product.lowStockThreshold ?? TEXT.products.detail.values.na}
                  </p>
                </div>

                <div className={tileClassName}>
                  <p className={labelClassName}>
                    {TEXT.products.detail.labels.status}
                  </p>
                  <p className={valueClassName}>
                    {product.isActive
                      ? TEXT.products.detail.values.active
                      : TEXT.products.detail.values.inactive}
                    {product.isFeatured ? TEXT.products.detail.values.featuredSep : ''}
                  </p>
                </div>

                <div className={`${tileClassName} md:col-span-2`}>
                  <p className={labelClassName}>
                    {TEXT.products.detail.labels.sizes}
                  </p>
                  <p className={valueClassName}>
                    {product.selectedSizes && product.selectedSizes.length > 0
                      ? product.selectedSizes.join(', ').toUpperCase()
                      : TEXT.products.detail.values.na}
                  </p>
                </div>

                <div className={`${tileClassName} md:col-span-2`}>
                  <p className={labelClassName}>
                    {TEXT.products.detail.labels.description}
                  </p>
                  <p className={`${valueClassName} whitespace-pre-line`}>
                    {product.description || TEXT.products.detail.values.na}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}

