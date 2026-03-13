export type AppUser = {
  userId: number
  email: string
  organisationName?: string
  organizationId?: number
}

export type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
  error?: unknown
}

export function saveAuth(token: string, user: AppUser) {
  localStorage.setItem('sf_token', token)
  localStorage.setItem('sf_user', JSON.stringify(user))
}

export function clearAuth() {
  localStorage.removeItem('sf_token')
  localStorage.removeItem('sf_user')
}

export function loadAuth(): { token: string | null; user: AppUser | null } {
  const token = localStorage.getItem('sf_token')
  const rawUser = localStorage.getItem('sf_user')
  let user: AppUser | null = null
  if (rawUser) {
    try {
      user = JSON.parse(rawUser)
    } catch {
      user = null
    }
  }
  return { token, user }
}

