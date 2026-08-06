import React, { useState, useEffect } from 'react'
import { createRoute } from '@tanstack/react-router'
import { Route as rootRoute } from './__root'
import patentsService from '../services/patents'
import { Plus, Trash2, Eye, ShieldAlert, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

function PatentsComponent() {
  const [patents, setPatents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  
  // State for adding new Patent
  const [showAddForm, setShowAddForm] = useState(false)
  const [newPatent, setNewPatent] = useState({
    title: '',
    inventor: '',
    assignee: '',
    technology_domain: '',
    filing_date: ''
  })

  // Load user patents
  useEffect(() => {
    loadPatents()
  }, [])

  const loadPatents = async () => {
    try {
      const data = await patentsService.getAll()
      setPatents(data || [])
      setLoading(false)
    } catch (err) {
      toast.error("Failed to load patents")
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newPatent.title || !newPatent.inventor || !newPatent.assignee || !newPatent.technology_domain || !newPatent.filing_date) {
      toast.error("Please fill out all fields")
      return
    }

    try {
      await patentsService.create(newPatent)
      toast.success("Patent record added successfully")
      setShowAddForm(false)
      setNewPatent({ title: '', inventor: '', assignee: '', technology_domain: '', filing_date: '' })
      loadPatents()
    } catch (err) {
      toast.error("Could not register patent record")
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patent record?")) return
    try {
      await patentsService.delete(id)
      toast.success("Patent entry removed")
      loadPatents()
    } catch (err) {
      toast.error("Could not delete patent record")
    }
  }

  // Filter listings
  const filteredPatents = patents.filter(pat => {
    const matchesSearch = pat.title.toLowerCase().includes(search.toLowerCase()) || 
                          pat.inventor.toLowerCase().includes(search.toLowerCase()) ||
                          pat.technology_domain.toLowerCase().includes(search.toLowerCase())
    
    // Status is mock simulated based on length of characters or status from DB
    // Since mock records can be Granted or Under Exam
    const mockStatus = pat.patent_id % 2 === 0 ? 'Granted' : 'Under Examination'
    if (filterStatus === 'All') return matchesSearch
    return matchesSearch && mockStatus === filterStatus
  })

  return (
    <div className="page-padding">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="serif-font" style={{ fontSize: '1.75rem', fontWeight: 650, color: '#f1f5f9' }}>
            Patent Portfolio Management
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Track, query, and catalog pending examinations and active intellectual property filings.
          </p>
        </div>
        <button className="btn-amber" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={16} /> Update Inventory
        </button>
      </div>

      {/* Add Form overlay/card */}
      {showAddForm && (
        <form onSubmit={handleCreate} className="radial-card" style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--accent-amber)' }}>
          <h3 className="serif-font" style={{ fontSize: '1.1rem', color: '#fbbf24' }}>Add Intellectual Property Entry</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Patent Title</label>
              <input 
                type="text" 
                placeholder="e.g. Multi-Pass Compiler Architectures" 
                className="radial-input" 
                value={newPatent.title}
                onChange={e => setNewPatent({...newPatent, title: e.target.value})}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Inventors</label>
              <input 
                type="text" 
                placeholder="e.g. Dr. Elena, Dr. Aris Thorne" 
                className="radial-input" 
                value={newPatent.inventor}
                onChange={e => setNewPatent({...newPatent, inventor: e.target.value})}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Assignee Organization</label>
              <input 
                type="text" 
                placeholder="e.g. MIT CSAIL" 
                className="radial-input" 
                value={newPatent.assignee}
                onChange={e => setNewPatent({...newPatent, assignee: e.target.value})}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Technology Domain</label>
              <input 
                type="text" 
                placeholder="e.g. Quantum Computing" 
                className="radial-input" 
                value={newPatent.technology_domain}
                onChange={e => setNewPatent({...newPatent, technology_domain: e.target.value})}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Filing Date</label>
              <input 
                type="date" 
                className="radial-input" 
                value={newPatent.filing_date}
                onChange={e => setNewPatent({...newPatent, filing_date: e.target.value})}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" className="btn-secondary-custom" onClick={() => setShowAddForm(false)}>Cancel</button>
            <button type="submit" className="btn-amber">Save Record</button>
          </div>
        </form>
      )}

      {/* Query filtration tools */}
      <section style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Filter by title, domains, authors..."
          className="radial-input"
          style={{ flexGrow: 1, minWidth: '250px' }}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select 
          className="radial-input"
          style={{ width: '180px' }}
          value={filterStatus}
          onChange={options => setFilterStatus(options.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Granted">Granted</option>
          <option value="Under Examination">Under Examination</option>
        </select>
      </section>

      {/* Patent Listing cards */}
      {loading ? (
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Querying database registries...</p>
      ) : filteredPatents.length === 0 ? (
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No matching intellectual property assets found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredPatents.map(pat => {
            const isGranted = pat.patent_id % 2 === 0
            return (
              <div key={pat.patent_id} className="radial-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <h3 className="serif-font" style={{ fontSize: '1.2rem', color: '#f1f5f9' }}>{pat.title}</h3>
                    <span className={isGranted ? 'badge-status-granted' : 'badge-status-examination'}>
                      {isGranted ? 'Granted' : 'Under Examination'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.825rem', color: '#94a3b8' }}>
                    Filing ID: USPTO-#{100000 + pat.patent_id} • Date: {pat.filing_date}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#f1f5f9' }}>
                    <strong style={{ color: '#64748b' }}>Inventors:</strong> {pat.inventor}
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                    <span className="badge-topic">{pat.technology_domain}</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', backgroundColor: 'rgba(255,255,255,0.02)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                      Assignee: {pat.assignee}
                    </span>
                  </div>
                </div>
                <div>
                  <button 
                    onClick={() => handleDelete(pat.patent_id)} 
                    style={{
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: '#ef4444',
                      cursor: 'pointer',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
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
  path: '/patents',
  component: PatentsComponent
})
export default Route
