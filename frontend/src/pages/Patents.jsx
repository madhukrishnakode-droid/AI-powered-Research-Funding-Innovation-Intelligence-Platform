import React, { useEffect, useState } from 'react'
import Navbar from '../components/common/Navbar'
import patentsService from '../services/patents'

function Patents() {
  const [patents, setPatents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form states
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [title, setTitle] = useState('')
  const [inventor, setInventor] = useState('')
  const [assignee, setAssignee] = useState('')
  const [techDomain, setTechDomain] = useState('')
  const [filingDate, setFilingDate] = useState('')

  const fetchPatents = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await patentsService.list()
      setPatents(data)
    } catch (err) {
      setError('Failed to fetch patents list.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPatents()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    const payload = {
      title,
      inventor,
      assignee,
      technology_domain: techDomain,
      filing_date: filingDate
    }

    try {
      if (editingId) {
        const updated = await patentsService.update(editingId, payload)
        setPatents(patents.map(p => p.patent_id === editingId ? updated : p))
        setSuccess('Patent record updated successfully!')
      } else {
        const created = await patentsService.create(payload)
        setPatents([...patents, created])
        setSuccess('Patent record registered successfully!')
      }
      resetForm()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save patent details. Verify date inputs.')
    }
  }

  const handleEdit = (pt) => {
    setIsEditing(true)
    setEditingId(pt.patent_id)
    setTitle(pt.title)
    setInventor(pt.inventor)
    setAssignee(pt.assignee)
    setTechDomain(pt.technology_domain)
    setFilingDate(pt.filing_date)
  }

  const handleDelete = async (patentId) => {
    if (!window.confirm('Are you sure you want to delete this patent record?')) return
    setError('')
    setSuccess('')
    try {
      await patentsService.delete(patentId)
      setPatents(patents.filter(p => p.patent_id !== patentId))
      setSuccess('Patent record deleted successfully!')
    } catch (err) {
      setError('Failed to delete patent record.')
    }
  }

  const resetForm = () => {
    setIsEditing(false)
    setEditingId(null)
    setTitle('')
    setInventor('')
    setAssignee('')
    setTechDomain('')
    setFilingDate('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f8ff' }}>
      <Navbar />
      <div style={{ padding: '0 2rem 2rem 2rem', maxWidth: '1000px', width: '100%', margin: '0 auto' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 700, color: 'var(--primary-color)', margin: 0 }}>IP & Patents Portal</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Register and track filed intellectual properties, technology claims, and assignments.</p>
          </div>
          {!isEditing && (
            <button className="btn-primary" onClick={() => setIsEditing(true)}>Add Patent</button>
          )}
        </header>

        {success && (
          <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', backgroundColor: '#d1fae5', color: '#065f46', fontWeight: 500, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            {success}
          </div>
        )}

        {error && (
          <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', backgroundColor: '#fee2e2', color: '#991b1b', fontWeight: 500, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            {error}
          </div>
        )}

        {/* DETAILS FORMS */}
        {isEditing && (
          <div className="glass-card" style={{ padding: '2rem', marginBottom: '2.5rem', backgroundColor: '#ffffff' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: 'var(--primary-color)' }}>
              {editingId ? 'Edit Patent Registry Details' : 'Register New Patent Record'}
            </h3>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Patent Title *</label>
                <input className="input-field" type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Neural network weight pruning design algorithm" />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Primary Inventor(s) *</label>
                  <input className="input-field" type="text" value={inventor} onChange={e => setInventor(e.target.value)} required placeholder="Dr. Jane Doe, Dr. Al Morris" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Assignee Institute *</label>
                  <input className="input-field" type="text" value={assignee} onChange={e => setAssignee(e.target.value)} required placeholder="Infosys Tech Licensing LLC" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Technology Domain *</label>
                  <input className="input-field" type="text" value={techDomain} onChange={e => setTechDomain(e.target.value)} required placeholder="Artificial Intelligence / Quantum Networks" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Filing Date *</label>
                  <input className="input-field" type="date" value={filingDate} onChange={e => setFilingDate(e.target.value)} required />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button>
                <button type="submit" className="btn-primary">Register Patent</button>
              </div>
            </form>
          </div>
        )}

        {/* LISTINGS */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading patents list...</div>
        ) : patents.length === 0 ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', backgroundColor: '#ffffff' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '0' }}>You have not registered any patents yet. Enter details above.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {patents.map((patent) => (
              <div key={patent.patent_id} className="glass-card" style={{ padding: '1.75rem', backgroundColor: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ paddingRight: '1rem' }}>
                  <h3 style={{ fontSize: '1.2rem', color: '#1e293b', marginBottom: '0.5rem', fontWeight: 650 }}>{patent.title}</h3>
                  <div style={{ color: '#475569', fontSize: '0.925rem', marginBottom: '0.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 2rem' }}>
                    <span><strong>Inventors:</strong> {patent.inventor}</span>
                    <span><strong>Assignee:</strong> {patent.assignee}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span>🌐 Technology: <strong>{patent.technology_domain}</strong></span>
                    <span>•</span>
                    <span>📅 Filed: {patent.filing_date}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleEdit(patent)}>Edit</button>
                  <button className="btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleDelete(patent.patent_id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default Patents
