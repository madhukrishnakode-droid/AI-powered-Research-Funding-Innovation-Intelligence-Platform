import React, { useEffect, useState } from 'react'
import Navbar from '../components/common/Navbar'
import publicationsService from '../services/publications'

function Publications() {
  const [publications, setPublications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form states
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [title, setTitle] = useState('')
  const [authors, setAuthors] = useState('')
  const [journal, setJournal] = useState('')
  const [pubYear, setPubYear] = useState('')
  const [doi, setDoi] = useState('')

  const fetchPublications = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await publicationsService.list()
      setPublications(data)
    } catch (err) {
      setError('Failed to fetch publications list.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPublications()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    const payload = {
      title,
      authors,
      journal,
      publication_year: parseInt(pubYear),
      doi: doi || null
    }

    try {
      if (editingId) {
        const updated = await publicationsService.update(editingId, payload)
        setPublications(publications.map(p => p.publication_id === editingId ? updated : p))
        setSuccess('Publication entry updated successfully!')
      } else {
        const created = await publicationsService.create(payload)
        setPublications([...publications, created])
        setSuccess('Publication entry added successfully!')
      }
      resetForm()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save publication. Make sure inputs are correct.')
    }
  }

  const handleEdit = (pub) => {
    setIsEditing(true)
    setEditingId(pub.publication_id)
    setTitle(pub.title)
    setAuthors(pub.authors)
    setJournal(pub.journal)
    setPubYear(pub.publication_year.toString())
    setDoi(pub.doi || '')
  }

  const handleDelete = async (pubId) => {
    if (!window.confirm('Are you sure you want to delete this publication?')) return
    setError('')
    setSuccess('')
    try {
      await publicationsService.delete(pubId)
      setPublications(publications.filter(p => p.publication_id !== pubId))
      setSuccess('Publication deleted successfully!')
    } catch (err) {
      setError('Failed to delete publication.')
    }
  }

  const resetForm = () => {
    setIsEditing(false)
    setEditingId(null)
    setTitle('')
    setAuthors('')
    setJournal('')
    setPubYear('')
    setDoi('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f8ff' }}>
      <Navbar />
      <div style={{ padding: '0 2rem 2rem 2rem', maxWidth: '1000px', width: '100%', margin: '0 auto' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 700, color: 'var(--primary-color)', margin: 0 }}>Publications Registry</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Manage your academic journals, papers, and scientific records.</p>
          </div>
          {!isEditing && (
            <button className="btn-primary" onClick={() => setIsEditing(true)}>Add Paper</button>
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

        {/* FORMS */}
        {isEditing && (
          <div className="glass-card" style={{ padding: '2rem', marginBottom: '2.5rem', backgroundColor: '#ffffff' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: 'var(--primary-color)' }}>
              {editingId ? 'Edit Publication Records' : 'Register New Publication Study'}
            </h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Title *</label>
                <input className="input-field" type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Optimization of Federated Learning Protocols" />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Authors * (Comma Separated)</label>
                <input className="input-field" type="text" value={authors} onChange={e => setAuthors(e.target.value)} required placeholder="Jane Doe, John Smith, Bob Lee" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Journal *</label>
                  <input className="input-field" type="text" value={journal} onChange={e => setJournal(e.target.value)} required placeholder="IEEE Journal of Machine Learning" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Year *</label>
                  <input className="input-field" type="number" min="1500" max="2100" value={pubYear} onChange={e => setPubYear(e.target.value)} required placeholder="2026" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>DOI Identifier</label>
                  <input className="input-field" type="text" value={doi} onChange={e => setDoi(e.target.value)} placeholder="10.1002/jml.204" />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button>
                <button type="submit" className="btn-primary">Save Publication</button>
              </div>
            </form>
          </div>
        )}

        {/* LISTINGS */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading publication registries...</div>
        ) : publications.length === 0 ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', backgroundColor: '#ffffff' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '0' }}>You have not recorded any publications yet. Enter details above.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {publications.map((pub) => (
              <div key={pub.publication_id} className="glass-card" style={{ padding: '1.75rem', backgroundColor: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ paddingRight: '1rem' }}>
                  <h3 style={{ fontSize: '1.2rem', color: '#1e293b', marginBottom: '0.5rem', fontWeight: 650 }}>{pub.title}</h3>
                  <p style={{ color: '#475569', fontSize: '0.925rem', marginBottom: '0.5rem' }}>
                    <strong>Authors:</strong> {pub.authors}
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span>📚 <em>{pub.journal}</em></span>
                    <span>•</span>
                    <span>📆 {pub.publication_year}</span>
                    {pub.doi && (
                      <>
                        <span>•</span>
                        <span style={{ fontFamily: 'monospace' }}>DOI: {pub.doi}</span>
                      </>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleEdit(pub)}>Edit</button>
                  <button className="btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleDelete(pub.publication_id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default Publications
