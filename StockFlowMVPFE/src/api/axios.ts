import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || '/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sf_token')
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
      const message = data.message || 'Request failed'
      const apiError = new Error(message)
      ;(apiError as Error & { response?: unknown }).response = data
      return Promise.reject(apiError)
    }
    return response
  },
  async (error) => {
  
    if (error.response) {
  
      const data = error.response.data
      const message =
        data?.message || error.response.statusText || 'Request failed'
      const apiError = new Error(message)
     
      ;(apiError as Error & { response?: unknown }).response = data
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

