import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './dark-mode.css'
import './dark-mode-overrides.css'
import './common-layouts.css'
import './mobile-adjustments.css'
import './landscape.css'
import App from './App.jsx'

// Registrar Service Worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('✅ Service Worker registrado:', registration.scope)
      })
      .catch(error => {
        console.log('❌ Error al registrar Service Worker:', error)
      })
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
