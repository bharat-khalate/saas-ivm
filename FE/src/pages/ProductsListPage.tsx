import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { productService } from '../services/productService'
import type { Product } from '../services/productService'
import {
  Button,
  Card,
  Alert,
  Loading,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  ConfirmDialog,
  showToast,
} from '../components'
import { paginationConfig, type PaginationMeta } from '../config/pagination.config'
import Pagination from '../components/PaginationControl'
import { getPaginationParams } from '../utils/pagination.util'

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
      if (search) {
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
        setError(err.message ?? 'Failed to load products')
      } else {
        setError('Failed to load products')
      }
    } finally {
      setLoading(false)
    }
  }



  useEffect(() => {
    loadProducts()
  }, [])

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
      showToast('Product deleted successfully', 'success')
    } catch (err) {
      if (err instanceof Error) {
        showToast(err.message ?? 'Delete failed', 'error')
      } else {
        showToast('Delete failed', 'error')
      }
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = products;


  useEffect(() => {
    loadProducts();
  }, [search]);

  return (
    <div className="w-full">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="mb-0 text-2xl font-semibold">Products</h1>
        <Button onClick={() => navigate('/products/new')}>
          + Add product
        </Button>
      </div>

      <Card className='max-h-[400px] md:overflow-hidden overflow-x-auto'>
        <div className="mb-4 flex justify-between gap-4 max-md:flex-col w-92 md:w-full">
          <input
            type="search"
            placeholder="Search by name or SKU"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-xl border border-slate-600/50 bg-slate-900/80 px-3 py-2.5 text-slate-200 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400/60"
          />
        </div>

        {loading ? (
          <Loading message="Loading products..." />
        ) : error ? (
          <Alert type="error">{error}</Alert>
        ) : filtered.length === 0 ? (
          <p className="text-gray-400">
            No products yet. Create your first product.
          </p>
        ) : (
          <Table>
            <TableHeader
              columns={['Name', 'SKU', 'Quantity', 'Selling price', '']}
            />
            <tbody>
              {filtered.map((p) => {

                const rowId =
                  (p as unknown as { id?: number }).id ??
                  (p as unknown as { productId?: number }).productId

                return (
                  <TableRow key={rowId}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.sku}</TableCell>
                    <TableCell>{p.quantityOnHand ?? 0}</TableCell>
                    <TableCell>
                      {p.sellingPrice != null &&
                        !isNaN(Number(p.sellingPrice))
                        ? Number(p.sellingPrice).toFixed(2)
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-3">
                        {rowId != null && (
                          <>
                            <Link
                              to={`/products/${rowId}`}
                              className="text-sky-400"
                            >
                              Edit
                            </Link>
                            <button
                              className="cursor-pointer border-none bg-transparent p-0 text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                              onClick={() => handleDeleteClick(rowId, p.name)}
                              disabled={deletingId === rowId}
                            >
                              {deletingId === rowId ? 'Deleting...' : 'Delete'}
                            </button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              <TableRow key={"pagination"}>
                <TableCell colSpan={5} rowSpan={2} >
                  {pagitionConfig ? (
                    <Pagination
                      meta={pagitionConfig}
                      onPageChange={(page) => {
                        loadProducts({
                          page: page,
                          pageSize: paginationConfig.pageSize
                        });
                      }}
                    />
                  ) : <></>}
                </TableCell>
              </TableRow>
            </tbody>
          </Table>
        )}
      </Card>

      <ConfirmDialog
        isOpen={confirmDelete !== null}
        title="Delete Product"
        message={`Are you sure you want to delete "${confirmDelete?.name}"? This cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDelete(null)}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  )
}
