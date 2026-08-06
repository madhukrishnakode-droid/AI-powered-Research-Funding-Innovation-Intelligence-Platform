import React, { useState, useEffect } from 'react'
import { createRoute } from '@tanstack/react-router'
import { Route as rootRoute } from './__root'
import { Users, Mail, Compass, HelpCircle, Landmark, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

function CollaborationsComponent() {
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(true)
  const [messageDraft, setMessageDraft] = useState({ partnerId: null, text: '' })

  useEffect(() => {
    loadPartners()
  }, [])

  const loadPartners = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/collaborations/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      setPartners(data || [])
      setLoading(false)
    } catch (err) {
      toast.error("Failed to query collaboration network data")
      setLoading(false)
    }
  }

  const handleSendInvite = (partnerName) => {
    if (!messageDraft.text) {
      toast.error("Please enter invitation message text")
      return
    }
    toast.success(`Collaboration proposal sent to Dr. ${partnerName}`)
    setMessageDraft({ partnerId: null, text: '' })
  }

  return (
    <div className="page-padding">
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 className="serif-font" style={{ fontSize: '1.75rem', fontWeight: 650, color: '#f1f5f9' }}>
          Researcher Collaboration Network
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.25rem' }}>
          Discover scholars and researchers in your domain with matching and highly aligned patents or publications.
          Our semantic overlapping matches you based on academic interest.
        </p>
      </div>

      {loading ? (
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Mapping co-citation indexes and compiling partnerships...</p>
      ) : partners.length === 0 ? (
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No matching collaborators found. Try modifying your research topics.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {partners.map(p => {
            const overlap = p.overlapping_topics ? p.overlapping_topics.split(',') : []
            return (
              <div key={p.id} className="radial-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
                
                {/* Score badge at top right */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  backgroundColor: 'rgba(52, 211, 153, 0.1)',
                  color: '#34d399',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 650
                }}>
                  {p.affinity_score}% Match
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <img 
                    src={p.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'} 
                    alt={p.name}
                    style={{
                      width: '3.5rem',
                      height: '3.5rem',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '1px solid rgba(81,105,115,0.3)'
                    }}
                  />
                  <div>
                    <h3 className="serif-font" style={{ fontSize: '1.1rem', color: '#f1f5f9' }}>Dr. {p.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                      <Landmark size={12} /> {p.institution}
                    </div>
                  </div>
                </div>

                {/* Overlaps and email */}
                <div>
                  <h4 style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Overlapping Interests</h4>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {overlap.map((topic, i) => (
                      <span key={i} className="badge-topic" style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}>
                        {topic.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(81,105,115,0.1)', paddingTop: '1rem', marginTop: 'auto' }}>
                  {messageDraft.partnerId === p.id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <textarea 
                        className="radial-input" 
                        placeholder={`Introduce yourself and describe how your compilation passes overlay...`} 
                        rows={3}
                        style={{ fontSize: '0.8rem' }}
                        value={messageDraft.text}
                        onChange={e => setMessageDraft({ ...messageDraft, text: e.target.value })}
                      />
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button className="btn-secondary-custom" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }} onClick={() => setMessageDraft({ partnerId: null, text: '' })}>
                          Cancel
                        </button>
                        <button className="btn-amber" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }} onClick={() => handleSendInvite(p.name)}>
                          Transmit Proposal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      className="btn-amber" 
                      style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '0.5rem' }}
                      onClick={() => setMessageDraft({ partnerId: p.id, text: `Hello Dr. ${p.name}, I reviewed your work on ${overlap[0] || 'research'} and saw a close affinity with my portfolio. I would love to connect about potential innovation collaborations.` })}
                    >
                      <Mail size={14} /> Send Collab Proposal
                    </button>
                  )}
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
  path: '/collaborations',
  component: CollaborationsComponent
})
export default Route
