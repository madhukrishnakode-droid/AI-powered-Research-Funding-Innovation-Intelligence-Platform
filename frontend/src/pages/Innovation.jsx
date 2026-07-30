import React from 'react'
import Navbar from '../components/common/Navbar'

function Innovation() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ padding: '0 2rem 2rem 2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        <header>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 600, background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
            Innovation Hub
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Share technology portfolios, request peer review, and register active IP projects.</p>
        </header>

        <section style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', alignItems: 'start' }}>
          
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Register New Innovation</h3>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Project Title</label>
                <input className="input-field" type="text" placeholder="Autonomous Systems" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Field of Study</label>
                <input className="input-field" type="text" placeholder="Robotics / Machine Learning" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Short Summary</label>
                <textarea className="input-field" rows="3" placeholder="Brief technical abstract..." style={{ resize: 'vertical' }}></textarea>
              </div>
              <button className="btn-primary" type="button" onClick={() => alert('Stub submit')}>Register Project</button>
            </form>
          </div>

          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Registered Technology List</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <h4 style={{ color: 'var(--primary-color)', fontSize: '1.05rem' }}>Carbon Capture Membrane Filter</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Bio-Chemical engineering solution aimed at lowering factory exhaust carbon emissions through selective filter membranes.</p>
              </div>
              <div>
                <h4 style={{ color: 'var(--primary-color)', fontSize: '1.05rem' }}>Decentralized Medical Image Classifier</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Leveraging federated machine learning to process medical chest X-rays without exposing HIPAA regulated user identities.</p>
              </div>
            </div>
          </div>

        </section>

      </div>
    </div>
  )
}

export default Innovation
