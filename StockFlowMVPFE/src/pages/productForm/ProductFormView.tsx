import type { Category } from '../../services/categoryService'
import type { Product } from '../../services/productService'
import { Button, Card, FormField } from '../../components'
import { MAX_NUMBER_SIZE, MIN_NUMBER_SIZE, SIZE } from '../../utils/constants'
import { TEXT } from '../../constants/text'
import { Formik } from 'formik'
import { validateProduct } from '../../utils/inputValidation.util'
import type { ProductFormValues } from './useProductForm'
import PageTitle from '../../components/PageTitle'

type Props = {
  mode: 'create' | 'edit'
  initialValues: ProductFormValues
  categories: Category[]
  saving: boolean
  onSubmit: (values: ProductFormValues) => Promise<void>
  onCancel: () => void
}

export function ProductFormView({
  mode,
  initialValues,
  categories,
  saving,
  onSubmit,
  onCancel,
}: Props) {
  const inputClassName =
    'rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500/40 dark:border-slate-600/50 dark:bg-slate-900/80 dark:text-slate-200 dark:focus:border-sky-400 dark:focus:ring-sky-400/60'

  const validate = (values: ProductFormValues) => {
    const errors = validateProduct(values as unknown as Product, mode === 'create')
    if (mode === 'create' && !values.file) {
      errors.file = TEXT.products.form.imageRequired
    }
    return errors as Record<string, string>
  }

  return (
    <div className="flex justify-center items-center min-h-100">
      <div className="w-full max-w-3xl">
        <div className="mb-4 flex items-center justify-center">
          <h1 className="mb-0 text-2xl font-semibold text-slate-900 dark:text-slate-100">
            <div>
              {/* Header */}
              <h1 className="text-xl font-semibold">
                {mode === 'create'
                  ? TEXT.products.form.createTitle
                  : TEXT.products.form.editTitle}
              </h1>

              {/* Sub-header (centered) */}
              {mode !== 'create' && (
                <p className="text-sm text-slate-500 text-center">
                  {initialValues.name}
                </p>
              )}
            </div>
          </h1>
        </div>

        <Card className="p-4">
          <Formik<ProductFormValues>
            initialValues={initialValues}
            enableReinitialize
            validate={validate}
            validateOnChange
            validateOnBlur
            onSubmit={async (values) => onSubmit(values)}
          >
            {({ values, errors, touched, handleBlur, handleSubmit, setFieldValue, resetForm }) => {
              const fileLabel =
                values.file?.name ?? TEXT.products.form.chooseImage

              const setNumber = (field: keyof Product, raw: string) => {
                if (parseInt(raw) > MAX_NUMBER_SIZE || parseInt(raw) < MIN_NUMBER_SIZE) return;
                setFieldValue(field as string, raw === '' ? undefined : parseInt(raw, 10))
              }

              const toggleSize = (size: string, checked: boolean) => {
                const current = values.selectedSizes ?? []
                const next = checked
                  ? [...current, size]
                  : current.filter((s) => s !== size)
                setFieldValue('selectedSizes', next)
              }

              return (
                <>

                  <div className="col-span-full mt-2 flex justify-end gap-3">
                    <Button type="button" variant="secondary" className='rounded-sm' onClick={onCancel}>
                      {TEXT.common.back}
                    </Button>

                  </div>



                  <form
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                    onSubmit={handleSubmit}
                  >
                    <FormField label={TEXT.products.form.fields.name}>
                      <input
                        type="text"
                        maxLength={50}
                        value={values.name}
                        onChange={(e) => setFieldValue('name', e.target.value)}
                        onBlur={handleBlur}
                        required
                        className={inputClassName}
                      />
                      {touched.name && errors.name && (
                        <p className="text-red-500 text-sm">{errors.name}</p>
                      )}
                    </FormField>

                    <FormField label={TEXT.products.form.fields.category}>
                      <select
                        value={values.categoryName ?? ''}
                        onChange={(e) =>
                          setFieldValue(
                            'categoryName',
                            e.target.value === '' ? undefined : e.target.value,
                          )
                        }
                        onBlur={handleBlur}
                        className={inputClassName}
                      >
                        <option value="">
                          {TEXT.products.form.categoryPlaceholder}
                        </option>
                        {categories.map((cat) => (
                          <option key={cat.category} value={cat.category}>
                            {cat.category}
                          </option>
                        ))}
                      </select>
                      {touched.categoryName && errors.categoryName && (
                        <p className="text-red-500 text-sm">
                          {errors.categoryName}
                        </p>
                      )}
                    </FormField>

                    <FormField label={TEXT.products.form.fields.sku}>
                      <input
                        type="text"
                        maxLength={20}
                        disabled={mode === 'edit'}
                        value={values.sku}
                        onChange={(e) => setFieldValue('sku', e.target.value)}
                        onBlur={handleBlur}
                        required
                        className={`${inputClassName} ${mode === 'edit' ? 'text-gray-400!' : ''}`}
                      // style={{ : mode === 'edit' && '-300'  }}
                      />
                      {touched.sku && errors.sku && (
                        <p className="text-red-500 text-sm">{errors.sku}</p>
                      )}
                    </FormField>

                    <div className="flex items-center gap-6">
                      <FormField label={TEXT.products.form.fields.active}>
                        <button
                          type="button"
                          onClick={() =>
                            setFieldValue('isActive', !(values.isActive ?? true))
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${values.isActive ? 'bg-indigo-500/40' : 'bg-slate-600'
                            }`}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${values.isActive ? 'translate-x-5' : 'translate-x-1'
                              }`}
                          />
                        </button>
                      </FormField>

                      <FormField label={TEXT.products.form.fields.featured}>
                        <button
                          type="button"
                          onClick={() =>
                            setFieldValue(
                              'isFeatured',
                              !(values.isFeatured ?? false),
                            )
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${values.isFeatured ? 'bg-indigo-500/40' : 'bg-slate-600'
                            }`}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${values.isFeatured ? 'translate-x-5' : 'translate-x-1'
                              }`}
                          />
                        </button>
                      </FormField>
                    </div>

                    <FormField label={TEXT.products.form.fields.description} fullWidth>
                      <textarea
                        value={values.description ?? ''}
                        onChange={(e) =>
                          setFieldValue('description', e.target.value)
                        }
                        onBlur={handleBlur}
                        rows={3}
                        className={inputClassName}
                      />
                      {touched.description && errors.description && (
                        <p className="text-red-500 text-sm">
                          {errors.description}
                        </p>
                      )}
                    </FormField>

                    <FormField label={TEXT.products.form.fields.quantityOnHand}>
                      <input
                        type="number"
                        value={(values.quantityOnHand ?? '') as any}
                        onChange={(e) => setNumber('quantityOnHand', e.target.value)}
                        onBlur={handleBlur}
                        className={inputClassName}
                        maxLength={14}
                      />
                      {touched.quantityOnHand && errors.quantityOnHand && (
                        <p className="text-red-500 text-sm">
                          {errors.quantityOnHand}
                        </p>
                      )}
                    </FormField>

                    <FormField label={TEXT.products.form.fields.costPrice}>
                      <input
                        type="number"
                        step="0.01"
                        value={(values.costPrice ?? '') as any}
                        onChange={(e) => setNumber('costPrice', e.target.value)}
                        onBlur={handleBlur}
                        className={inputClassName}
                        maxLength={14}
                      />
                      {touched.costPrice && errors.costPrice && (
                        <p className="text-red-500 text-sm">{errors.costPrice}</p>
                      )}
                    </FormField>

                    <FormField label={TEXT.products.form.fields.sellingPrice}>
                      <input
                        type="number"
                        step="0.01"
                        value={(values.sellingPrice ?? '') as any}
                        onChange={(e) => setNumber('sellingPrice', e.target.value)}
                        onBlur={handleBlur}
                        className={inputClassName}
                        maxLength={14}
                      />
                      {touched.sellingPrice && errors.sellingPrice && (
                        <p className="text-red-500 text-sm">
                          {errors.sellingPrice}
                        </p>
                      )}
                    </FormField>

                    <FormField label={TEXT.products.form.fields.sizes}>
                      <div className="flex flex-wrap gap-2">
                        {SIZE.map((size) => {
                          const checked = values.selectedSizes?.includes(size)
                          return (
                            <label
                              key={size}
                              className="inline-flex items-center gap-1 text-sm"
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={(e) =>
                                  toggleSize(size, e.target.checked)
                                }
                              />
                              <span className="uppercase">{size}</span>
                            </label>
                          )
                        })}
                      </div>
                      {touched.selectedSizes && errors.selectedSizes && (
                        <p className="text-red-500 text-sm">
                          {errors.selectedSizes}
                        </p>
                      )}
                    </FormField>

                    <FormField label={TEXT.products.form.fields.image}>
                      <div className="flex flex-col gap-3">

                        {/* IMAGE PREVIEW */}
                        <div className="w-full h-40 border rounded-xl overflow-hidden flex items-center justify-center bg-slate-100">
                          {values.file ? (
                            <img
                              src={URL.createObjectURL(values.file)}
                              alt="preview"
                              className="object-contain w-full h-full"
                            />
                          ) : initialValues.fileUrl ? (
                            <img
                              src={initialValues.fileUrl}
                              alt="product"
                              className="object-contain w-full h-full"
                            />
                          ) : (
                            <div className="flex flex-col items-center text-slate-400 text-sm">
                              📷
                              <span>Upload Image</span>
                            </div>
                          )}
                        </div>

                        {/* FILE INPUT */}
                        <div className="flex items-center gap-3">

                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              setFieldValue(
                                "file",
                                e.currentTarget.files?.[0] ?? null
                              )
                            }
                          />

                          {/* {TEXT.products.form.uploadImage} */}


                          <span
                            className="min-w-0 flex-1 text-center truncate text-sm text-slate-600"
                            title={fileLabel}
                          >
                            {fileLabel}
                          </span>
                        </div>

                        {touched.file && errors.file && (
                          <p className="text-red-500 text-sm">{errors.file}</p>
                        )}
                      </div>
                    </FormField>

                    <FormField label={TEXT.products.form.fields.lowStockThreshold}>
                      <input
                        type="number"
                        value={(values.lowStockThreshold ?? '') as any}
                        onChange={(e) => setNumber('lowStockThreshold', e.target.value)}
                        onBlur={handleBlur}
                        className={inputClassName}

                      />
                      {touched.lowStockThreshold && errors.lowStockThreshold && (
                        <p className="text-red-500 text-sm">
                          {errors.lowStockThreshold}
                        </p>
                      )}
                    </FormField>

                    <div className="col-span-full mt-2 flex justify-end gap-3">
                      <Button type="button" variant="secondary" onClick={() => resetForm()}>
                        {TEXT.common.reset}
                      </Button>
                      <Button type="submit" disabled={saving}>
                        {saving
                          ? TEXT.common.saving
                          : mode === 'create'
                            ? TEXT.products.form.createButton
                            : TEXT.products.form.editButton}
                      </Button>
                    </div>
                  </form>
                </>
              )
            }}
          </Formik>
        </Card>
      </div>
    </div>
  )
}

