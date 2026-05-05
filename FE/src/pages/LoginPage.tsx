import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../store/hooks'
import { loginThunk } from '../store/authSlice'
import { Card, Button, FormField, Alert } from '../components'
import { TEXT } from '../constants/text'
import PageTitle from '../components/PageTitle'
import { useTranslation } from 'react-i18next'

export function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const { t } = useTranslation();

  const inputClassName =
    'rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500/40 dark:border-slate-600/50 dark:bg-slate-900/80 dark:text-slate-200 dark:focus:border-sky-400 dark:focus:ring-sky-400/60'

  const validateEmail = (value: string) => {
    if (!value.trim()) return t("authPages.login.validation.emailRequired")
    // simple email check
    if (!/^\S+@\S+\.\S+$/.test(value)) return t("authPages.login.validation.emailValid")
    return ''
  }

  const validatePassword = (value: string) => {
    if (!value) return t("authPages.login.validation.passwordRequired")
    if (value.length < 6) return t("authPages.login.validation.passwordLen")
    return ''
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    const nextErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    }
    setFieldErrors(nextErrors)
    if (nextErrors.email || nextErrors.password) return

    setLoading(true)
    try {
      await dispatch(loginThunk({ email, password })).unwrap()
      navigate('/products')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message ?? t("authPages.login.failed"))
      } else {
        setError(t("authPages.login.failed"))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageTitle
        title={t("authPages.pageTitle")}
        subTitle={t("authPages.login.pageTitle")}
      />
      <div className="grid min-h-screen md:grid-cols-[1.6fr_3.4fr] gap-4 max-md:gap-0 grid-cols-1">

        <div className="flex min-h-screen items-center justify-center pl-12 max-md:px-6 max-md:py-6  ">
          <div className="w-full ">
            <Card>
              <h2 className="mb-4 mt-0 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                {t("authPages.login.title")}
              </h2>
              <p className="mb-5 text-sm text-slate-600 dark:text-gray-400">
                {t("authPages.login.subtitle")}
              </p>
              {error && (
                <Alert type="error" className="mb-3">
                  {error}
                </Alert>
              )}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <FormField label={t("authPages.login.fields.email")}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      const v = e.target.value
                      setEmail(v)
                      setFieldErrors((prev) => ({ ...prev, email: validateEmail(v) }))
                    }}
                    required
                    className={inputClassName}
                  />
                  {fieldErrors.email && (
                    <p className="text-red-600 dark:text-red-400 text-sm">{fieldErrors.email}</p>
                  )}
                </FormField>
                <FormField label={t("authPages.login.fields.password")}>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      const v = e.target.value
                      setPassword(v)
                      setFieldErrors((prev) => ({ ...prev, password: validatePassword(v) }))
                    }}
                    required
                    className={inputClassName}
                  />
                  {fieldErrors.password && (
                    <p className="text-red-600 dark:text-red-400 text-sm">{fieldErrors.password}</p>
                  )}
                </FormField>
                <Button className="mt-1" type="submit" disabled={loading}>
                  {loading ? t("authPages.login.submitting") : t("authPages.login.submit")}
                </Button>
              </form>
              <p className="mt-4 text-sm text-slate-600 dark:text-gray-400">
                {t("authPages.login.newHere")}{' '}
                <Link to="/signup" className="text-sky-600 dark:text-sky-400">
                  {t("authPages.login.createAccount")}
                </Link>
              </p>
            </Card>
          </div>
        </div>
        <div className="relative flex items-center justify-start overflow-hidden px-14 py-12">
          <div className="relative z-10 max-w-[520px]">
            <p className="mb-3 text-xs uppercase tracking-widest text-sky-700 dark:text-sky-300">
              {t("app.name")}
            </p>
            <h1 className="mb-3 text-4xl font-bold leading-tight max-md:text-3xl text-slate-900 dark:text-slate-100">
              {t("authPages.login.marketing.headline")}
            </h1>
            <p className="mb-5 max-w-[30rem] text-[0.96rem] text-slate-700 dark:text-slate-300">
              {t("authPages.login.marketing.body")}
            </p>
            <ul className="mb-6 flex flex-col gap-1.5 text-sm text-slate-800 dark:text-slate-200">
              <li className="flex items-start">
                <span className="mr-2 text-sky-400">•</span>
                <span>{(t("authPages.login.marketing.bullets", { returnObjects: true })as string[])[0]}</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-sky-400">•</span>
                <span>{(t("authPages.login.marketing.bullets", { returnObjects: true })as string[])[1]}</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-sky-400">•</span>
                <span>{(t("authPages.login.marketing.bullets", { returnObjects: true })as string[])[2]}</span>
              </li>
            </ul>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-sky-500/40 bg-sky-500/10 px-3 py-1 text-xs text-slate-800 dark:border-sky-400/60 dark:bg-sky-400/15 dark:text-slate-200">
                {t("authPages.login.marketing.badge1")}
              </span>
              <span className="rounded-full border border-slate-300 bg-white/70 px-3 py-1 text-xs text-slate-800 dark:border-slate-600/50 dark:bg-slate-900/85 dark:text-slate-200">
                {t("authPages.login.marketing.badge2")}
              </span>
            </div>
          </div>
          <div className="absolute right-[10%] top-[12%] h-64 w-64 rounded-full border border-sky-400/45 opacity-70 blur-[0.4px]" />
          <div className="absolute -bottom-24 -right-12 h-[26rem] w-[26rem] rounded-full border border-indigo-400/50 opacity-70 blur-[0.4px]" />
        </div>
      </div>
    </>
  )
}
