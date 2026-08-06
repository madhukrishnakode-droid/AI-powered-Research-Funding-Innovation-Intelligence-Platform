import React, { useState, useEffect } from 'react'
import { createRoute } from '@tanstack/react-router'
import { Route as rootRoute } from './__root'
import { Award, Zap, Heart, Sparkles, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

function FundingComponent() {
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [savedGrants, setSavedGrants] = useState([])

  useEffect(() => {
    loadFunding()
  }, [])

  const loadFunding = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8000/api/v1/funding/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      setOpportunities(data || [])
      setLoading(false)
    } catch (err) {
      toast.error("Failed to query opportunities database")
      setLoading(false)
    }
  }

  const toggleSave = (id) => {
    if (savedGrants.includes(id)) {
      setSavedGrants(savedGrants.filter(x => x !== id))
      toast.info("Opportunity removed from saved list")
    } else {
      setSavedGrants([...savedGrants, id])
      toast.success("Opportunity pinned to pipeline")
    }
  }

  return (
    <div className="page-padding">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="serif-font" style={{ fontSize: '1.75rem', fontWeight: 650, color: '#f1f5f9' }}>
            Funding Recommendations
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Semantic matching scans international agencies against your research interests profile.
          </p>
        </div>
        <button 
          className="btn-secondary-custom" 
          onClick={loadFunding}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <RefreshCw size={15} /> Re-Calculate Fit
        </button>
      </div>

      {loading ? (
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Aligning keywords and compiling recommendations...</p>
      ) : opportunities.length === 0 ? (
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No recommended grants matching interests found. Update your profile interests.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
          {opportunities.map(op => {
            const isSaved = savedGrants.includes(op.id)
            const badges = op.match_badges ? op.match_badges.split(',') : []
            
            return (
              <div 
                key={op.id} 
                className="radial-card" 
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1.5rem',
                  flexWrap: 'wrap',
                  borderLeft: op.semantic_fit >= 90 ? '4px solid #fbbf24' : '4px solid rgba(81, 105, 115, 0.2)'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1, maxWidth: '80%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <h3 className="serif-font" style={{ fontSize: '1.15rem', color: '#f1f5f9' }}>{op.title}</h3>
                    <span 
                      style={{
                        padding: '0.2rem 0.5rem',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        backgroundColor: op.semantic_fit >= 90 ? 'rgba(251, 191, 36, 0.12)' : 'rgba(255, 255, 255, 0.05)',
                        color: op.semantic_fit >= 90 ? '#fbbf24' : '#94a3b8',
                        borderRadius: '4px'
                      }}
                    >
                      {op.semantic_fit}% FIT
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: '#94a3b8', flexWrap: 'wrap' }}>
                    <span>Funder: <strong>{op.funder}</strong></span>
                    <span>•</span>
                    <span>Amount: <strong style={{ color: '#2dd4bf' }}>{op.amount_range}</strong></span>
                    <span>•</span>
                    <span>Deadline: <strong>{op.deadline}</strong></span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                    {badges.map((badge, i) => (
                      <span 
                        key={i} 
                        style={{
                          fontSize: '0.68rem',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                          backgroundColor: badge.includes('Topic') ? 'rgba(251,191,36,0.1)' : 'rgba(45,212,191,0.1)',
                          color: badge.includes('Topic') ? '#fbbf24' : '#2dd4bf',
                          fontWeight: 500
                        }}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <button 
                    onClick={() => toggleSave(op.id)}
                    style={{
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: isSaved ? '#fbbf24' : '#94a3b8',
                      cursor: 'pointer',
                      padding: '0.5rem',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Heart size={20} fill={isSaved ? '#fbbf24' : 'transparent'} />
                  </button>
                  <a 
                    href="https://grants.gov" 
                    target="_blank" 
                    rel="noreferrer"
                    className="btn-amber"
                    style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/funding',
  component: FundingComponent
})
export default Route
