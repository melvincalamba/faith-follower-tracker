import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
})

// Auto-attach token sa bawat request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fft_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Idagdag pagkatapos ng request interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Kung 401 at expired ang token, i-logout
    if (error.response?.status === 401) {
      const isLoginRoute = error.config.url.includes('/auth/login')
      if (!isLoginRoute) {
        localStorage.removeItem('fft_token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Members
export const getMembers   = ()         => api.get('/members')
export const getMember    = (id)       => api.get(`/members/${id}`)
export const createMember = (data)     => api.post('/members', data)
export const updateMember = (id, data) => api.put(`/members/${id}`, data)
export const deleteMember = (id)       => api.delete(`/members/${id}`)
export const getMemberHistory = (id)   => api.get(`/members/${id}/history`)

// Auth
export const loginUser    = (data) => api.post('/auth/login', data)
export const registerUser = (data) => api.post('/auth/register', data)
export const getMe        = ()     => api.get('/auth/me')
export const getMentors   = ()     => api.get('/mentors')