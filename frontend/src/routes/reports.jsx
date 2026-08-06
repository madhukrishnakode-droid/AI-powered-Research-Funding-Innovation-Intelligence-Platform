import React, { useState, useEffect } from 'react'
import { createRoute } from '@tanstack/react-router'
import { Route as rootRoute } from './__root'
import { FileText, Download, Trash2, Calendar, FileType, Plus } from 'lucide-react'
import { toast } from 'sonner'

function ReportsComponent() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('All')

  // Adding report form state
  const [showAddForm, setShowAddForm] = useState(false)
  const [newReport, setNewReport] = useState({
    title: '',
    report_type: 'PDF',
    file_size: '1.2 MB',
    preview_snippet: ''
  })

  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/reports/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      setReports(data || [])
      setLoading(false)
    } catch (err) {
      toast.error("Failed to query reports collection")
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newReport.title || !newReport.preview_snippet) {
      toast.error("Please enter a title and preview context")
      return
    }

    try {
      const response = await fetch('http://localhost:8000/api/v1/reports/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newReport)
      })

      if (response.ok) {
        toast.success("Intelligence report compiled successfully")
        setShowAddForm(false)
        setNewReport({ title: '', report_type: 'PDF', file_size: '1.2 MB', preview_snippet: '' })
        loadReports()
      } else {
        toast.error("Failed to compile report")
      }
    } catch (err) {
      toast.error("Network error saving report")
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Permantly delete this report from the archive?")) return
    try {
      const response = await fetch(`http://localhost:8000/api/v1/reports/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        toast.success("Report deleted successfully")
        loadReports()
      } else {
        toast.error("Could not complete delete operation")
      }
    } catch (err) {
      toast.error("Network error deleting report")
    }
  }

  const handleDownload = (title) => {
    toast.success(`Exporting: ${title}`)
  }

  const filteredReports = reports.filter(r => {
    if (filterType === 'All') return true
    return r.report_type === filterType
  })

  return (
    <div className="page-padding">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="serif-font" style={{ fontSize: '1.75rem', fontWeight: 650, color: '#f1f5f9' }}>
            Report Library
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Export research portfolios, IP reports, and funding similarity analysis files.
          </p>
        </div>
        <button className="btn-amber" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={16} /> Compile Custom Report
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreate} className="radial-card" style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--accent-amber)' }}>
          <h3 className="serif-font" style={{ fontSize: '1.1rem', color: '#fbbf24' }}>Generate Research Intelligence Report</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Report Focus Title</label>
              <input 
                type="text" 
                placeholder="e.g. Q4 Bioinformatics Pipeline & Asset Map" 
                className="radial-input" 
                value={newReport.title}
                onChange={e => setNewReport({...newReport, title: e.target.value})}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Export Format</label>
              <select 
                className="radial-input" 
                value={newReport.report_type}
                onChange={e => setNewReport({...newReport, report_type: e.target.value})}
              >
                <option value="PDF">Adobe PDF (.pdf)</option>
                <option value="DOCX">Word Document (.docx)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>File Size Simulator</label>
              <input 
                type="text" 
                className="radial-input" 
                value={newReport.file_size}
                onChange={e => setNewReport({...newReport, file_size: e.target.value})}
              />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Abstract Preview / Snippet</label>
              <textarea 
                placeholder="Brief summary of findings contained in this document..." 
                className="radial-input" 
                rows={3}
                style={{ resize: 'vertical' }}
                value={newReport.preview_snippet}
                onChange={e => setNewReport({...newReport, preview_snippet: e.target.value})}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" className="btn-secondary-custom" onClick={() => setShowAddForm(false)}>Cancel</button>
            <button type="submit" className="btn-amber">Compile Document</button>
          </div>
        </form>
      )}

      {/* Categories filter bar */}
      <section style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button 
          className={filterType === 'All' ? 'btn-amber' : 'btn-secondary-custom'}
          onClick={() => setFilterType('All')}
          style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}
        >
          All Formats
        </button>
        <button 
          className={filterType === 'PDF' ? 'btn-amber' : 'btn-secondary-custom'}
          onClick={() => setFilterType('PDF')}
          style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}
        >
          PDFs Only
        </button>
        <button 
          className={filterType === 'DOCX' ? 'btn-amber' : 'btn-secondary-custom'}
          onClick={() => setFilterType('DOCX')}
          style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}
        >
          DOCX Tables
        </button>
      </section>

      {/* Library Grid */}
      {loading ? (
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Querying doc blocks...</p>
      ) : filteredReports.length === 0 ? (
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No documents matching filters found.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {filteredReports.map(rep => (
            <div key={rep.id} className="radial-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div style={{ padding: '0.35rem', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.03)', color: rep.report_type === 'PDF' ? '#ef4444' : '#3b82f6' }}>
                    <FileText size={18} />
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 650 }}>{rep.file_size}</span>
                </div>
                <h3 className="serif-font" style={{ fontSize: '1.05rem', color: '#f1f5f9', lineHeight: 1.3, marginBottom: '0.5rem' }}>{rep.title}</h3>
                <p style={{ fontSize: '0.825rem', color: '#94a3b8', lineHeight: 1.4 }}>
                  {rep.preview_snippet}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(81,105,115,0.1)', paddingTop: '0.75rem', marginTop: 'auto' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Calendar size={12} /> {rep.generated_date?.split('T')[0] || '2026-08-02'}
                </span>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => handleDelete(rep.id)}
                    style={{
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: '#ef4444',
                      cursor: 'pointer',
                      padding: '0.35rem',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Trash2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDownload(rep.title)}
                    style={{
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: '#2dd4bf',
                      cursor: 'pointer',
                      padding: '0.35rem',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(45, 212, 191, 0.1)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Download size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports',
  component: ReportsComponent
})
export default Route
