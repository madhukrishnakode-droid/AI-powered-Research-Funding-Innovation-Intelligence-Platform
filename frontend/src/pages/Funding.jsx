import React from 'react'
import Navbar from '../components/common/Navbar'

function Funding() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ padding: '0 2rem 2rem 2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        <header>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 600, background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
            Funding Opportunities
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Explore and request federal, corporational, or public research grants.</p>
        </header>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>AI Research and Innovation Grant</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>National Science Foundation • Deadline: Sep 15, 2026</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>$250,000</div>
              <button className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', marginTop: '0.5rem' }}>Apply</button>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>Quantum Computing Laboratory Initiative</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Department of Energy Union • Deadline: Nov 01, 2026</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>$1,200,000</div>
              <button className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', marginTop: '0.5rem' }}>Apply</button>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}

export default Funding
