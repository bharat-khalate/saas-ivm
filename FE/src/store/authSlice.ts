import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { AppUser } from '../api/types'
import { clearAuth, loadAuth, saveAuth } from '../api/types'
import { authService } from '../services/authService'

type AuthState = {
  user: AppUser | null
  token: string | null
  loading: boolean
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: true,
}

export const initAuth = createAsyncThunk('auth/init', async () => {
  const { token, user } = loadAuth()
  return { token, user }
})

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (payload: { email: string; password: string }) => {
    const res = await authService.login(payload)
    saveAuth(res.token, res.user)
    return res
  },
)

export const signupThunk = createAsyncThunk(
  'auth/signup',
  async (payload: { email: string; password: string; organisationName: string }) => {
    const res = await authService.signup(payload)
    saveAuth(res.token, res.user)
    return res
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      clearAuth()
      state.user = null
      state.token = null
    },
    setToken(state, action: { payload: string | null }) {
      state.token = action.payload
    },
    setUser(state, action: { payload: AppUser | null }) {
      state.user = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initAuth.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.token = action.payload.token
        state.loading = false
      })
      .addCase(initAuth.rejected, (state) => {
        state.user = null
        state.token = null
        state.loading = false
      })
      .addCase(loginThunk.pending, (state) => {
        state.loading = true
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.token = action.payload.token
        state.loading = false
      })
      .addCase(loginThunk.rejected, (state) => {
        state.loading = false
      })
      .addCase(signupThunk.pending, (state) => {
        state.loading = true
      })
      .addCase(signupThunk.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.token = action.payload.token
        state.loading = false
      })
      .addCase(signupThunk.rejected, (state) => {
        state.loading = false
      })
  },
})

export const { logout, setToken, setUser } = authSlice.actions
export default authSlice.reducer

