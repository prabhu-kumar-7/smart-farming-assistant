import axios from 'axios'

const API = axios.create({
  // Empty baseURL — Vite proxy handles routing to port 8080
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

API.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export default API