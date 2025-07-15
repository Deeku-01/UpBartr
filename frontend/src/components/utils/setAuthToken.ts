import axios from 'axios'

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:3000', // Corrected: Set the base URL to your server's root
})

// Function to set token
const setAuthToken = (token: string | null, userId: string | null) => {
  if (token && userId) {
    const authtoken = `Bearer ${token}`
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    localStorage.setItem('authToken', authtoken)
    localStorage.setItem('userId', userId)
  } else {
    delete api.defaults.headers.common['Authorization']
    localStorage.removeItem('authToken')
    localStorage.removeItem('userId')
  }
}

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      setAuthToken(null, null)
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export { setAuthToken, api };
