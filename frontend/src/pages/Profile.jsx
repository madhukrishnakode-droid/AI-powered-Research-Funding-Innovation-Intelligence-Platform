import React, { useEffect, useState } from 'react'
import Navbar from '../components/common/Navbar'
import { useAuth } from '../context/AuthContext'
import profileService from '../services/profile'

function Profile() {
  const { user, login } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  // Form states
  const [organization, setOrganization] = useState('')
  const [designation, setDesignation] = useState('')
  const [researchDomain, setResearchDomain] = useState('')
  const [technologyArea, setTechnologyArea] = useState('')
  const [researchInterests, setResearchInterests] = useState('')
  const [keywords, setKeywords] = useState('')
  const [bio, setBio] = useState('')

  const fetchProfile = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await profileService.getProfile()
      setProfile(data)
      // Feed form values
      setOrganization(data.organization || '')
      setDesignation(data.designation || '')
      setResearchDomain(data.research_domain || '')
      setTechnologyArea(data.technology_area || '')
      setResearchInterests(data.research_interests || '')
      setKeywords(data.keywords || '')
      setBio(data.bio || '')
    } catch (err) {
      if (err.response?.status === 404) {
        setProfile(null)
      } else {
        setError('Error fetching profile information.')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    const payload = {
      organization,
      designation,
      research_domain: researchDomain,
      technology_area: technologyArea,
      research_interests: researchInterests || null,
      keywords: keywords || null,
      bio: bio || null,
    }

    try {
      if (profile) {
        const updated = await profileService.updateProfile(payload)
        setProfile(updated)
        setSuccess('Profile updated successfully!')
      } else {
        const created = await profileService.createProfile(payload)
        setProfile(created)
        setSuccess('Profile created successfully!')
      }
      setIsEditing(false)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save profile details. Make sure all values are filled.')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you absolutely sure you want to delete your Research Profile? This action cannot be undone.')) return
    setError('')
    setSuccess('')
    try {
      await profileService.deleteProfile()
      setProfile(null)
      // Reset form states
      setOrganization('')
      setDesignation('')
      setResearchDomain('')
      setTechnologyArea('')
      setResearchInterests('')
      setKeywords('')
      setBio('')
      setSuccess('Profile deleted successfully!')
    } catch (err) {
      setError('Failed to delete profile. Please try again.')
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f8ff' }}>
        <Navbar />
        <div style={{ display: 'flex', flexGrow: 1, justifyContent: 'center', alignItems: 'center', color: 'var(--primary-color)', fontSize: '1.25rem', fontWeight: 600 }}>
          Loading Research Profile Context...
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f8ff' }}>
      <Navbar />
      <div style={{ padding: '0 2rem 2rem 2rem', maxSelfAlign: 'center', maxWidth: '800px', width: '100%', margin: '0 auto' }}>
        
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 700, color: 'var(--primary-color)', margin: 0 }}>Research Profile</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your professional details, university designation, and research fields.</p>
        </header>

        {success && (
          <div style={{ padding: '0.75rem 1rem', mdBorderRadius: '8px', borderRadius: '8px', backgroundColor: '#d1fae5', color: '#065f46', fontWeight: 500, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            {success}
          </div>
        )}

        {error && (
          <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', backgroundColor: '#fee2e2', color: '#991b1b', fontWeight: 500, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            {error}
          </div>
        )}

        {/* PROFILE STATE MANAGER */}
        {!profile && !isEditing ? (
          <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center', backgroundColor: '#ffffff' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#1e293b' }}>Setup Your Academic Profile</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>You have not initialized your research profile metadata yet. Setup your primary organization, domain details, research domains, and bios to hook research funding filters.</p>
            <button className="btn-primary" onClick={() => setIsEditing(true)}>Create Profile Now</button>
          </div>
        ) : isEditing || !profile ? (
          <div className="glass-card" style={{ padding: '2rem', backgroundColor: '#ffffff' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
              {profile ? 'Edit Profile Details' : 'Configure Profile Details'}
            </h3>
            
            <form onSubmit={handleCreateOrUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Organization *</label>
                  <input className="input-field" type="text" value={organization} onChange={e => setOrganization(e.target.value)} required placeholder="Infosys Technical University" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Designation *</label>
                  <input className="input-field" type="text" value={designation} onChange={e => setDesignation(e.target.value)} required placeholder="Lead Researcher / Associate Prof" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Primary Research Domain *</label>
                  <input className="input-field" type="text" value={researchDomain} onChange={e => setResearchDomain(e.target.value)} required placeholder="AI / Biotechnology / Grid Systems" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Technology Area *</label>
                  <input className="input-field" type="text" value={technologyArea} onChange={e => setTechnologyArea(e.target.value)} required placeholder="Machine Learning / Quantum Cryptography" />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Research Interests</label>
                <input className="input-field" type="text" value={researchInterests} onChange={e => setResearchInterests(e.target.value)} placeholder="Neural Network Optimizations, Decentralized Ledger Systems" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Keywords (Comma Separated)</label>
                <input className="input-field" type="text" value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="AI, Blockchain, security, networks" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Bio / Description</label>
                <textarea className="input-field" value={bio} onChange={e => setBio(e.target.value)} rows="4" style={{ resize: 'vertical', fontFamily: 'inherit' }} placeholder="Provide a brief background detailing your research efforts..." />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                {profile && (
                  <button type="button" className="btn-secondary" onClick={() => { setIsEditing(false); setError(''); }}>
                    Cancel
                  </button>
                )}
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="glass-card" style={{ padding: '2.5rem', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 650, color: '#1e293b', margin: 0 }}>{profile.designation}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginTop: '0.2rem' }}>{profile.organization}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }} onClick={() => setIsEditing(true)}>Edit</button>
                <button className="btn-danger" onClick={handleDelete}>Delete</button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <h4 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.35rem', fontWeight: 600 }}>Research Domain</h4>
                <p style={{ fontWeight: 550 }}>{profile.research_domain}</p>
              </div>
              <div>
                <h4 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.35rem', fontWeight: 600 }}>Technology Area</h4>
                <p style={{ fontWeight: 550 }}>{profile.technology_area}</p>
              </div>
            </div>

            {profile.research_interests && (
              <div>
                <h4 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.35rem', fontWeight: 600 }}>Research Interests</h4>
                <p>{profile.research_interests}</p>
              </div>
            )}

            {profile.keywords && (
              <div>
                <h4 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.35rem', fontWeight: 600 }}>Keywords</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
                  {profile.keywords.split(',').map((kw, i) => (
                    <span key={i} className="badge badge-sky" style={{ textTransform: 'none' }}>{kw.trim()}</span>
                  ))}
                </div>
              </div>
            )}

            {profile.bio && (
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
                <h4 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600 }}>About Researcher</h4>
                <p style={{ color: '#334155', whiteSpace: 'pre-line', lineHeight: '1.6' }}>{profile.bio}</p>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  )
}

export default Profile
