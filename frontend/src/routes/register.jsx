import React, { useState } from 'react'
import { createRoute, Link, useNavigate } from '@tanstack/react-router'
import { Route as rootRoute } from './__root'
import authService from '../services/auth'
import { User, Mail, Lock, Award, FlaskConical } from 'lucide-react'
import { toast } from 'sonner'

function RegisterComponent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('researcher')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      await authService.register(email, password, fullName, role)
      setSuccess('Registration successful! Redirecting to login...')
      toast.success("Account created successfully")
      setTimeout(() => {
        navigate({ to: '/login' })
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Try again.')
      toast.error("Account registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#0B1A1E',
      padding: '1.5rem'
    }}>
      <div className="radial-card" style={{
        width: '100%',
        maxWidth: '430px',
        padding: '2.5rem',
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.6)',
        border: '1px solid rgba(81, 105, 115, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', justifyContent: 'center' }}>
          <div style={{
            backgroundColor: '#1E3A3F',
            width: '2.75rem',
            height: '2.75rem',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fbbf24'
          }}>
            <FlaskConical size={22} />
          </div>
          <span className="serif-font" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f1f5f9' }}>Radial</span>
        </div>

        <p style={{ color: '#94a3b8', fontSize: '0.875rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          Create an account to join the scholarly intelligence network.
        </p>

        {error && (
          <div style={{
            padding: '0.75rem',
            borderRadius: '6px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#ef4444',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
            fontWeight: 500
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            padding: '0.75rem',
            borderRadius: '6px',
            backgroundColor: 'rgba(52, 211, 153, 0.1)',
            border: '1px solid rgba(52, 211, 153, 0.2)',
            color: '#34d399',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
            fontWeight: 500
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <User size={16} style={{ position: 'absolute', left: '1rem', color: '#64748b' }} />
              <input 
                type="text" 
                required 
                placeholder="Dr. Elena Rostova" 
                className="radial-input"
                style={{ paddingLeft: '2.5rem', fontSize: '0.9rem' }}
                value={fullName}
                onChange={e => setFullName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={16} style={{ position: 'absolute', left: '1rem', color: '#64748b' }} />
              <input 
                type="email" 
                required 
                placeholder="name@radial.edu" 
                className="radial-input"
                style={{ paddingLeft: '2.5rem', fontSize: '0.9rem' }}
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={16} style={{ position: 'absolute', left: '1rem', color: '#64748b' }} />
              <input 
                type="password" 
                required 
                placeholder="••••••••" 
                className="radial-input"
                style={{ paddingLeft: '2.5rem', fontSize: '0.9rem' }}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Account Role</label>
            <select 
              className="radial-input"
              style={{ fontSize: '0.9rem' }}
              value={role} 
              onChange={e => setRole(e.target.value)}
            >
              <option value="researcher">Researcher / PI</option>
              <option value="funder">Funder / Investor</option>
              <option value="admin">System Administrator</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="btn-amber"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontSize: '0.95rem', marginTop: '0.5rem' }}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#94a3b8', textAlign: 'center' }}>
          Have an account? <Link to="/login" style={{ color: '#fbbf24', textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  )
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterComponent
})
export default Route
