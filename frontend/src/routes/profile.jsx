import React, { useState, useEffect } from 'react'
import { createRoute } from '@tanstack/react-router'
import { Route as rootRoute } from './__root'
import { useAuth } from '../context/AuthContext'
import { User, Mail, Globe, MapPin, Landmark, Award, BookOpen, Save } from 'lucide-react'
import { toast } from 'sonner'

function ProfileComponent() {
  const { user } = useAuth()
  const [profile, setProfile] = useState({
    bio: "",
    interests: "",
    institution: "",
    title: ""
  })

  useEffect(() => {
    if (user && !profile.title) {
      setProfile(prev => ({
        ...prev,
        title: user.role === 'researcher' ? 'Researcher / PI' : user.role || ''
      }))
    }
  }, [user])
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Read current profile status from auth user profile or settings
    const loadProfile = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/users/me', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (response.ok) {
          const u = await response.json()
          if (u.profile) {
            setProfile({
              bio: u.profile.bio || "",
              interests: u.profile.research_interests || "",
              institution: u.profile.organization || "",
              title: u.profile.designation || (user?.role === 'researcher' ? 'Researcher / PI' : user?.role || "")
            })
          }
        }
      } catch (err) {
        console.warn("Could not load user profile metadata, using defaults.")
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [user])

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:8000/api/v1/users/me/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          bio: profile.bio,
          research_interests: profile.interests,
          organization: profile.institution,
          designation: profile.title
        })
      })

      if (response.ok) {
        toast.success("Researcher profile updated successfully")
        setIsEditing(false)
      } else {
        toast.error("Failed to commit profile updates")
      }
    } catch (err) {
      toast.error("Network error updating profile")
    }
  }

  const interestTags = profile.interests.split(',').map(x => x.trim()).filter(Boolean)

  return (
    <div className="page-padding">
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem', alignItems: 'flex-start' }} className="profile-grid-helper">
        {/* Info Card side panel */}
        <div className="radial-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            backgroundColor: '#1E3A3F',
            color: '#fbbf24',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3.5rem',
            fontWeight: 'bold',
            fontFamily: 'serif-font',
            border: '3px solid #fbbf24',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)'
          }}>
            {(user?.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="serif-font" style={{ fontSize: '1.35rem', color: '#f1f5f9', fontWeight: 650 }}>{user?.full_name || 'Scholar'}</h2>
            <p style={{ color: '#fbbf24', fontSize: '0.85rem', fontWeight: 500, marginTop: '0.25rem' }}>{profile.title}</p>
            <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.25rem' }}>{profile.institution}</p>
          </div>
          
          <div style={{ width: '100%', borderBottom: '1px solid rgba(81,105,115,0.1)' }}></div>
          
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left', fontSize: '0.85rem', color: '#94a3b8' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={16} /> <span>{user?.email || ''}</span>
            </div>
            {profile.institution && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Landmark size={16} /> <span>{profile.institution}</span>
              </div>
            )}
          </div>
          
          {!isEditing && (
            <button className="btn-amber" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setIsEditing(true)}>
              Edit Research Profile
            </button>
          )}
        </div>

        {/* Biography & interests */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {isEditing ? (
            <form onSubmit={handleSave} className="radial-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 className="serif-font" style={{ fontSize: '1.25rem', color: '#fbbf24' }}>Edit Professional Profile</h3>
              
              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Professional Title</label>
                <input 
                  type="text" 
                  className="radial-input" 
                  value={profile.title}
                  onChange={e => setProfile({...profile, title: e.target.value})}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Affiliated Institution</label>
                <input 
                  type="text" 
                  className="radial-input" 
                  value={profile.institution}
                  onChange={e => setProfile({...profile, institution: e.target.value})}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Research Biography</label>
                <textarea 
                  className="radial-input" 
                  rows={4}
                  value={profile.bio}
                  onChange={e => setProfile({...profile, bio: e.target.value})}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Interest Keywords (Comma separated)</label>
                <input 
                  type="text" 
                  className="radial-input" 
                  value={profile.interests}
                  onChange={e => setProfile({...profile, interests: e.target.value})}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" className="btn-secondary-custom" onClick={() => setIsEditing(false)}>Cancel</button>
                <button type="submit" className="btn-amber" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* Profile Details Display */}
              <div className="radial-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3 className="serif-font" style={{ fontSize: '1.25rem', color: '#f1f5f9' }}>Biography</h3>
                <p style={{ color: '#e2e8f0', fontSize: '0.925rem', lineHeight: 1.6 }}>{profile.bio}</p>
              </div>

              {/* Research Interest Tags */}
              <div className="radial-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3 className="serif-font" style={{ fontSize: '1.25rem', color: '#f1f5f9' }}>Scholarly Interests</h3>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {interestTags.length === 0 ? (
                    <p style={{ color: '#64748b', fontSize: '0.85rem' }}>No interests set. Edit profile to configure.</p>
                  ) : (
                    interestTags.map((tag, i) => (
                      <span key={i} className="badge-topic" style={{ fontSize: '0.825rem', padding: '0.35rem 0.75rem' }}>
                        {tag}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Credentials / Affiliations */}
              {profile.institution && (
                <div className="radial-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h3 className="serif-font" style={{ fontSize: '1.25rem', color: '#f1f5f9' }}>Academic & Laboratory Affiliations</h3>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.875rem' }}>
                      <div style={{ padding: '0.4rem', borderRadius: '6px', backgroundColor: 'rgba(251,191,38,0.1)', color: '#fbbf24' }}>
                        <Award size={16} />
                      </div>
                      <div>
                        <strong style={{ color: '#f1f5f9' }}>{profile.institution}</strong>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Primary Affiliation</p>
                      </div>
                    </li>
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .profile-grid-helper {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfileComponent
})
export default Route
