import React from 'react'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './routes/router'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
