import React, { createContext, useContext, useState, useEffect } from 'react'
import authService from '../services/auth'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const profile = await authService.getProfile()
          setUser(profile)
        } catch (err) {
          localStorage.removeItem('token')
        }
      }
      setLoading(false)
    }
    initAuth()
  }, [])

  const login = async (email, password) => {
    const data = await authService.login(email, password)
    localStorage.setItem('token', data.access_token)
    const profile = await authService.getProfile()
    setUser(profile)
    return profile
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (err) {
      console.warn('Backend token invalidation failed or expired:', err)
    } finally {
      localStorage.removeItem('token')
      setUser(null)
    }
  }


  const value = {
    user,
    loading,
    login,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
