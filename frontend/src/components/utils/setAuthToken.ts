import axios from 'axios'

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:3000/api/auth/register', 
})

// Function to set token
// Call the function with token to set the token or null to remove it

const setAuthToken = (token: string | null,userId:string|null) => {
  if (token && userId) {
    // Set default header for all requests
    const authtoken= `Bearer ${token}`
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    localStorage.setItem('authToken', authtoken)
    localStorage.setItem('userId', userId)
  } else {
    // Remove header
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
      // Token expired or invalid
      setAuthToken(null,null)
      // Redirect to login or show login modal
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export { api, setAuthToken }