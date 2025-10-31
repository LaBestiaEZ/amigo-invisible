import { useState, useEffect } from 'react'
import { HapticFeedback } from '../lib/haptic'

function DarkModeToggle() {
  const [isDark, setIsDark] = useState(() => {
    // Inicializar desde localStorage o preferencia del sistema
    const savedMode = localStorage.getItem('darkMode')
    if (savedMode !== null) {
      return savedMode === 'true'
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    // Aplicar dark mode inmediatamente al montar
    applyDarkMode(isDark)
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
      className="fixed top-4 right-4 z-[9999] bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-800 dark:text-white p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-gray-200 dark:border-gray-700" 
      style={{
        top: 'max(1rem, env(safe-area-inset-top))',
        right: 'max(1rem, env(safe-area-inset-right))'
      }}
      onClick={toggleDarkMode}
      aria-label="Toggle dark mode"
      title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      <span className="text-2xl block w-6 h-6 flex items-center justify-center">{isDark ? '☀️' : '🌙'}</span>
    </button>
  )
}

export default DarkModeToggle
