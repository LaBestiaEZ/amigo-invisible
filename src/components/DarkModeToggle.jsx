import { useState, useEffect } from 'react'
import { HapticFeedback } from '../lib/haptic'

function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode')
    
    if (savedMode !== null) {
      const isDarkMode = savedMode === 'true'
      setIsDark(isDarkMode)
      applyDarkMode(isDarkMode)
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDark(prefersDark)
      applyDarkMode(prefersDark)
    }
  }, [])

  const applyDarkMode = (isDarkMode) => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const toggleDarkMode = () => {
    const newMode = !isDark
    setIsDark(newMode)
    localStorage.setItem('darkMode', newMode.toString())
    applyDarkMode(newMode)
    HapticFeedback.selection()
  }

  return (
    <button 
      className="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-3 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all duration-300" 
      onClick={toggleDarkMode}
      aria-label="Toggle dark mode"
      title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      <span className="text-2xl">{isDark ? '☀️' : '🌙'}</span>
    </button>
  )
}

export default DarkModeToggle
