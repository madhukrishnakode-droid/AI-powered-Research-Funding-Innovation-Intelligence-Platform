import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './assets/css/main.css'

console.log('[DIAGNOSTICS] main.jsx execution starts!')
const rootEl = document.getElementById('root')
if (rootEl) {
  rootEl.innerHTML = '<div style="color: #2dd4bf; padding: 2rem; font-weight: bold; text-align: center;">React Mounting...</div>'
}

try {
  const root = ReactDOM.createRoot(rootEl)
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
  console.log('[DIAGNOSTICS] ReactDOM render call complete!')
} catch (err) {
  console.error('[DIAGNOSTICS] Render crashed:', err)
  if (rootEl) {
    rootEl.innerHTML = '<div style="color: #ef4444; padding: 2rem;">ReactDOM Crash: ' + err.message + '</div>'
  }
}
