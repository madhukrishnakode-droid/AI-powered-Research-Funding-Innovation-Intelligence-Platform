import React, { useState } from 'react'
import { createRootRoute, Outlet, useRouterState, useNavigate } from '@tanstack/react-router'
import AppSidebar from '../components/app-sidebar'
import TopBar from '../components/top-bar'
import { Toaster } from 'sonner'
import { useAuth } from '../context/AuthContext'

function RootLayoutComponent() {
  const { user, loading } = useAuth()
  const routerState = useRouterState()
  const navigate = useNavigate()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = routerState.location.pathname
  const cleanPath = pathname.replace(/\/$/, '') || '/'

  const isAuthPage = ['/login', '/register'].includes(cleanPath)

  console.log('[DEBUG] pathname:', pathname, 'cleanPath:', cleanPath, 'isAuthPage:', isAuthPage, 'user:', !!user, 'loading:', loading)

  // Auth Guard: If not logged in and trying to access app pages, redirect
  React.useEffect(() => {
    if (!loading && !user && !isAuthPage) {
      console.log('[DEBUG] Redirecting user to /login')
      navigate({ to: '/login' })
    }
  }, [user, loading, cleanPath, navigate, isAuthPage])

  if (isAuthPage) {
    return (
      <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#0B1A1E' }}>
        <Outlet />
        <Toaster position="top-right" toastOptions={{ className: 'sonner-toast-custom' }} />
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#0B1A1E',
        color: '#fbbf24',
        fontSize: '1rem',
        fontFamily: 'Fraunces, serif',
        gap: '1rem'
      }}>
        <div style={{
          width: '2.5rem',
          height: '2.5rem',
          borderRadius: '50%',
          border: '3px solid rgba(251, 191, 38, 0.1)',
          borderTopColor: '#fbbf24',
          animation: 'spin 1s linear infinite'
        }}></div>
        Loading Radial Workspace...
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  // If after load there is still no user (handled by redirect hook, but prevents flash)
  if (!user) {
    return null
  }

  return (
    <div className="app-container" style={{ position: 'relative', width: '100%' }}>
      {/* Dynamic styles injected to align layout and sidebar size */}
      <style>{`
        .topbar-padding-helper {
          left: ${isCollapsed ? '5rem' : '16rem'} !important;
        }
      `}</style>

      {/* App Navigation */}
      <AppSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Workspace Frame */}
      <div className={`main-content ${isCollapsed ? 'collapsed' : ''}`} style={{ flexGrow: 1 }}>
        <TopBar />
        <Outlet />
      </div>

      {/* Notifications Layer */}
      <Toaster position="top-right" toastOptions={{ className: 'sonner-toast-custom' }} />
    </div>
  )
}

export const Route = createRootRoute({
  component: RootLayoutComponent
})
export default Route
