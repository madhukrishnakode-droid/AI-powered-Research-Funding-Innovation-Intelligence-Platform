import React, { useState, useEffect } from 'react'
import { createRoute, Link } from '@tanstack/react-router'
import { Route as rootRoute } from './__root'
import { useAuth } from '../context/AuthContext'
import patentsService from '../services/patents'
import publicationsService from '../services/publications'
import { Search, TrendUp, ArrowUpRight, ShieldAlert, Award, FileSpreadsheet, Eye } from 'lucide-react'

// Fetch recent info dynamically
function HomeComponent() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    patentsCount: 0,
    publicationsCount: 0,
    innovationScore: 78,
    oppsCount: 4,
    trendingCitations: 247
  })

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const pats = await patentsService.getAll()
        const pubs = await publicationsService.getAll()

        // Fetch or calculate stats
        const responseScore = await fetch('http://localhost:8000/api/v1/innovation-score/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        const scoreData = await responseScore.json()

        setStats({
          patentsCount: pats.length,
          publicationsCount: pubs.length,
          innovationScore: scoreData?.overall_score || 78,
          oppsCount: 4,
          trendingCitations: (pubs.length * 15) + (pats.length * 24) || 247
        })
      } catch (err) {
        console.warn("Could not load home dynamic stats:", err)
      }
    }
    loadHomeData()
  }, [])

  const trendingTopics = [
    {
      title: "Fault-Tolerant Quantum Circuit Mapping",
      growth: "+142%",
      citations: 284,
      desc: "Architecting quantum compiler pass pipelines minimizing error rates in superconducting substrates.",
      tags: ["Quantum Computing", "Error Correction"]
    },
    {
      title: "Self-Supervised Medical Vision Models",
      growth: "+84%",
      citations: 195,
      desc: "Transfer learning optimizations and cross-modal projection alignments for high-res MRI diagnosis.",
      tags: ["AI Medicine", "Computer Vision"]
    },
    {
      title: "Perovskite Cell Material Photokinetics",
      growth: "+112%",
      citations: 162,
      desc: "Non-equilibrium carrier recombination decays tracking stability parameters of halide structures.",
      tags: ["Materials Science", "Solar Tech"]
    }
  ]

  const recentActivities = [
    { type: 'deadline', text: "Grant application deadline for DOE Clean Energy is approaching on 2026-10-15.", time: "2 days ago" },
    { type: 'patent', text: "Patent status for 'Quantum Circuit Mapping' updated to: GRANTED.", time: "3 days ago" },
    { type: 'pub', text: "Paper accepted in International Journal of Neural Engineering.", time: "1 week ago" }
  ]

  return (
    <div className="page-padding">
      {/* Editorial Hero Banner */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h1 style={{
          fontSize: '2.25rem',
          fontWeight: 'normal',
          color: '#f1f5f9',
          marginBottom: '0.5rem'
        }} className="serif-font">
          Welcome back, <span className="text-gradient" style={{ fontWeight: 600 }}>Dr. {(user?.full_name || 'Elena').replace(/^(dr\.?|prof\.?|mr\.?|ms\.?|mrs\.?)\s+/i, '').split(' ')[0]}</span>
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.925rem' }}>
          Here is your research momentum, intellectual property portfolio, and matching funding opportunities for today.
        </p>
      </section>

      {/* Prominent Center Search bar */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          borderRadius: '0.75rem',
          border: '1px solid rgba(251, 191, 36, 0.4)',
          background: 'linear-gradient(90deg, #112529 0%, #173237 100%)',
          padding: '0.25rem',
          boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)'
        }}>
          <Search size={22} style={{ marginLeft: '1.25rem', color: '#fbbf24' }} />
          <input
            type="text"
            placeholder="Search papers, patents, grants, and researchers..."
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              padding: '1rem',
              color: '#f1f5f9',
              fontSize: '1rem',
              width: '100%',
              fontFamily: 'Public Sans, sans-serif'
            }}
          />
          <button className="btn-amber" style={{ height: '3rem', padding: '0 1.5rem', whiteSpace: 'nowrap' }}>
            Search Engine
          </button>
        </div>
      </section>

      {/* Quick Stats Banner row */}
      <h3 className="serif-font" style={{ fontSize: '1.15rem', color: '#f1f5f9', marginBottom: '1rem', borderBottom: '1px solid rgba(81, 105, 115, 0.15)', paddingBottom: '0.5rem' }}>
        Portfolio Health at a Glance
      </h3>
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem'
      }}>
        {/* Score Card */}
        <Link to="/innovation-score" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="radial-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em' }}>Innovation Score</span>
              <h2 className="serif-font" style={{ fontSize: '2rem', color: '#fbbf24', marginTop: '0.25rem' }}>{stats.innovationScore}<span style={{ fontSize: '1rem', color: '#64748b' }}>/100</span></h2>
            </div>
            <div style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', width: '3rem', height: '3rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyItem: 'center', justifyContent: 'center' }}>
              <Award size={22} />
            </div>
          </div>
        </Link>

        {/* Portfolio Assets count */}
        <Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="radial-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em' }}>Active Portfolio</span>
              <h2 style={{ fontSize: '2rem', color: '#f1f5f9', marginTop: '0.25rem' }}>{stats.patentsCount + stats.publicationsCount} <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 'normal' }}>items</span></h2>
            </div>
            <div style={{ backgroundColor: 'rgba(45, 212, 191, 0.1)', color: '#2dd4bf', width: '3rem', height: '3rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileSpreadsheet size={22} />
            </div>
          </div>
        </Link>

        {/* Grants opportunity */}
        <Link to="/funding" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="radial-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em' }}>New Grants Matching</span>
              <h2 style={{ fontSize: '2rem', color: '#34d399', marginTop: '0.25rem' }}>{stats.oppsCount} <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 'normal' }}>avail</span></h2>
            </div>
            <div style={{ backgroundColor: 'rgba(52, 211, 153, 0.1)', color: '#34d399', width: '3rem', height: '3rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowUpRight size={22} />
            </div>
          </div>
        </Link>

        {/* Citations index */}
        <Link to="/publications" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="radial-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em' }}>Trending Citations</span>
              <h2 style={{ fontSize: '2rem', color: '#e2e8f0', marginTop: '0.25rem' }}>+{stats.trendingCitations}</h2>
            </div>
            <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', width: '3rem', height: '3rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Eye size={22} />
            </div>
          </div>
        </Link>
      </section>

      {/* Grid: Trends Radar vs Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(320px, 1fr)', gap: '1.5rem' }}>
        {/* Core Trends Section */}
        <div>
          <h3 className="serif-font" style={{ fontSize: '1.25rem', color: '#f1f5f9', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Technology & Citations Radar
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {trendingTopics.map((topic, i) => (
              <div key={i} className="radial-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 className="serif-font" style={{ fontSize: '1.05rem', color: '#f1f5f9' }}>{topic.title}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ color: '#fbbf24', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                      {topic.growth}
                    </span>
                    <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{topic.citations} citations</span>
                  </div>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.4 }}>{topic.desc}</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                  {topic.tags.map((tag, j) => (
                    <span key={j} className="badge-topic">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities Section */}
        <div>
          <h3 className="serif-font" style={{ fontSize: '1.25rem', color: '#f1f5f9', marginBottom: '1rem' }}>
            Workspace Updates
          </h3>
          <div className="radial-card" style={{ height: 'calc(100% - 2.5rem)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {recentActivities.map((act, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', borderBottom: i < recentActivities.length - 1 ? '1px solid rgba(81, 105, 115, 0.1)' : 'none', paddingBottom: i < recentActivities.length - 1 ? '0.75rem' : 0 }}>
                <p style={{ color: '#e2e8f0', fontSize: '0.875rem', lineHeight: 1.4 }}>{act.text}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{act.time}</span>
                  {act.type === 'deadline' && (
                    <span style={{ fontSize: '0.65rem', color: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '0.15rem 0.4rem', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 600 }}>Urgent</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomeComponent
})
export default Route
