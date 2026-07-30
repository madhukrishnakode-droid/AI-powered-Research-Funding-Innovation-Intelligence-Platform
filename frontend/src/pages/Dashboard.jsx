import React, { useEffect, useState } from 'react'
import Navbar from '../components/common/Navbar'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import publicationsService from '../services/publications'
import patentsService from '../services/patents'

function Dashboard() {
  const { user } = useAuth()
  const [pubCount, setPubCount] = useState(0)
  const [patentCount, setPatentCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const pubs = await publicationsService.list()
        const patents = await patentsService.list()
        setPubCount(pubs.length)
        setPatentCount(patents.length)
      } catch (err) {
        console.error('Failed to load portfolio stats:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f8ff' }}>
      <Navbar />
      <div style={{ padding: '0 2rem 2rem 2rem', display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary-color)', margin: 0 }}>
              Intelligence Dashboard
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Welcome, {user?.full_name || 'Researcher'}. Access your portfolio, funding details, and intelligence modules.</p>
          </div>
          <span className="badge badge-blue">{user?.role || 'User'}</span>
        </header>

        {/* Overview Stats Cards */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          
          <div className="glass-card" style={{ padding: '2rem', backgroundColor: '#ffffff' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>Research Profile</h3>
            {user?.profile ? (
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  <strong>{user.profile.designation}</strong> at {user.profile.organization}
                </p>
                <Link to="/profile" className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>View Profile</Link>
              </div>
            ) : (
              <div>
                <p style={{ color: '#ef4444', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: 500 }}>No active profile details found.</p>
                <Link to="/profile" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Initialize Profile</Link>
              </div>
            )}
          </div>

          <div className="glass-card" style={{ padding: '2rem', backgroundColor: '#ffffff' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>My Publications</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>Manage journals, authored studies, and index DOIs.</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary-color)' }}>{loading ? '...' : pubCount}</span>
              <Link to="/publications" className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Manage</Link>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '2rem', backgroundColor: '#ffffff' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>My Patents</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>Track filed intellectual properties, technology scopes, and inventors.</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--secondary-color)' }}>{loading ? '...' : patentCount}</span>
              <Link to="/patents" className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Manage</Link>
            </div>
          </div>

        </section>

        {/* Features Modules */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
          
          <div className="glass-card" style={{ padding: '2rem', backgroundColor: '#ffffff' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>Funding Opportunities</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Scan institutional funding tracks, eligibility demands, and submit research applications.</p>
            <Link to="/funding" className="btn-primary">Explore Schemes</Link>
          </div>

          <div className="glass-card" style={{ padding: '2rem', backgroundColor: '#ffffff' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: 'var(--secondary-color)' }}>Innovation Hub Projects</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Collaborate on active innovation tasks, technology pipelines, and intellectual assets.</p>
            <Link to="/innovation" className="btn-primary">View Projects</Link>
          </div>

        </section>

      </div>
    </div>
  )
}

export default Dashboard
