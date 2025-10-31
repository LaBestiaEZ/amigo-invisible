import { useState } from 'react'
import { HapticFeedback } from '../lib/haptic'

function StudentView({ onJoinRoom, initialCode = '' }) {
  const [code, setCode] = useState(initialCode)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [step, setStep] = useState(initialCode ? 'form' : 'code') // code or form
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCodeSubmit = (e) => {
    e.preventDefault()
    if (code.trim()) {
      HapticFeedback.light()
      setStep('form')
      setError('')
    }
  }

  const handleJoinSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    HapticFeedback.medium()

    try {
      await onJoinRoom(code.toUpperCase(), name.trim(), email.trim())
      HapticFeedback.success()
    } catch (err) {
      HapticFeedback.error()
      setError(err.message || 'Error al unirse a la sala')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-green-700 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 safe-area-padding">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 animate-[fade-in_0.5s_ease-out]">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎅</div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Amigo Invisible</h1>
          <p className="text-gray-600 dark:text-gray-400">Únete a la sala de tu clase</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg">
            {error}
          </div>
        )}

        {/* Step 1: Code */}
        {step === 'code' && (
          <form onSubmit={handleCodeSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Código de la sala
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Ej: ABC123"
                maxLength={6}
                autoFocus
                required
                className="w-full px-4 py-4 text-2xl text-center font-bold border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent uppercase"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Continuar →
            </button>
          </form>
        )}

        {/* Step 2: Form */}
        {step === 'form' && (
          <div className="space-y-6">
            {/* Room Code Display */}
            <div className="flex items-center justify-between p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <span className="font-semibold text-green-800 dark:text-green-300">Sala: {code}</span>
              <button 
                onClick={() => setStep('code')} 
                className="text-green-600 dark:text-green-400 hover:underline text-sm font-medium"
              >
                Cambiar
              </button>
            </div>

            {/* Join Form */}
            <form onSubmit={handleJoinSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tu nombre completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  required
                  disabled={loading}
                  autoFocus
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tu email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ej: juan@instituto.edu"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent disabled:opacity-50"
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">Recibirás tu amigo invisible por email</p>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {loading ? 'Uniéndose...' : '🎁 Unirse a la sala'}
              </button>
            </form>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-500">
          <p>Escanea el QR del profesor o ingresa el código de la sala</p>
        </div>
      </div>
    </div>
  )
}

export default StudentView
