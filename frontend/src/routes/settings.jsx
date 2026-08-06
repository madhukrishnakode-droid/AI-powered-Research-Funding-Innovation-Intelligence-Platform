import React, { useState, useEffect } from 'react'
import { createRoute } from '@tanstack/react-router'
import { Route as rootRoute } from './__root'
import { Save, Bell, Shield, Sliders } from 'lucide-react'
import { toast } from 'sonner'

function SettingsComponent() {
  const [settings, setSettings] = useState({
    email_alerts: true,
    weekly_digest: false,
    semantic_threshold: 75
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/settings/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      if (data) {
        setSettings({
          email_alerts: data.email_alerts !== undefined ? data.email_alerts : true,
          weekly_digest: data.weekly_digest !== undefined ? data.weekly_digest : false,
          semantic_threshold: data.semantic_threshold || 75
        })
      }
      setLoading(false)
    } catch (err) {
      console.warn("Could not query user settings, using default configurations.")
      setLoading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:8000/api/v1/settings/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        toast.success("System configurations saved")
      } else {
        toast.error("Failed to commit settings configuration")
      }
    } catch (err) {
      toast.error("Network error updating configurations")
    }
  }

  return (
    <div className="page-padding">
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 className="serif-font" style={{ fontSize: '1.75rem', fontWeight: 650, color: '#f1f5f9' }}>
          Workspace Settings
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.25rem' }}>
          Manage your email alerts thresholds, dashboard indices, and semantic matching filters.
        </p>
      </div>

      {loading ? (
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Reading preferences profile...</p>
      ) : (
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '650px' }}>
          
          {/* Notifications config */}
          <div className="radial-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 className="serif-font" style={{ fontSize: '1.15rem', color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bell size={18} /> Update Notifications
            </h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '0.9rem', color: '#f1f5f9' }}>Real-time Email Alerts</strong>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Notify immediately when new matched patents or grant details emerge.</p>
              </div>
              <input 
                type="checkbox" 
                style={{ width: '1.2rem', height: '1.2rem', accentColor: '#fbbf24', cursor: 'pointer' }}
                checked={settings.email_alerts}
                onChange={e => setSettings({...settings, email_alerts: e.target.checked})}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(81,105,115,0.1)', paddingTop: '1rem' }}>
              <div>
                <strong style={{ fontSize: '0.9rem', color: '#f1f5f9' }}>Weekly Digest Report</strong>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Receive weekly breakdown analyses of peer citations and new collaborations.</p>
              </div>
              <input 
                type="checkbox" 
                style={{ width: '1.2rem', height: '1.2rem', accentColor: '#fbbf24', cursor: 'pointer' }}
                checked={settings.weekly_digest}
                onChange={e => setSettings({...settings, weekly_digest: e.target.checked})}
              />
            </div>
          </div>

          {/* Semantic Limit Matcher */}
          <div className="radial-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 className="serif-font" style={{ fontSize: '1.15rem', color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sliders size={18} /> Semantic Matching Threshold
            </h3>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                <span style={{ color: '#94a3b8' }}>Minimum Semantic Score Fit</span>
                <span style={{ color: '#fbbf24', fontWeight: 600 }}>{settings.semantic_threshold}% Match</span>
              </div>
              
              <input 
                type="range" 
                min="50" 
                max="95" 
                step="5"
                style={{ width: '100%', accentColor: '#fbbf24', cursor: 'pointer' }}
                value={settings.semantic_threshold}
                onChange={e => setSettings({...settings, semantic_threshold: parseInt(e.target.value)})}
              />
              <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
                Grants or researchers scoring below this threshold will not appear in recommended matching lists.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-amber" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Save size={16} /> Save Configurations
            </button>
          </div>

        </form>
      )}
    </div>
  )
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsComponent
})
export default Route
