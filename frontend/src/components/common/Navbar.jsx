import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Navbar() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', borderRadius: '0 0 12px 12px', borderTop: 'none', margin: '0 1rem 2rem 1rem', backgroundColor: '#ffffff' }}>
      <div style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--primary-color)' }}>
        RF&II Platform
      </div>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>Dashboard</Link>
        <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`}>Research Profile</Link>
        <Link to="/publications" className={`nav-link ${isActive('/publications') ? 'active' : ''}`}>Publications</Link>
        <Link to="/patents" className={`nav-link ${isActive('/patents') ? 'active' : ''}`}>Patents</Link>
        <Link to="/funding" className={`nav-link ${isActive('/funding') ? 'active' : ''}`}>Funding</Link>
        <Link to="/innovation" className={`nav-link ${isActive('/innovation') ? 'active' : ''}`}>Innovation</Link>
        <button onClick={handleLogout} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', marginLeft: '0.5rem' }}>Logout</button>
      </div>
    </nav>
  )
}

export default Navbar

