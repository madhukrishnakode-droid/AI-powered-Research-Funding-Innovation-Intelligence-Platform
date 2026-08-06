import React, { useState, useEffect } from 'react'
import { createRoute } from '@tanstack/react-router'
import { Route as rootRoute } from './__root'
import { CheckCircle2, TrendingUp, Sparkles, AlertCircle, HelpCircle } from 'lucide-react'
import { toast } from 'sonner'

function InnovationScoreComponent() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInnovationData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/innovation-score/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        const res = await response.json()
        setData(res)
        setLoading(false)
      } catch (err) {
        toast.error("Failed to compile innovation metrics")
        setLoading(false)
      }
    }
    fetchInnovationData()
  }, [])

  if (loading) {
    return <div className="page-padding"><p style={{ color: '#64748b', fontSize: '0.9rem' }}>Compiling comparative performance analytics...</p></div>
  }

  const score = data?.overall_score ?? 0
  const metrics = data?.metrics || { novelty: 0, translation: 0, velocity: 0, collaboration: 0, funding_efficiency: 0 }
  const benchmarks = data?.benchmarks || { global_average: 68, peer_percentile: 0, field_leader_score: 92 }
  const suggestions = data?.suggested_improvements || []

  return (
    <div className="page-padding">
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 className="serif-font" style={{ fontSize: '1.75rem', fontWeight: 650, color: '#f1f5f9' }}>
          Innovation Health Analytics
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.25rem' }}>
          Real-time measurement of portfolio capability, novelty indexes, and translation velocities.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        
        {/* Main Score dial */}
        <div className="radial-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2.5rem' }}>
          <h3 style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
            Composite Innovation Score
          </h3>
          <div style={{
            position: 'relative',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: `conic-gradient(#fbbf24 ${score}%, #1a3238 0)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)'
          }}>
            <div style={{
              width: '130px',
              height: '130px',
              borderRadius: '50%',
              backgroundColor: '#112529',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1.1
            }}>
              <span className="serif-font" style={{ fontSize: '2.75rem', fontWeight: 'bold', color: '#fbbf24' }}>
                {score}
              </span>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', marginTop: '4px', letterSpacing: '0.05em' }}>
                {score > 0 ? 'Outperforming' : 'Baseline'}
              </span>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '1.5rem', textAlign: 'center' }}>
            {score > 0 ? (
              <>Your research output ranks in the <strong>{benchmarks.peer_percentile}th percentile</strong> among global peers in this scientific domain.</>
            ) : (
              <>Add publication or patent records to initiate innovation metric tracking.</>
            )}
          </p>
        </div>

        {/* Benchmarks comparative chart */}
        <div className="radial-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 className="serif-font" style={{ fontSize: '1.15rem', color: '#f1f5f9' }}>Comparative Benchmarks</h3>
          
          {/* Peer percentile */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
              <span style={{ color: '#94a3b8' }}>Your Score</span>
              <span style={{ color: '#fbbf24', fontWeight: 600 }}>{score}</span>
            </div>
            <div style={{ height: '8px', backgroundColor: '#0B1A1E', borderRadius: '4px' }}>
              <div style={{ width: `${score}%`, height: '100%', backgroundColor: '#fbbf24', borderRadius: '4px' }}></div>
            </div>
          </div>

          {/* Average */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
              <span style={{ color: '#94a3b8' }}>Global Cohort Average</span>
              <span style={{ color: '#94a3b8', fontWeight: 600 }}>{benchmarks.global_average}</span>
            </div>
            <div style={{ height: '8px', backgroundColor: '#0B1A1E', borderRadius: '4px' }}>
              <div style={{ width: `${benchmarks.global_average}%`, height: '100%', backgroundColor: '#64748b', borderRadius: '4px' }}></div>
            </div>
          </div>

          {/* Leader */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
              <span style={{ color: '#94a3b8' }}>Field Leader Score</span>
              <span style={{ color: '#2dd4bf', fontWeight: 600 }}>{benchmarks.field_leader_score}</span>
            </div>
            <div style={{ height: '8px', backgroundColor: '#0B1A1E', borderRadius: '4px' }}>
              <div style={{ width: `${benchmarks.field_leader_score}%`, height: '100%', backgroundColor: '#2dd4bf', borderRadius: '4px' }}></div>
            </div>
          </div>
        </div>

      </div>

      {/* Grid of sub-scores */}
      <h3 className="serif-font" style={{ fontSize: '1.25rem', color: '#f1f5f9', marginBottom: '1rem', borderBottom: '1px solid rgba(81, 105, 115, 0.15)', paddingBottom: '0.5rem' }}>
        Metrics Breakdown
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        {Object.entries(metrics).map(([key, val]) => {
          const title = key.split('_').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(' ')
          return (
            <div key={key} className="radial-card">
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em' }}>{title}</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '0.5rem' }}>
                <h3 className="serif-font" style={{ fontSize: '1.75rem', color: '#fbbf24', fontWeight: 600 }}>{val}</h3>
                <span style={{ fontSize: '0.75rem', color: '#34d399' }}>+4.2%</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Suggested improvements */}
      <div className="radial-card" style={{ border: '1px solid rgba(251, 191, 36, 0.15)' }}>
        <h3 className="serif-font" style={{ fontSize: '1.15rem', color: '#fbbf24', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} /> Actionable Portfolio Insights
        </h3>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {suggestions.map((sug, i) => (
            <li key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', fontSize: '0.875rem', color: '#e2e8f0', lineHeight: 1.4 }}>
              <CheckCircle2 size={16} style={{ color: '#34d399', minWidth: '16px', marginTop: '2px' }} />
              <span>{sug}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  )
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/innovation-score',
  component: InnovationScoreComponent
})
export default Route
