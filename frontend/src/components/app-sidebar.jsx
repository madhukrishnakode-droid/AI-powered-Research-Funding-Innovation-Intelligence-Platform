import React, { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { useAuth } from '../context/AuthContext'
import {
  Home,
  LayoutDashboard,
  FileText,
  BadgeDollarSign,
  BookOpen,
  BarChart3,
  PieChart,
  Users,
  FlaskConical,
  Bell,
  Settings,
  Menu,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react'

const AppSidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { logout } = useAuth()
  const routerState = useRouterState()
  
  const currentPath = routerState.location.pathname

  const menuItems = [
    { name: 'Home', path: '/', icon: Home, section: 'Workspace' },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, section: 'Workspace' },
    
    { name: 'Patents', path: '/patents', icon: FileText, section: 'Modules' },
    { name: 'Funding', path: '/funding', icon: BadgeDollarSign, section: 'Modules' },
    { name: 'Publications', path: '/publications', icon: BookOpen, section: 'Modules' },
    { name: 'Innovation Score', path: '/innovation-score', icon: BarChart3, section: 'Modules' },
    { name: 'Reports', path: '/reports', icon: PieChart, section: 'Modules' },
    { name: 'Collaborations', path: '/collaborations', icon: Users, section: 'Modules' },
    { name: 'Lab Resources', path: '/lab-resources', icon: FlaskConical, section: 'Modules' },
    
    { name: 'Alerts', path: '/alerts', icon: Bell, section: 'System' },
    { name: 'Settings', path: '/settings', icon: Settings, section: 'System' }
  ]

  const groupedItems = {
    Workspace: menuItems.filter(item => item.section === 'Workspace'),
    Modules: menuItems.filter(item => item.section === 'Modules'),
    System: menuItems.filter(item => item.section === 'System')
  }

  return (
    <aside 
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: isCollapsed ? '5rem' : '16rem',
        backgroundColor: '#0B1A1E',
        borderRight: '1px solid rgba(81, 105, 115, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 50,
        transition: 'width 0.2s ease-in-out'
      }}
    >
      {/* Sidebar Header */}
      <div style={{
        height: '4rem',
        display: 'flex',
        alignItems: 'center',
        padding: '0 1.25rem',
        borderBottom: '1px solid rgba(81, 105, 115, 0.15)',
        justifyContent: isCollapsed ? 'center' : 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            backgroundColor: '#1E3A3F',
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fbbf24'
          }}>
            <FlaskConical size={20} />
          </div>
          {!isCollapsed && (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
              <span className="serif-font" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#f1f5f9' }}>Radial</span>
              <span style={{ fontSize: '0.65rem', color: '#fbbf24', border: '1px solid #fbbf24', padding: '0.05rem 0.25rem', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 600 }}>Beta</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation list */}
      <div className="sidebar-scroll" style={{ flexGrow: 1, padding: '1rem 0.5rem' }}>
        {Object.entries(groupedItems).map(([section, items]) => (
          <div key={section} style={{ marginBottom: '1.25rem' }}>
            {!isCollapsed && (
              <h3 style={{
                fontSize: '0.65rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#64748b',
                paddingLeft: '0.75rem',
                marginBottom: '0.5rem',
                fontWeight: 600
              }}>
                {section}
              </h3>
            )}
            <ul style={{ listStyle: 'none' }}>
              {items.map(item => {
                const isActive = currentPath === item.path
                const IconComponent = item.icon
                return (
                  <li key={item.path} style={{ marginBottom: '0.25rem' }}>
                    <Link
                      to={item.path}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.6rem 0.75rem',
                        borderRadius: '0.5rem',
                        color: isActive ? '#fbbf24' : '#94a3b8',
                        backgroundColor: isActive ? '#1A3238' : 'transparent',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        fontWeight: isActive ? 600 : 50,
                        borderLeft: isActive ? '3px solid #fbbf24' : '3px solid transparent',
                        transition: 'all 0.15s ease-in-out'
                      }}
                      className={!isActive ? 'nav-hover-helper' : ''}
                    >
                      <IconComponent size={18} style={{ minWidth: '18px' }} />
                      {!isCollapsed && <span>{item.name}</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div style={{
        padding: '0.75rem',
        borderTop: '1px solid rgba(81, 105, 115, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        <button
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.6rem 0.75rem',
            borderRadius: '0.5rem',
            color: '#ef4444',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.875rem',
            width: '100%',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            transition: 'all 0.15s ease'
          }}
        >
          <LogOut size={18} />
          {!isCollapsed && <span>Logout</span>}
        </button>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.5rem',
            borderRadius: '0.5rem',
            backgroundColor: '#112529',
            border: '1px solid rgba(81, 105, 115, 0.15)',
            color: '#f1f5f9',
            cursor: 'pointer',
            width: '100%',
            transition: 'all 0.15s ease'
          }}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Inline styles for hover classes */}
      <style>{`
        .nav-hover-helper:hover {
          background-color: var(--bg-hover) !important;
          color: var(--text-primary) !important;
        }
      `}</style>
    </aside>
  )
}

export default AppSidebar
