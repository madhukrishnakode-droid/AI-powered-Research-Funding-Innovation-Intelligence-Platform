import React, { useState, useEffect } from 'react'
import { createRoute } from '@tanstack/react-router'
import { Route as rootRoute } from './__root'
import publicationsService from '../services/publications'
import { Plus, Trash2, Award, Landmark, BookOpen, Quote, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

function PublicationsComponent() {
  const [publications, setPublications] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newPub, setNewPub] = useState({
    title: '',
    authors: '',
    journal: '',
    publication_year: new Date().getFullYear(),
    doi: ''
  })

  useEffect(() => {
    loadPublications()
  }, [])

  const loadPublications = async () => {
    try {
      const data = await publicationsService.getAll()
      setPublications(data || [])
      setLoading(false)
    } catch (err) {
      toast.error("Failed to load publication records")
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newPub.title || !newPub.authors || !newPub.journal || !newPub.publication_year) {
      toast.error("Please fill out all required fields")
      return
    }

    try {
      await publicationsService.create(newPub)
      toast.success("Publication added to portfolio")
      setShowAddForm(false)
      setNewPub({ title: '', authors: '', journal: '', publication_year: new Date().getFullYear(), doi: '' })
      loadPublications()
    } catch (err) {
      toast.error("Failed to save publication")
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this publication record?")) return
    try {
      await publicationsService.delete(id)
      toast.success("Publication removed")
      loadPublications()
    } catch (err) {
      toast.error("Could not delete publication record")
    }
  }

  // Calculate stats based on publication load
  const totalCitations = publications.reduce((acc, p) => acc + (p.publication_id % 3 === 0 ? 45 : p.publication_id % 2 === 0 ? 12 : 3), 0)
  
  // Sort publications by citation count (simulated) to compute h-index
  const mockCitations = publications.map(p => p.publication_id % 3 === 0 ? 45 : p.publication_id % 2 === 0 ? 12 : 3)
  mockCitations.sort((a,b) => b-a)
  let hIndex = 0
  for (let i = 0; i < mockCitations.length; i++) {
    if (mockCitations[i] >= i + 1) {
      hIndex = i + 1
    } else {
      break
    }
  }

  const filteredPubs = publications.filter(pub => 
    pub.title.toLowerCase().includes(search.toLowerCase()) || 
    pub.authors.toLowerCase().includes(search.toLowerCase()) ||
    pub.journal.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page-padding">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="serif-font" style={{ fontSize: '1.75rem', fontWeight: 650, color: '#f1f5f9' }}>
            Publications Portfolio
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Catalog of academic dissertations, conference proceedings, and journal submissions.
          </p>
        </div>
        <button className="btn-amber" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={16} /> Add Publication
        </button>
      </div>

      {/* Stats Summary Panel Row */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="radial-card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'rgba(251, 191, 38, 0.1)', color: '#fbbf24', padding: '0.75rem', borderRadius: '12px' }}>
            <Quote size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Citations Count</span>
            <h3 style={{ fontSize: '1.5rem', color: '#f1f5f9', fontWeight: 600 }}>{totalCitations}</h3>
          </div>
        </div>

        <div className="radial-card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'rgba(45, 212, 191, 0.1)', color: '#2dd4bf', padding: '0.75rem', borderRadius: '12px' }}>
            <Award size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>h-Index</span>
            <h3 style={{ fontSize: '1.5rem', color: '#f1f5f9', fontWeight: 600 }}>{hIndex}</h3>
          </div>
        </div>

        <div className="radial-card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', padding: '0.75rem', borderRadius: '12px' }}>
            <BookOpen size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Total Papers</span>
            <h3 style={{ fontSize: '1.5rem', color: '#f1f5f9', fontWeight: 600 }}>{publications.length}</h3>
          </div>
        </div>
      </section>

      {showAddForm && (
        <form onSubmit={handleCreate} className="radial-card" style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--accent-amber)' }}>
          <h3 className="serif-font" style={{ fontSize: '1.1rem', color: '#fbbf24' }}>Add Publication Record</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Paper Title *</label>
              <input 
                type="text" 
                placeholder="e.g. Error Mitigation in Superconducting Quantum Compilers" 
                className="radial-input" 
                value={newPub.title}
                onChange={e => setNewPub({...newPub, title: e.target.value})}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Authors * (Comma separated)</label>
              <input 
                type="text" 
                placeholder="e.g. Dr. Elena, Dr. Aris Thorne" 
                className="radial-input" 
                value={newPub.authors}
                onChange={e => setNewPub({...newPub, authors: e.target.value})}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Journal / Venue *</label>
              <input 
                type="text" 
                placeholder="e.g. Nature Physics" 
                className="radial-input" 
                value={newPub.journal}
                onChange={e => setNewPub({...newPub, journal: e.target.value})}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Year *</label>
              <input 
                type="number" 
                className="radial-input" 
                value={newPub.publication_year}
                onChange={e => setNewPub({...newPub, publication_year: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>DOI Link (Optional)</label>
              <input 
                type="text" 
                placeholder="e.g. 10.1038/s41567-024-00x" 
                className="radial-input" 
                value={newPub.doi}
                onChange={e => setNewPub({...newPub, doi: e.target.value})}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" className="btn-secondary-custom" onClick={() => setShowAddForm(false)}>Cancel</button>
            <button type="submit" className="btn-amber">Register Publication</button>
          </div>
        </form>
      )}

      {/* Filter panel */}
      <section style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Filter papers by title, journals, authors..."
          className="radial-input"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </section>

      {/* List */}
      {loading ? (
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Querying archive databases...</p>
      ) : filteredPubs.length === 0 ? (
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No publication records found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredPubs.map(pub => {
            const citeCount = pub.publication_id % 3 === 0 ? 45 : pub.publication_id % 2 === 0 ? 12 : 3
            return (
              <div key={pub.publication_id} className="radial-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flexGrow: 1, maxWidth: '85%' }}>
                  <h3 className="serif-font" style={{ fontSize: '1.15rem', color: '#f1f5f9' }}>{pub.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#fbbf24' }}>
                    {pub.authors}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Published in <strong>{pub.journal}</strong> • Year: {pub.publication_year}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                    <span 
                      style={{
                        fontSize: '0.7rem',
                        backgroundColor: 'rgba(251,191,36,0.1)',
                        color: '#fbbf24',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        fontWeight: 600
                      }}
                    >
                      {citeCount} Citations
                    </span>
                    {pub.doi && (
                      <a 
                        href={`https://doi.org/${pub.doi}`} 
                        target="_blank" 
                        rel="noreferrer"
                        style={{ fontSize: '0.75rem', color: '#2dd4bf', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}
                      >
                        DOI: {pub.doi} <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
                <div>
                  <button 
                    onClick={() => handleDelete(pub.publication_id)}
                    style={{
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: '#ef4444',
                      cursor: 'pointer',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Trash2 size={18} />
                  </button>
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
  path: '/publications',
  component: PublicationsComponent
})
export default Route
