import './App.css'
import type { ReactElement } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { AuthProvider, useAuth } from './auth/AuthContext'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { DashboardPage } from './pages/DashboardPage'
import { ProductsListPage } from './pages/ProductsListPage'
import { ProductFormPage } from './pages/ProductFormPage'
import { SettingsPage } from './pages/SettingsPage'
import { ToastContainer, Loading, Button } from './components'

function PrivateRoute({ children }: { children: ReactElement }) {
  const { user, loading } = useAuth()

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
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-screen flex-col">
      {user && (
        <header className="flex items-center justify-between border-b border-slate-700/35 bg-gradient-to-br from-sky-500/12 via-transparent to-indigo-500/12 px-8 py-3 backdrop-blur-sm">
          <div className="flex items-center gap-6">
            <span className="text-lg font-bold uppercase tracking-wider text-slate-200">
              StockFlow
            </span>
            <nav className="flex gap-4 text-sm">
              <a
                href="/dashboard"
                className="rounded-full px-3 py-1.5 text-slate-300 hover:bg-slate-700/22 hover:no-underline"
              >
                Dashboard
              </a>
              <a
                href="/products"
                className="rounded-full px-3 py-1.5 text-slate-300 hover:bg-slate-700/22 hover:no-underline"
              >
                Products
              </a>
              <a
                href="/settings"
                className="rounded-full px-3 py-1.5 text-slate-300 hover:bg-slate-700/22 hover:no-underline"
              >
                Settings
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-200">
              {user.organisationName ?? user.email}
            </span>
            <Button variant="secondary" onClick={logout} className="text-sm">
              Logout
            </Button>
          </div>
        </header>
      )}
      <main className="flex-1 px-8 py-6 pb-8">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
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
                <ProductFormPage mode="edit" />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <SettingsPage />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
        <ToastContainer />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
