import React from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { useAuth } from '../context/AuthContext'
import { Search, Bell, User } from 'lucide-react'

const TopBar = () => {
  const { user } = useAuth()
  const routerState = useRouterState()

  // Determine current page title based on path
  const currentPath = routerState.location.pathname
  const pageTitles = {
    '/': 'Home Workspace',
    '/dashboard': 'Research Dashboard',
    '/patents': 'Patent Portfolio',
    '/funding': 'Funding Recommendations',
    '/publications': 'Publications Tracker',
    '/innovation-score': 'Innovation Health Score',
    '/reports': 'Report Library',
    '/profile': 'Profile & Metrics',
    '/collaborations': 'Collaborations Network',
    '/lab-resources': 'Lab & Device Resources',
    '/alerts': 'Alerts Notification Center',
    '/settings': 'System Settings'
  }
  const currentTitle = pageTitles[currentPath] || 'Radial Workspace'

  const userAvatar = user?.profile_picture || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop'
  const userName = user?.full_name || 'Dr. Elena'

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      right: 0,
      left: 0,
      height: '4rem',
      backgroundColor: 'rgba(11, 26, 30, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(81, 105, 115, 0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem',
      zIndex: 40,
      transition: 'left 0.2s ease-in-out'
    }} className="topbar-padding-helper">
      {/* Page Title / Breadcrumb */}
      <div>
        <h2 style={{
          fontSize: '1rem',
          fontWeight: 600,
          color: '#fbbf24',
          margin: 0
        }} className="serif-font">
          {currentTitle}
        </h2>
      </div>

      {/* Global Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', width: '28rem', maxWidth: '40%' }}>
        <Search 
          size={18} 
          style={{
            position: 'absolute',
            left: '1rem',
            color: '#64748b',
            pointerEvents: 'none'
          }} 
        />
        <input 
          type="text" 
          placeholder="Search papers, patents, grants..."
          className="radial-input"
          style={{
            paddingLeft: '2.5rem',
            fontSize: '0.875rem',
            backgroundColor: '#0a171a',
            border: '1px solid rgba(81, 105, 115, 0.25)'
          }}
        />
      </div>

      {/* Action Icons & User profile info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Notification Bell */}
        <Link 
          to="/alerts" 
          style={{
            position: 'relative',
            color: '#94a3b8',
            padding: '0.5rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            transition: 'background-color 0.2s'
          }}
          className="icon-btn-hover"
        >
          <Bell size={18} />
          <span style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#fbbf24',
            border: '2px solid #0B1A1E'
          }}></span>
        </Link>

        {/* User Card linking to Profile */}
        <Link 
          to="/profile" 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none',
            color: 'inherit',
            padding: '0.35rem 0.75rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(81, 105, 115, 0.1)',
            transition: 'all 0.15s ease'
          }}
          className="profile-btn-hover"
        >
          <div style={{
            width: '1.75rem',
            height: '1.75rem',
            borderRadius: '50%',
            backgroundColor: '#1E3A3F',
            color: '#fbbf24',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            border: '1px solid rgba(251, 191, 36, 0.4)'
          }}>
            {(user?.email || 'U').charAt(0).toUpperCase()}
          </div>
          <span style={{
            fontSize: '0.8rem',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            color: '#f1f5f9'
          }}>
            {userName}
          </span>
        </Link>
      </div>

      <style>{`
        .icon-btn-hover:hover {
          background-color: var(--bg-hover) !important;
          color: var(--text-primary) !important;
        }
        .profile-btn-hover:hover {
          background-color: var(--bg-hover) !important;
          border-color: rgba(251, 191, 36, 0.2) !important;
        }
      `}</style>
    </header>
  )
}

export default TopBar
