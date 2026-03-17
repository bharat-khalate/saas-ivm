import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { productService } from '../services/productService'
import type { Product } from '../services/productService'
import { TEXT } from '../constants/text'
import {
  Button,
  Card,
  Alert,
  Loading,
  DataTable,
  ConfirmDialog,
  showToast,
} from '../components'
import { paginationConfig, type PaginationMeta } from '../config/pagination.config'
import Pagination from '../components/PaginationControl'
import { getPaginationParams } from '../utils/pagination.util'
import PageTitle from '../components/PageTitle'
import { COLUMN_SIZE, SEARCH_KEYWORD_MIN_LENGTH } from '../utils/constants'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

interface LoadPageParam {
  page: number;
  pageSize: number;
}

export function ProductsListPage() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<{
    id: number
    name: string
  } | null>(null)
  const [pagitionConfig, setPaginationConfig] = useState<PaginationMeta>(paginationConfig)

  const loadProducts = async (paginationConfig?: LoadPageParam) => {
    setLoading(true)
    setError(null)
    try {
      if (!paginationConfig) paginationConfig = getPaginationParams();
      const trimmed = search.trim()
      if (trimmed.length >= SEARCH_KEYWORD_MIN_LENGTH) {
        const data = await productService.listProductsBySkuOrName(paginationConfig, search)
        setProducts(data.products);
        setPaginationConfig(data.meta);
        return;
      }
      const data = await productService.listProducts(paginationConfig)
      setProducts(data.products);
      setPaginationConfig(data.meta);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message ?? TEXT.products.loadFailed)
      } else {
        setError(TEXT.products.loadFailed)
      }
    } finally {
      setLoading(false)
    }
  }



  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    loadProducts();
  }, [search]);

  const handleDeleteClick = (id: number, name: string) => {
    setConfirmDelete({ id, name })
  }

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return
    const { id } = confirmDelete
    setDeletingId(id)
    setConfirmDelete(null)

    try {
      await productService.deleteProduct(id)
      await loadProducts()
      showToast(TEXT.products.deleteSuccess, 'success')
    } catch (err) {
      if (err instanceof Error) {
        showToast(err.message ?? TEXT.products.deleteFailed, 'error')
      } else {
        showToast(TEXT.products.deleteFailed, 'error')
      }
    } finally {
      setDeletingId(null)
    }
  }

  const filtered: Product[] = products;




  const debouncedSearch = (() => {
    // let timeOut: ReturnType<typeof setTimeout> | null = null;
    return async (e: React.ChangeEvent<HTMLInputElement>) => {
      // if (timeOut) clearTimeout(timeOut);
      setSearch(e.target.value);
      // if (search.length <= 0) loadProducts();
      // timeOut = setTimeout(() => {
      //   loadProducts();
      // }, SEARCH_DEBOUNCE_DELAY);
    };
  })();

  return (
    <>
      <PageTitle
        title={TEXT.products.pageTitle}
        subTitle={TEXT.products.table.pageTitle}
      />

      <div className="w-full">
        <div className="mb-5 flex items-center justify-between">
          <h1 className="mb-0 text-2xl font-semibold">{TEXT.products.title}</h1>
          <Button onClick={() => navigate('/products/new')}>
            {TEXT.products.add}
          </Button>
        </div>

        <Card className="overflow-x-auto">
          <div className="mb-4 flex justify-between gap-4 max-md:flex-col w-92 md:w-full">
            <div className="flex-1">
              <input
                type="search"
                placeholder={TEXT.products.searchPlaceholder}
                value={search}
                onChange={debouncedSearch}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500/40 dark:border-slate-600/50 dark:bg-slate-900/80 dark:text-slate-200 dark:focus:border-sky-400 dark:focus:ring-sky-400/60"
              />
              <p className="mt-1 text-xs text-slate-400">
                {search.trim().length > 0 && search.trim().length < SEARCH_KEYWORD_MIN_LENGTH
                  ? TEXT.products.searchHint(SEARCH_KEYWORD_MIN_LENGTH - search.trim().length)
                  : ' '}
              </p>
            </div>
          </div>

          {loading ? (
            <Loading message="Loading products..." />
          ) : error ? (
            <Alert type="error">{error}</Alert>
          ) : filtered.length === 0 ? (
            <p className="text-gray-400">
              {TEXT.products.empty}
            </p>
          ) : (
            <DataTable<Product>
              columns={[
                {
                  key: "fileUrl",
                  header: TEXT.products.table.preview,
                  value: (p) => (
                    p.fileUrl ? (
                      <Zoom>
                        <img
                          src={p.fileUrl}
                          alt="preview"
                          className="w-13 h-8 rounded object-contained border border-slate-300"
                        />
                      </Zoom>
                    ) : "-"
                  ),
                },
                {
                  key: 'name',
                  header: TEXT.products.table.name,
                  value: (p) => (
                    <div className="max-w-[220px] truncate" title={p.name}>
                      {p.name}
                    </div>
                  ),
                },
                {
                  key: 'sku',
                  header: TEXT.products.table.sku,
                  value: (p) => (
                    <div className="max-w-[160px] truncate" title={p.sku}>
                      {p.sku}
                    </div>
                  ),
                },
                {
                  key: 'categoryName',
                  header: TEXT.products.table.category,
                  value: (p) => (
                    <div className="max-w-[180px] truncate" title={p.categoryName ?? ''}>
                      {p.categoryName ?? '-'}
                    </div>
                  ),
                },
                {
                  key: 'quantityOnHand',
                  header: TEXT.products.table.quantity,
                  value: (p) => p.quantityOnHand ?? 0,
                },
                {
                  key: 'sellingPrice',
                  header: TEXT.products.table.sellingPrice,
                  value: (p) =>
                    p.sellingPrice != null && !isNaN(Number(p.sellingPrice))
                      ? Number(p.sellingPrice).toFixed(2)
                      : '-',
                },

                {
                  key: 'action',
                  header: TEXT.products.table.action,
                  value: (p) => {
                    const rowId =
                      (p as Product as { id?: number }).id ??
                      (p as Product as { productId?: number }).productId

                    return (
                      <div className="flex items-center justify-end gap-3">
                        {rowId != null && (
                          <>
                            <Link
                              to={`/products/${rowId}`}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-sky-500/60 text-sky-400 hover:bg-sky-500/10"
                              aria-label={TEXT.products.table.view}
                              title={TEXT.products.table.view}
                            >
                              <FiEye className="h-4 w-4" />
                            </Link>
                            <Link
                              to={`/products/${rowId}/edit`}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-indigo-500/60 text-indigo-300 hover:bg-indigo-500/10"
                              aria-label={TEXT.products.table.edit}
                              title={TEXT.products.table.edit}
                            >
                              <FiEdit2 className="h-4 w-4" />
                            </Link>
                            <button
                              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-500/50 text-red-300 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                              onClick={() => handleDeleteClick(Number(rowId), p.name)}
                              disabled={deletingId === rowId}
                              aria-label={TEXT.common.delete}
                              title={TEXT.common.delete}
                            >
                              {deletingId === rowId ? (
                                <span className="text-xs">...</span>
                              ) : (
                                <FiTrash2 className="h-4 w-4" />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    )
                  },
                  className: 'text-right',
                },
              ]}
              data={filtered}
              rowKey={(p) =>
                (p as Product).productId ??
                `${p.sku}-${p.name}`
              }
              footerRow={
                <tr>
                  <td colSpan={COLUMN_SIZE} className="px-2 py-2.5">
                    {pagitionConfig ? (
                      <Pagination
                        meta={pagitionConfig}
                        onPageChange={(page) => {
                          loadProducts({
                            page: page,
                            pageSize: paginationConfig.pageSize,
                          })
                        }}
                      />
                    ) : null}
                  </td>
                </tr>
              }
            />
          )}
        </Card>

        <ConfirmDialog
          isOpen={confirmDelete !== null}
          title={TEXT.products.deleteDialog.title}
          message={TEXT.products.deleteDialog.message(confirmDelete?.name)}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setConfirmDelete(null)}
          confirmText={TEXT.products.deleteDialog.confirmText}
          cancelText={TEXT.products.deleteDialog.cancelText}
          variant="danger"
        />
      </div>
    </>
  )
}
