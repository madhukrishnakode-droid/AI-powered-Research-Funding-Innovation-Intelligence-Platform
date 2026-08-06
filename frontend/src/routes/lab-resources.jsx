import React, { useState, useEffect } from 'react'
import { createRoute } from '@tanstack/react-router'
import { Route as rootRoute } from './__root'
import { FlaskConical, Calendar, Clock, Plus, ShieldCheck, Zap } from 'lucide-react'
import { toast } from 'sonner'

function LabResourcesComponent() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [bookingFields, setBookingFields] = useState({ resourceId: null, date: '', duration: '1 Hour' })

  // Adding custom asset state
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAsset, setNewAsset] = useState({
    name: '',
    type: 'Hardware',
    status: 'Available',
    location: ''
  })

  useEffect(() => {
    loadResources()
  }, [])

  const loadResources = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/lab-resources/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      setResources(data || [])
      setLoading(false)
    } catch (err) {
      toast.error("Failed to query shared lab machinery inventory")
      setLoading(false)
    }
  }

  const handleCreateAsset = async (e) => {
    e.preventDefault()
    if (!newAsset.name || !newAsset.location) {
      toast.error("Please fill out name and location details")
      return
    }

    try {
      const response = await fetch('http://localhost:8000/api/v1/lab-resources/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newAsset)
      })

      if (response.ok) {
        toast.success("Lab asset cataloged in registry")
        setShowAddForm(false)
        setNewAsset({ name: '', type: 'Hardware', status: 'Available', location: '' })
        loadResources()
      } else {
        toast.error("Failed to add resource")
      }
    } catch (err) {
      toast.error("Network error adding resource")
    }
  }

  const handleBook = async (id, resourceName) => {
    if (!bookingFields.date) {
      toast.error("Please select a reservation date")
      return
    }

    try {
      const response = await fetch(`http://localhost:8000/api/v1/lab-resources/${id}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          booking_date: bookingFields.date,
          hours: parseInt(bookingFields.duration.split(' ')[0]) || 1
        })
      })

      if (response.ok) {
        toast.success(`Booked ${resourceName} for ${bookingFields.date}`)
        setBookingFields({ resourceId: null, date: '', duration: '1 Hour' })
        loadResources()
      } else {
        toast.error("Failed to complete booking")
      }
    } catch (err) {
      toast.error("Network error executing booking")
    }
  }

  const handleRelease = async (id, name) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/lab-resources/${id}/release`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        toast.success(`Reservation for ${name} has been released`)
        loadResources()
      } else {
        toast.error("Failed to cancel reservation")
      }
    } catch (err) {
      toast.error("Network error removing reservation")
    }
  }

  return (
    <div className="page-padding">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="serif-font" style={{ fontSize: '1.75rem', fontWeight: 650, color: '#f1f5f9' }}>
            Lab & Computational Resources
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Schedule and lock allocation reservations on high-performance arrays and laboratory instrumentation.
          </p>
        </div>
        <button className="btn-amber" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={16} /> Register New Tool
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreateAsset} className="radial-card" style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--accent-amber)' }}>
          <h3 className="serif-font" style={{ fontSize: '1.1rem', color: '#fbbf24' }}>Add Lab Device / Instrument</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Resource / Tool Name *</label>
              <input 
                type="text" 
                placeholder="e.g. NVIDIA H100 GPU Cluster" 
                className="radial-input" 
                value={newAsset.name}
                onChange={e => setNewAsset({...newAsset, name: e.target.value})}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Asset Type</label>
              <select 
                className="radial-input" 
                value={newAsset.type}
                onChange={e => setNewAsset({...newAsset, type: e.target.value})}
              >
                <option value="Hardware">Hardware Instrument</option>
                <option value="Computational">Compute / Cloud Array</option>
                <option value="Chemical">Material / Chemical Reagent</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Initial Status</label>
              <select 
                className="radial-input" 
                value={newAsset.status}
                onChange={e => setNewAsset({...newAsset, status: e.target.value})}
              >
                <option value="Available">Available</option>
                <option value="Booked">In-Use / Booked</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Location Area *</label>
              <input 
                type="text" 
                placeholder="e.g. Server Room B-12" 
                className="radial-input" 
                value={newAsset.location}
                onChange={e => setNewAsset({...newAsset, location: e.target.value})}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" className="btn-secondary-custom" onClick={() => setShowAddForm(false)}>Cancel</button>
            <button type="submit" className="btn-amber">Save Asset</button>
          </div>
        </form>
      )}

      {/* Grid List */}
      {loading ? (
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Cataloging cluster endpoints...</p>
      ) : resources.length === 0 ? (
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No shared campus lab tools registered yet.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {resources.map(res => {
            const isBooked = res.status === 'Booked'
            return (
              <div key={res.id} className="radial-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div style={{ padding: '0.4rem', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.03)', color: '#2dd4bf' }}>
                      <FlaskConical size={18} />
                    </div>
                    <span className={!isBooked ? 'badge-status-granted' : 'badge-status-examination'}>
                      {!isBooked ? 'Available' : 'Booked'}
                    </span>
                  </div>
                  <h3 className="serif-font" style={{ fontSize: '1.15rem', color: '#f1f5f9', marginBottom: '0.25rem' }}>{res.name}</h3>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Type: {res.type} • Location: {res.location}
                  </p>
                  
                  {isBooked && res.booked_until && (
                    <p style={{ fontSize: '0.78rem', color: '#fbbf24', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={12} /> Booked until: {res.booked_until.split('T')[0]} (Dr. Elena)
                    </p>
                  )}
                </div>

                <div style={{ borderTop: '1px solid rgba(81,105,115,0.1)', paddingTop: '0.75rem', marginTop: 'auto' }}>
                  {isBooked ? (
                    <button 
                      onClick={() => handleRelease(res.id, res.name)}
                      className="btn-secondary-custom" 
                      style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '0.45rem' }}
                    >
                      Release Reservation
                    </button>
                  ) : bookingFields.resourceId === res.id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <input 
                        type="date"
                        className="radial-input"
                        style={{ fontSize: '0.8rem', padding: '0.4rem' }}
                        value={bookingFields.date}
                        onChange={e => setBookingFields({...bookingFields, date: e.target.value})}
                      />
                      <select 
                        className="radial-input" 
                        style={{ fontSize: '0.8rem', padding: '0.4rem' }}
                        value={bookingFields.duration}
                        onChange={e => setBookingFields({...bookingFields, duration: e.target.value})}
                      >
                        <option>1 Hour</option>
                        <option>2 Hours</option>
                        <option>4 Hours</option>
                        <option>8 Hours</option>
                      </select>
                      <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'flex-end' }}>
                        <button className="btn-secondary-custom" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }} onClick={() => setBookingFields({ resourceId: null, date: '', duration: '1 Hour' })}>
                          Cancel
                        </button>
                        <button className="btn-amber" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }} onClick={() => handleBook(res.id, res.name)}>
                          Lock Booking
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      className="btn-amber" 
                      style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '0.45rem' }}
                      onClick={() => setBookingFields({...bookingFields, resourceId: res.id})}
                    >
                      <Calendar size={14} /> Schedule Usage
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
  path: '/lab-resources',
  component: LabResourcesComponent
})
export default Route
