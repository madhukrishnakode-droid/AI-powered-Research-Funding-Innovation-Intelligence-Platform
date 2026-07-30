import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import authService from '../services/auth'

function Register() {
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
      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexGrow: 1, justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '1rem' }}>
      <div className="glass-card" style={{ padding: '2.5rem', width: '100%', maxWidth: '420px', backgroundColor: '#ffffff' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--primary-color)' }}>Create Account</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Join the funding & innovation network.</p>
        
        {error && (
          <div style={{ padding: '0.75rem', borderRadius: '6px', backgroundColor: '#fee2e2', color: '#991b1b', fontSize: '0.875rem', marginBottom: '1rem', fontWeight: 500 }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ padding: '0.75rem', borderRadius: '6px', backgroundColor: '#d1fae5', color: '#065f46', fontSize: '0.875rem', marginBottom: '1rem', fontWeight: 500 }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Full Name</label>
            <input className="input-field" type="text" value={fullName} onChange={e => setFullName(e.target.value)} required placeholder="Dr. Jane Doe" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email Address</label>
            <input className="input-field" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="name@domain.com" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Password</label>
            <input className="input-field" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Account Role</label>
            <select className="select-field" value={role} onChange={e => setRole(e.target.value)}>
              <option value="researcher">Researcher / Innovator</option>
              <option value="funder">Investor / Funder</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <p style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 650 }}>Log in here</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
