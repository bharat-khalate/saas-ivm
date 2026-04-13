import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../store/hooks'
import { signupThunk } from '../store/authSlice'
import { Card, Button, FormField, Alert } from '../components'
import { TEXT } from '../constants/text'
import PageTitle from '../components/PageTitle'

export function SignupPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [organisationName, setOrganisationName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{
    organisationName?: string
    email?: string
    password?: string
    confirmPassword?: string
  }>({})

  const inputClassName =
    'rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500/40 dark:border-slate-600/50 dark:bg-slate-900/80 dark:text-slate-200 dark:focus:border-sky-400 dark:focus:ring-sky-400/60'

  const validateOrgName = (value: string) => {
    const v = value.trim()
    if (!v) return TEXT.authPages.signup.validation.orgRequired
    if (v.length < 6) return TEXT.authPages.signup.validation.orgMin
    if (v.length > 15) return TEXT.authPages.signup.validation.orgMax
    if (!/^[A-Za-z\s]+$/.test(v)) return TEXT.authPages.signup.validation.orgAlpha
    return ''
  }

  const validateEmail = (value: string) => {
    if (!value.trim()) return TEXT.authPages.signup.validation.emailRequired
    if (!/^\S+@\S+\.\S+$/.test(value)) return TEXT.authPages.signup.validation.emailValid
    return ''
  }

  const validatePassword = (value: string) => {
    if (!value) return TEXT.authPages.signup.validation.passwordRequired
    if (value.length < 6) return TEXT.authPages.signup.validation.passwordLen
    return ''
  }

  const validateConfirmPassword = (value: string, pass: string) => {
    if (!value) return TEXT.authPages.signup.validation.confirmRequired
    if (value !== pass) return TEXT.authPages.signup.validation.confirmMatch
    return ''
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    const nextErrors = {
      organisationName: validateOrgName(organisationName),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(confirmPassword, password),
    }
    setFieldErrors(nextErrors)
    if (
      nextErrors.organisationName ||
      nextErrors.email ||
      nextErrors.password ||
      nextErrors.confirmPassword
    ) {
      return
    }

    setLoading(true)
    try {
      await dispatch(signupThunk({ email, password, organisationName })).unwrap()
      navigate('/dashboard')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message ?? TEXT.authPages.signup.failed)
      } else {
        setError(TEXT.authPages.signup.failed)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageTitle
        title={TEXT.authPages.pageTitle}
        subTitle={TEXT.authPages.signup.pageTitle}
      />

      <div className="grid min-h-screen md:grid-cols-[1.6fr_3.4fr] max-md:gap-0 grid-cols-1 bg-gradient-to-b from-sky-500/8 via-transparent to-indigo-500/8 dark:from-sky-500/25 dark:to-indigo-500/25">
        <div className="flex min-h-screen items-center justify-center pl-12 max-md:px-6 max-md:py-6 ">
          <div className="w-full max-w-[420px]">
            <Card>
              <h2 className="mb-4 mt-0 text-2xl font-semibold">
                {TEXT.authPages.signup.title}
              </h2>
              {error && (
                <Alert type="error" className="mb-3">
                  {error}
                </Alert>
              )}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <FormField label={TEXT.authPages.signup.fields.organisationName}>
                  <input
                    type="text"
                    value={organisationName}
                    onChange={(e) => {
                      const v = e.target.value
                      setOrganisationName(v)
                      setFieldErrors((prev) => ({
                        ...prev,
                        organisationName: validateOrgName(v),
                      }))
                    }}
                    required
                    className={inputClassName}
                  />
                  {fieldErrors.organisationName && (
                    <p className="text-red-600 dark:text-red-400 text-sm">
                      {fieldErrors.organisationName}
                    </p>
                  )}
                </FormField>
                <FormField label={TEXT.authPages.signup.fields.email}>
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
                <FormField label={TEXT.authPages.signup.fields.password}>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      const v = e.target.value
                      setPassword(v)
                      setFieldErrors((prev) => ({
                        ...prev,
                        password: validatePassword(v),
                        confirmPassword: confirmPassword
                          ? validateConfirmPassword(confirmPassword, v)
                          : prev.confirmPassword,
                      }))
                    }}
                    required
                    className={inputClassName}
                  />
                  {fieldErrors.password && (
                    <p className="text-red-600 dark:text-red-400 text-sm">{fieldErrors.password}</p>
                  )}
                </FormField>
                <FormField label={TEXT.authPages.signup.fields.confirmPassword}>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      const v = e.target.value
                      setConfirmPassword(v)
                      setFieldErrors((prev) => ({
                        ...prev,
                        confirmPassword: validateConfirmPassword(v, password),
                      }))
                    }}
                    required
                    className={inputClassName}
                  />
                  {fieldErrors.confirmPassword && (
                    <p className="text-red-600 dark:text-red-400 text-sm">
                      {fieldErrors.confirmPassword}
                    </p>
                  )}
                </FormField>
                <Button className="mt-1" type="submit" disabled={loading}>
                  {loading ? TEXT.authPages.signup.submitting : TEXT.authPages.signup.submit}
                </Button>
              </form>
              <p className="mt-4 text-sm text-slate-600 dark:text-gray-400">
                {TEXT.authPages.signup.already}{' '}
                <Link to="/login" className="text-sky-600 dark:text-sky-400">
                  {TEXT.authPages.signup.signIn}
                </Link>
              </p>
            </Card>
          </div>
        </div>
        <div className="relative flex items-center justify-start overflow-hidden px-14 py-12 max-md:px-6 max-md:py-6">
          <div className="relative z-10 max-w-[520px]">
            <p className="mb-3 text-xs uppercase tracking-widest text-sky-700 dark:text-sky-300">
              {TEXT.app.name}
            </p>
            <h1 className="mb-3 text-4xl font-bold leading-tight text-slate-900 dark:text-slate-100">
              {TEXT.authPages.signup.marketing.headline}
            </h1>
            <p className="mb-5 max-w-[30rem] text-[0.96rem] text-slate-700 dark:text-slate-300">
              {TEXT.authPages.signup.marketing.body}
            </p>
          </div>
          <div className="absolute right-[10%] top-[12%] h-64 w-64 rounded-full border border-sky-400/45 opacity-70 blur-[0.4px]" />
          <div className="absolute -bottom-24 -right-12 h-[26rem] w-[26rem] rounded-full border border-indigo-400/50 opacity-70 blur-[0.4px]" />
        </div>
      </div>
    </>
  )
}
