import React, { useState, useEffect } from 'react'
import { createRoute, Link, useNavigate } from '@tanstack/react-router'
import { Route as rootRoute } from './__root'
import { useAuth } from '../context/AuthContext'
import { ShieldCheck, Mail, Lock, Sparkles, FlaskConical } from 'lucide-react'
import { toast } from 'sonner'

function LoginComponent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, loginWithToken } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Read querystrings for OAuth redirects securely
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const oauthError = params.get('error')

    if (token) {
      setLoading(true)
      toast.info("Signing in via Google auth credentials...")
      loginWithToken(token)
        .then(() => {
          toast.success("Welcome back!")
          navigate({ to: '/' })
        })
        .catch((err) => {
          setError(err.response?.data?.detail || 'Authentication failed during Google login.')
          toast.error("Google Authentication failed")
        })
        .finally(() => {
          setLoading(false)
        })
    } else if (oauthError) {
      setError(decodeURIComponent(oauthError))
    }
  }, [loginWithToken, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      toast.success("Welcome to Radial!")
      navigate({ to: '/' })
    } catch (err) {
      setError(err.response?.data?.detail || 'Incorrect email or password.')
      toast.error("Sign in failed")
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
          Enter your scholarly credentials to enter the workspace.
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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

          <button 
            type="submit" 
            className="btn-amber"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontSize: '0.95rem', marginTop: '0.5rem' }}
          >
            {loading ? 'Entering System...' : 'Sign In'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', color: '#64748b' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(81, 105, 115, 0.15)' }}></div>
          <span style={{ padding: '0 0.75rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>or</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(81, 105, 115, 0.15)' }}></div>
        </div>

        <button 
          onClick={() => window.location.href = 'http://localhost:8000/auth/google'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            width: '100%',
            padding: '0.7rem',
            borderRadius: '0.5rem',
            border: '1px solid rgba(81, 105, 115, 0.25)',
            backgroundColor: 'transparent',
            color: '#f1f5f9',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
          onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="#f1f5f9" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69a5.74 5.74 0 0 1-2.49 3.77v3.1h4.01c2.34-2.16 3.68-5.32 3.68-8.72z"/>
            <path fill="#fbbf24" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-4.01-3.1c-1.12.75-2.54 1.19-3.95 1.19-2.72 0-5.02-1.84-5.85-4.3H2.007v3.13C3.98 21.89 7.73 24 12 24z"/>
            <path fill="#2dd4bf" d="M6.15 14.88a7.19 7.19 0 0 1 0-2.3v-3.13H2.007a11.96 11.96 0 0 0 0 8.56l4.143-3.13z"/>
            <path fill="#f59e0b" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.22 0 12 0 7.73 0 3.98 2.11 2.007 5.37l4.143 3.13c.83-2.46 3.13-4.3 5.85-4.3z"/>
          </svg>
          Continue with Google
        </button>

        <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#94a3b8', textAlign: 'center' }}>
          New researcher? <Link to="/register" style={{ color: '#fbbf24', textDecoration: 'none', fontWeight: 600 }}>Create an account</Link>
        </p>
      </div>
    </div>
  )
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginComponent
})
export default Route
