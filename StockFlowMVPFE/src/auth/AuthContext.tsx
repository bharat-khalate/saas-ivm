import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import { clearAuth, loadAuth, saveAuth } from '../api/types'
import type { AppUser } from '../api/types'
import { authService } from '../services/authService'

type AuthContextType = {
  user: AppUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (
    email: string,
    password: string,
    organisationName: string,
  ) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { user: storedUser } = loadAuth()
    if (storedUser) {
      setUser(storedUser)
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const res = await authService.login({ email, password })
    saveAuth(res.token, res.user)
    setUser(res.user)
  }

  const signup = async (
    email: string,
    password: string,
    organisationName: string,
  ) => {
    const res = await authService.signup({ email, password, organisationName })
    saveAuth(res.token, res.user)
    setUser(res.user)
  }

  const logout = () => {
    clearAuth()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}


