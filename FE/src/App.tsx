import './App.css'
import { useEffect, useState, type ReactElement } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
} from 'react-router-dom'
import { FiMoon, FiSun } from 'react-icons/fi'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { initAuth, logout as logoutAction } from './store/authSlice'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { ProductsListPage } from './pages/ProductsListPage'
import { ProductFormPage } from './pages/ProductFormPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { ToastContainer, Loading, Button } from './components'
import { TEXT } from './constants/text'

function PrivateRoute({ children }: { children: ReactElement }) {
  const auth = useAppSelector((s: any) => s.auth) as any
  const user = auth?.user
  const loading = auth?.loading

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

function AppShell() {
  const dispatch = useAppDispatch()
  const auth = useAppSelector((s: any) => s.auth) as any
  const user = auth?.user
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    const stored = localStorage.getItem('sf_theme') as 'light' | 'dark' | null
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches
    const initial: 'light' | 'dark' = stored ?? (prefersDark ? 'dark' : 'light')
    setTheme(initial)
    document.documentElement.classList.toggle('dark', initial === 'dark')
  }, [])

  useEffect(() => {
    dispatch(initAuth())
  }, [dispatch])

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('sf_theme', next)
      document.documentElement.classList.toggle('dark', next === 'dark')
      return next
    })
  }

  const logout = () => {
    dispatch(logoutAction())
  }

  return (
    <div className="flex min-h-screen flex-col">
      {user && (
        <header className="flex min-w-fit items-center justify-between border-b border-slate-200 bg-white/70 px-8 py-3 backdrop-blur-sm dark:border-slate-700/35 dark:bg-gradient-to-br dark:from-sky-500/12 dark:via-transparent dark:to-indigo-500/12">
          <div className="flex items-center gap-6">
            <span className="text-lg font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              {TEXT.app.name}
            </span>
            <nav className="flex gap-4 text-sm">
              {/* <Link
                to="/dashboard"
                className="rounded-full px-3 py-1.5 text-slate-300 hover:bg-slate-700/22 hover:no-underline"
              >
                Dashboard
              </Link> */}
              <Link
                to="/products"
                className="rounded-full px-3 py-1.5 text-slate-700 hover:bg-slate-200/60 hover:no-underline dark:text-slate-300 dark:hover:bg-slate-700/22"
              >
                {TEXT.app.nav.products}
              </Link>
              {/* <Link
                to="/settings"
                className="rounded-full px-3 py-1.5 text-slate-300 hover:bg-slate-700/22 hover:no-underline"
              >
                Settings
              </Link> */}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {/* <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-600/70 dark:bg-slate-900/95 dark:text-slate-200 dark:hover:bg-slate-800/95"
              aria-label={TEXT.app.theme.toggleAria}
              title={theme === 'dark' ? TEXT.app.theme.toLight : TEXT.app.theme.toDark}
            >
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
            </button> */}
            <span className="text-sm text-slate-800 dark:text-slate-200">
              {user.organisationName ?? user.email}
            </span>
            <Button variant="secondary" onClick={logout} className="text-sm">
              {TEXT.app.auth.logout}
            </Button>
          </div>
        </header>
      )}
      <main className="flex-1 px-8 py-6 pb-8 bg-slate-50 dark:bg-transparent">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          {/* <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          /> */}
          <Route
            path="/products"
            element={
              <PrivateRoute>
                <ProductsListPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/products/new"
            element={
              <PrivateRoute>
                <ProductFormPage mode="create" />
              </PrivateRoute>
            }
          />
          <Route
            path="/products/:id"
            element={
              <PrivateRoute>
                <ProductDetailPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/products/:id/edit"
            element={
              <PrivateRoute>
                <ProductFormPage mode="edit" />
              </PrivateRoute>
            }
          />
          {/* <Route
            path="/settings"
            element={
              <PrivateRoute>
                <SettingsPage />
              </PrivateRoute>
            }
          /> */}
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="*" element={<Navigate to="/products" replace />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
      <ToastContainer />
    </BrowserRouter>
  )
}

export default App
