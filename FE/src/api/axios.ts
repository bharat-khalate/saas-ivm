import axios from 'axios'
import { clearAuth, loadAuth, saveAuth } from './types'
import i18n from 'i18next';

const API_BASE = import.meta.env.VITE_API_BASE || '/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

const refreshClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

let isRefreshing = false
let refreshQueue: Array<(token: string | null) => void> = []

function enqueueRefresh(cb: (token: string | null) => void) {
  refreshQueue.push(cb)
}

function flushRefreshQueue(token: string | null) {
  refreshQueue.forEach((cb) => cb(token))
  refreshQueue = []
}


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sf_token')
    const lang = localStorage.getItem('lang') || 'en'
    config.headers['Accept-Language'] = i18n.language;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => {
    const data = response.data
    if (data?.success === false) {
      const rawMessage = data?.message
      const message = Array.isArray(rawMessage)
        ? rawMessage.join('\n')
        : rawMessage || 'Request failed'

      const apiError = new Error(message)
        ; (apiError as Error & { response?: unknown }).response = data
      return Promise.reject(apiError)
    }
    return response
  },
  async (error) => {
    if (error.response) {
      // Silent token refresh + retry (once)
      const status = error.response.status
      const originalRequest = error.config
      if (
        status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        !String(originalRequest.url ?? '').includes('/users/login') &&
        !String(originalRequest.url ?? '').includes('/users/refresh')
      ) {
        originalRequest._retry = true

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            enqueueRefresh((newToken) => {
              if (!newToken) {
                reject(error)
                return
              }
              originalRequest.headers = originalRequest.headers ?? {}
              originalRequest.headers.Authorization = `Bearer ${newToken}`
              resolve(api(originalRequest))
            })
          })
        }

        isRefreshing = true
        try {
          const existing = loadAuth()
          const currentToken = existing.token
          if (!currentToken) {
            clearAuth()
            window.location.href = '/login'
            return Promise.reject(error)
          }

          const refreshResponse = await refreshClient.post('/users/refresh', null, {
            headers: { Authorization: `Bearer ${currentToken}` },
          })

          const newToken = refreshResponse.data?.data?.token
          if (!newToken) {
            throw new Error('Failed to refresh token')
          }

          saveAuth(newToken, existing.user!)
          flushRefreshQueue(newToken)

          originalRequest.headers = originalRequest.headers ?? {}
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return api(originalRequest)
        } catch (refreshErr) {
          flushRefreshQueue(null)
          clearAuth()
          window.location.href = '/login'
          return Promise.reject(refreshErr)
        } finally {
          isRefreshing = false
        }
      }

      const data = error.response.data
      const rawMessage = data?.message
      const message = Array.isArray(rawMessage)
        ? rawMessage.join('\n')
        : rawMessage || error.response.statusText || 'Request failed'

      const apiError = new Error(message)
        ; (apiError as Error & { response?: unknown }).response = data
      return Promise.reject(apiError)
    } else if (error.request) {
      console.warn('Failed to send request: No response received')
      return Promise.reject(new Error('Network error: No response received'))
    } else {
      console.warn('Failed to send request:', error.message)
      return Promise.reject(error)
    }
  },
)

export default api

