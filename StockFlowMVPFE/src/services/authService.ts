import api from '../api/axios'
import type { ApiResponse, AppUser } from '../api/types'

export type LoginCredentials = {
  email: string
  password: string
}

export type SignupData = {
  email: string
  password: string
  organisationName: string
}

export type AuthResponse = {
  user: AppUser
  token: string
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>(
      '/users/login',
      credentials,
    )
    return response.data.data
  },

  async signup(data: SignupData): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>(
      '/users',
      data,
    )
    return response.data.data
  },
}
