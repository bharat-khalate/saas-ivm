import { useNavigate, useParams } from 'react-router-dom'
import { Loading } from '../components'
import { TEXT } from '../constants/text'
import { ProductFormView } from './productForm/ProductFormView'
import { useProductForm } from './productForm/useProductForm'
import PageTitle from '../components/PageTitle'

export function ProductFormPage({ mode }: { mode: 'create' | 'edit' }) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const form = useProductForm({ mode, id, navigate })

  if (form.loading) {
    return (
      <div className="w-full">
        <Loading message={TEXT.products.form.loading} />
      </div>
    )
  }

  return (
    <>

      <PageTitle
        title={TEXT.products.pageTitle}
        subTitle={mode == "create" ? TEXT.products.form.createPageTitle : TEXT.products.form.editPageTitle}
      />
      <ProductFormView
        mode={mode}
        initialValues={form.initialValues}
        categories={form.categories}
        saving={form.saving}
        onSubmit={form.submit}
        onCancel={() => navigate('/products')}
      />
    </>
  )
}

