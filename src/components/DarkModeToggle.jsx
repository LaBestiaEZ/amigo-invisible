import { useState, useEffect } from 'react'
import './DarkModeToggle.css'
import { HapticFeedback } from '../lib/haptic'

function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // 1. Primero comprobar localStorage
    const savedMode = localStorage.getItem('darkMode')
    
    if (savedMode !== null) {
      // Usar preferencia guardada
      const isDarkMode = savedMode === 'true'
      setIsDark(isDarkMode)
      applyDarkMode(isDarkMode)
    } else {
      // Si no hay preferencia guardada, usar preferencia del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDark(prefersDark)
      applyDarkMode(prefersDark)
    }
  }, [])

  const applyDarkMode = (isDarkMode) => {
    const html = document.documentElement
    
    if (isDarkMode) {
      html.classList.add('dark-mode')
      html.classList.remove('force-light')
    } else {
      html.classList.remove('dark-mode')
      html.classList.add('force-light')
    }
  }

  const toggleDarkMode = () => {
    const newMode = !isDark
    setIsDark(newMode)
    
    // Guardar preferencia en localStorage
    localStorage.setItem('darkMode', newMode.toString())
    
    // Aplicar el modo
    applyDarkMode(newMode)
    
    // Haptic feedback
    HapticFeedback.selection()
  }

  return (
    <button 
      className="dark-mode-toggle" 
      onClick={toggleDarkMode}
      aria-label="Toggle dark mode"
      title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}

export default DarkModeToggle
