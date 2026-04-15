import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  // Load user from localStorage on startup
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('smartfarm_user')
    return saved ? JSON.parse(saved) : null
  })

  // Save user + token to localStorage
  const login = (userData) => {
    localStorage.setItem('smartfarm_user', JSON.stringify(userData))
    localStorage.setItem('smartfarm_token', userData.token)
    setUser(userData)
  }

  // Clear everything on logout
  const logout = () => {
    localStorage.removeItem('smartfarm_user')
    localStorage.removeItem('smartfarm_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}