import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import Funding from '../pages/Funding'
import Innovation from '../pages/Innovation'
import Profile from '../pages/Profile'
import Publications from '../pages/Publications'
import Patents from '../pages/Patents'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--primary-color)' }}>Loading Profile...</div>
  }
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return children
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      
      <Route path="/publications" element={
        <ProtectedRoute>
          <Publications />
        </ProtectedRoute>
      } />
      
      <Route path="/patents" element={
        <ProtectedRoute>
          <Patents />
        </ProtectedRoute>
      } />
      
      <Route path="/funding" element={
        <ProtectedRoute>
          <Funding />
        </ProtectedRoute>
      } />
      
      <Route path="/innovation" element={
        <ProtectedRoute>
          <Innovation />
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default AppRoutes

