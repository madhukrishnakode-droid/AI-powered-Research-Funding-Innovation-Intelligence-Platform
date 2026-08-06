import React, { useState, useEffect } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, loginWithToken } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')
    const oauthError = searchParams.get('error')

    if (token) {
      setLoading(true)
      setError('')
      loginWithToken(token)
        .then(() => {
          navigate('/dashboard')
        })
        .catch((err) => {
          setError(err.response?.data?.detail || 'Authentication failed during Google login.')
        })
        .finally(() => {
          setLoading(false)
        })
    } else if (oauthError) {
      setError(decodeURIComponent(oauthError))
    }
  }, [searchParams, loginWithToken, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Incorrect email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexGrow: 1, justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '1rem' }}>
      <div className="glass-card" style={{ padding: '2.5rem', width: '100%', maxWidth: '420px', backgroundColor: '#ffffff' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--primary-color)' }}>Welcome Back</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Login to access funding & innovation tools.</p>
        
        {error && (
          <div style={{ padding: '0.75rem', borderRadius: '6px', backgroundColor: '#fee2e2', color: '#991b1b', fontSize: '0.875rem', marginBottom: '1rem', fontWeight: 500 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email Address</label>
            <input className="input-field" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="name@domain.com" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Password</label>
            <input className="input-field" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
          </div>
          <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', color: 'var(--text-secondary)' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
          <span style={{ padding: '0 0.75rem', fontSize: '0.875rem' }}>or</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
        </div>

        <button 
          onClick={() => window.location.href = 'http://localhost:8000/auth/google'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            width: '100%',
            padding: '0.75rem',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            backgroundColor: '#ffffff',
            color: '#374151',
            fontSize: '0.95rem',
            fontWeight: 550,
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
          type="button"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69a5.74 5.74 0 0 1-2.49 3.77v3.1h4.01c2.34-2.16 3.68-5.32 3.68-8.72z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-4.01-3.1c-1.12.75-2.54 1.19-3.95 1.19-2.72 0-5.02-1.84-5.85-4.3H2.007v3.13C3.98 21.89 7.73 24 12 24z"/>
            <path fill="#FBBC05" d="M6.15 14.88a7.19 7.19 0 0 1 0-2.3v-3.13H2.007a11.96 11.96 0 0 0 0 8.56l4.143-3.13z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.22 0 12 0 7.73 0 3.98 2.11 2.007 5.37l4.143 3.13c.83-2.46 3.13-4.3 5.85-4.3z"/>
          </svg>
          Continue with Google
        </button>
        
        <p style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 650 }}>Register here</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
