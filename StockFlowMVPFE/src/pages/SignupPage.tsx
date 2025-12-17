import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { Card, Button, FormField, Alert } from '../components'

export function SignupPage() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [organisationName, setOrganisationName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await signup(email, password, organisationName)
      navigate('/dashboard')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message ?? 'Signup failed')
      } else {
        setError('Signup failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-[1.6fr_3.4fr] bg-gradient-to-b from-sky-500/25 via-transparent to-indigo-500/25 max-md:grid-cols-1">
      <div className="flex min-h-screen items-center justify-center pl-12 max-md:hidden">
        <div className="w-full max-w-[420px]">
          <Card>
            <h2 className="mb-4 mt-0 text-2xl font-semibold">
              Create your StockFlow account
            </h2>
            {error && (
              <Alert type="error" className="mb-3">
                {error}
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <FormField label="Organization name">
                <input
                  type="text"
                  value={organisationName}
                  onChange={(e) => setOrganisationName(e.target.value)}
                  required
                  className="rounded-xl border border-slate-600/50 bg-slate-900/80 px-3 py-2.5 text-slate-200 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400/60"
                />
              </FormField>
              <FormField label="Email">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-xl border border-slate-600/50 bg-slate-900/80 px-3 py-2.5 text-slate-200 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400/60"
                />
              </FormField>
              <FormField label="Password">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="rounded-xl border border-slate-600/50 bg-slate-900/80 px-3 py-2.5 text-slate-200 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400/60"
                />
              </FormField>
              <FormField label="Confirm password">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="rounded-xl border border-slate-600/50 bg-slate-900/80 px-3 py-2.5 text-slate-200 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400/60"
                />
              </FormField>
              <Button className="mt-1" type="submit" disabled={loading}>
                {loading ? 'Creating account...' : 'Create account'}
              </Button>
            </form>
            <p className="mt-4 text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-sky-400">
                Sign in
              </Link>
            </p>
          </Card>
        </div>
      </div>
      <div className="relative flex items-center justify-start overflow-hidden px-14 py-12 max-md:hidden">
        <div className="relative z-10 max-w-[520px]">
          <p className="mb-3 text-xs uppercase tracking-widest text-sky-300">
            StockFlow
          </p>
          <h1 className="mb-3 text-4xl font-bold leading-tight">
            Spin up a clean inventory in one afternoon.
          </h1>
          <p className="mb-5 max-w-[30rem] text-[0.96rem] text-slate-300">
            Start with a simple product list, track on-hand quantities, and see
            low stock at a glance. No complex setup or integrations.
          </p>
        </div>
        <div className="absolute right-[10%] top-[12%] h-64 w-64 rounded-full border border-sky-400/45 opacity-70 blur-[0.4px]" />
        <div className="absolute -bottom-24 -right-12 h-[26rem] w-[26rem] rounded-full border border-indigo-400/50 opacity-70 blur-[0.4px]" />
      </div>
    </div>
  )
}
