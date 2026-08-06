import React, { useState, useEffect } from 'react'
import { createRoute } from '@tanstack/react-router'
import { Route as rootRoute } from './__root'
import { Bell, Trash2, Calendar, AlertTriangle, BadgeAlert, MailOpen } from 'lucide-react'
import { toast } from 'sonner'

function AlertsComponent() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAlerts()
  }, [])

  const loadAlerts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/alerts/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      setAlerts(data || [])
      setLoading(false)
    } catch (err) {
      toast.error("Failed to query notification inbox")
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/alerts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        toast.success("Notification dismissed")
        loadAlerts()
      } else {
        toast.error("Failed to dismiss notification")
      }
    } catch (err) {
      toast.error("Network error dismissing alert")
    }
  }

  const handleClearAll = async () => {
    if (!window.confirm("Dismiss all alerts in your inbox?")) return
    try {
      // Loop dismiss each
      for (const al of alerts) {
        await fetch(`http://localhost:8000/api/v1/alerts/${al.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      }
      toast.success("Notification inbox cleared")
      loadAlerts()
    } catch (err) {
      toast.error("Error clearing inbox")
    }
  }

  return (
    <div className="page-padding">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="serif-font" style={{ fontSize: '1.75rem', fontWeight: 650, color: '#f1f5f9' }}>
            Alerts Notification Center
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            System activity updates, approaching funding milestones, and collaboration requests.
          </p>
        </div>
        {alerts.length > 0 && (
          <button className="btn-secondary-custom" onClick={handleClearAll} style={{ color: '#ef4444' }}>
            Dismiss All
          </button>
        )}
      </div>

      {loading ? (
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Polling notification feed...</p>
      ) : alerts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: '#64748b' }}>
          <MailOpen size={48} style={{ margin: '0 auto 1rem', color: '#1e3a3f' }} />
          <h4 className="serif-font" style={{ fontSize: '1.15rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Your inbox is clean</h4>
          <p style={{ fontSize: '0.85rem' }}>We will notify you here when new grants, citation spikes or invites match your filters.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {alerts.map(al => {
            const isUrgent = al.urgency === 'Urgent'
            return (
              <div 
                key={al.id} 
                className="radial-card" 
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                  borderLeft: isUrgent ? '4px solid #ef4444' : '4px solid #64748b',
                  backgroundColor: isUrgent ? 'rgba(239, 68, 68, 0.02)' : 'var(--bg-surface)'
                }}
              >
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div style={{ 
                    padding: '0.45rem', 
                    borderRadius: '6px', 
                    backgroundColor: isUrgent ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.03)', 
                    color: isUrgent ? '#ef4444' : '#94a3b8' 
                  }}>
                    {isUrgent ? <AlertTriangle size={18} /> : <Bell size={18} />}
                  </div>
                  <div>
                    <p style={{ fontSize: '0.9rem', color: '#f1f5f9', lineHeight: 1.4 }}>{al.message}</p>
                    <div style={{ display: 'flex', gap: '0.5rem', itemsCenter: 'center', marginTop: '0.25rem', fontSize: '0.75rem', color: '#64748b' }}>
                      <span>Category: <strong>{al.category}</strong></span>
                      <span>•</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.15rem' }}>
                        <Calendar size={10} /> {al.created_at?.split('T')[0] || '2026-08-02'}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <button 
                    onClick={() => handleDelete(al.id)}
                    style={{
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: '#ef4444',
                      cursor: 'pointer',
                      padding: '0.4rem',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Trash2 size={16} />
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
  path: '/alerts',
  component: AlertsComponent
})
export default Route
