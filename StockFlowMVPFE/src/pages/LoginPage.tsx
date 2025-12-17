import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { Card, Button, FormField, Alert } from '../components'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message ?? 'Login failed')
      } else {
        setError('Login failed')
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
            <h2 className="mb-4 mt-0 text-2xl font-semibold">Welcome back</h2>
            <p className="mb-5 text-sm text-gray-400">
              Sign in to view your inventory, update stock levels, and keep an
              eye on low-stock items.
            </p>
            {error && (
              <Alert type="error" className="mb-3">
                {error}
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              <Button className="mt-1" type="submit" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
            <p className="mt-4 text-sm text-gray-400">
              New here?{' '}
              <Link to="/signup" className="text-sky-400">
                Create an account
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
            Inventory that stays out of your way.
          </h1>
          <p className="mb-5 max-w-[30rem] text-[0.96rem] text-slate-300">
            A focused dashboard for tiny teams and solo founders. Track what you
            have, what&apos;s low, and what needs attention—without wrestling a
            full-blown ERP.
          </p>
          <ul className="mb-6 flex flex-col gap-1.5 text-sm text-slate-200">
            <li className="flex items-start">
              <span className="mr-2 text-sky-400">•</span>
              <span>Instant view of total products and stock on hand</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-sky-400">•</span>
              <span>One-click edits for quantities and prices</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-sky-400">•</span>
              <span>Low-stock list so you never miss a refill</span>
            </li>
          </ul>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-sky-400/60 bg-sky-400/15 px-3 py-1 text-xs">
              Built for internal demos & MVPs
            </span>
            <span className="rounded-full border border-slate-600/50 bg-slate-900/85 px-3 py-1 text-xs text-slate-200">
              No credit card · No setup wizard
            </span>
          </div>
        </div>
        <div className="absolute right-[10%] top-[12%] h-64 w-64 rounded-full border border-sky-400/45 opacity-70 blur-[0.4px]" />
        <div className="absolute -bottom-24 -right-12 h-[26rem] w-[26rem] rounded-full border border-indigo-400/50 opacity-70 blur-[0.4px]" />
      </div>
    </div>
  )
}
