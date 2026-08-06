import React, { useState, useEffect } from 'react'
import { createRoute } from '@tanstack/react-router'
import { Route as rootRoute } from './__root'
import patentsService from '../services/patents'
import publicationsService from '../services/publications'
import { BarChart3, Clock, Rocket, Zap, ArrowUpRight, CheckCircle2 } from 'lucide-react'

function DashboardComponent() {
  const [metrics, setMetrics] = useState({
    patentsCount: 0,
    publicationsCount: 0,
    healthScore: 78,
    novelty: 78,
    translation: 70,
    velocity: 75
  })
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const pats = await patentsService.getAll()
        const pubs = await publicationsService.getAll()
        
        // Fetch dynamic score from innovation-score endpoint
        const responseScore = await fetch('http://localhost:8000/api/v1/innovation-score/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        const scoreData = await responseScore.json()
        
        setMetrics({
          patentsCount: pats.length,
          publicationsCount: pubs.length,
          healthScore: scoreData?.overall_score || 78,
          novelty: scoreData?.metrics?.novelty || 78,
          translation: scoreData?.metrics?.translation || 70,
          velocity: scoreData?.metrics?.velocity || 75
        })

        // Compile activities
        const list = []
        pats.slice(0, 3).forEach(pat => {
          list.push({
            id: `pat-${pat.patent_id}`,
            title: `Patent filed: ${pat.title}`,
            type: 'Patent',
            date: pat.filing_date,
            icon: Rocket,
            color: '#2dd4bf'
          })
        })
        pubs.slice(0, 3).forEach(pub => {
          list.push({
            id: `pub-${pub.publication_id}`,
            title: `Paper published: ${pub.title}`,
            type: 'Publication',
            date: `${pub.publication_year}-01-01`,
            icon: CheckCircle2,
            color: '#fbbf24'
          })
        })
        setActivities(list.sort((a,b) => b.date.localeCompare(a.date)))
        setLoading(false)
      } catch (err) {
        console.warn("Could not retrieve dashboard metrics:", err)
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  return (
    <div className="page-padding">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        
        {/* Dynamic Portfolio Health Circle */}
        <div className="radial-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
            Portfolio Health Index
          </span>
          <div style={{
            position: 'relative',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: `conic-gradient(#fbbf24 ${metrics.healthScore}%, #1a3238 0)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              backgroundColor: '#112529',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1.1
            }}>
              <span className="serif-font" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fbbf24' }}>
                {metrics.healthScore}%
              </span>
              <span style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', marginTop: '4px' }}>
                Excellent
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '1.15rem', fontWeight: 600, color: '#f1f5f9' }}>{metrics.patentsCount}</span>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Patents</p>
            </div>
            <div style={{ borderRight: '1px solid rgba(81, 105, 115, 0.2)' }} />
            <div>
              <span style={{ fontSize: '1.15rem', fontWeight: 600, color: '#f1f5f9' }}>{metrics.publicationsCount}</span>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Papers</p>
            </div>
          </div>
        </div>

        {/* Research Momentum Bars */}
        <div className="radial-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 className="serif-font" style={{ fontSize: '1.1rem', color: '#f1f5f9' }}>
            Intellectual Momentum
          </h3>
          
          {/* Novelty Score */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
              <span style={{ color: '#94a3b8' }}>Novelty & Uniqueness</span>
              <span style={{ color: '#fbbf24', fontWeight: 600 }}>{metrics.novelty}/100</span>
            </div>
            <div style={{ height: '8px', backgroundColor: '#0B1A1E', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${metrics.novelty}%`, height: '100%', backgroundColor: '#fbbf24', borderRadius: '4px' }}></div>
            </div>
          </div>

          {/* Translation Score */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
              <span style={{ color: '#94a3b8' }}>Translation Cap (Patentability)</span>
              <span style={{ color: '#2dd4bf', fontWeight: 600 }}>{metrics.translation}/100</span>
            </div>
            <div style={{ height: '8px', backgroundColor: '#0B1A1E', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${metrics.translation}%`, height: '100%', backgroundColor: '#2dd4bf', borderRadius: '4px' }}></div>
            </div>
          </div>

          {/* velocity */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
              <span style={{ color: '#94a3b8' }}>Execution Velocity</span>
              <span style={{ color: '#34d399', fontWeight: 600 }}>{metrics.velocity}/100</span>
            </div>
            <div style={{ height: '8px', backgroundColor: '#0B1A1E', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${metrics.velocity}%`, height: '100%', backgroundColor: '#34d399', borderRadius: '4px' }}></div>
            </div>
          </div>
        </div>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.5rem' }}>
        
        {/* Workspace Activity Logs */}
        <div className="radial-card">
          <h3 className="serif-font" style={{ fontSize: '1.1rem', color: '#f1f5f9', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={16} /> Activity History
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {loading ? (
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Loading logs...</p>
            ) : activities.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>No recent portfolio changes. Try adding patents or publications.</p>
            ) : (
              activities.map(act => {
                const Icon = act.icon
                return (
                  <div key={act.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <div style={{ padding: '0.4rem', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.03)', color: act.color }}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#e2e8f0' }}>{act.title}</h4>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.15rem' }}>
                        <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>{act.type}</span>
                        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>•</span>
                        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{act.date}</span>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Opportunity Pipelines */}
        <div className="radial-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h3 className="serif-font" style={{ fontSize: '1.1rem', color: '#f1f5f9', marginBottom: '0.5rem' }}>
            Matching Pipeline
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#0B1A1E', borderRadius: '8px', border: '1px solid rgba(81,105,115,0.1)' }}>
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f1f5f9' }}>DOE Decarbonization Grant</h4>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>DOE • High Fit (88%)</p>
              </div>
              <span className="badge-status-examination">Pending Submit</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#0B1A1E', borderRadius: '8px', border: '1px solid rgba(81,105,115,0.1)' }}>
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f1f5f9' }}>NIH Deep Pathology Funding</h4>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>NIH • Outstanding Fit (94%)</p>
              </div>
              <span className="badge-status-granted">94% Semantic Fit</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#0B1A1E', borderRadius: '8px', border: '1px solid rgba(81,105,115,0.1)' }}>
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f1f5f9' }}>Quantum circuit compile mapping</h4>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>USPTO • Under Examination</p>
              </div>
              <span style={{ fontSize: '0.7rem', color: '#818cf8', backgroundColor: 'rgba(129, 140, 248, 0.1)', padding: '0.25rem 0.6rem', borderRadius: '9999px', fontWeight: 600 }}>IP Assets</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardComponent
})
export default Route
