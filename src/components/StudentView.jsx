import { useState, useEffect } from 'react'
import { HapticFeedback } from '../lib/haptic'

function StudentView({ onJoinRoom, initialCode = '', onLeave, supabase }) {
  const [code, setCode] = useState(initialCode)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [step, setStep] = useState('code') // Siempre empezar en 'code' para validar
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Si hay código inicial, validar automáticamente
  useEffect(() => {
    if (initialCode && supabase) {
      validateRoom(initialCode)
    }
  }, [initialCode])

  const validateRoom = async (roomCode) => {
    setLoading(true)
    setError('')

    try {
      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .select('id, name, status')
        .eq('code', roomCode.toUpperCase())
        .maybeSingle()

      if (roomError) {
        throw new Error('Error al verificar la sala')
      }

      if (!room) {
        throw new Error('Sala no encontrada. Verifica el código.')
      }

      if (room.status !== 'waiting') {
        throw new Error('El sorteo ya a finalizado. No puedes unirte.')
      }

      // Si todo está bien, pasar al siguiente paso
      setStep('form')
    } catch (err) {
      setError(err.message || 'Error al verificar la sala')
    } finally {
      setLoading(false)
    }
  }

  const handleCodeSubmit = async (e) => {
    e.preventDefault()
    if (!code.trim()) return

    HapticFeedback.light()
    await validateRoom(code)
    if (!error) {
      HapticFeedback.success()
    } else {
      HapticFeedback.error()
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
    <div className="min-h-screen min-h-[100svh] min-h-[100dvh] bg-gradient-to-br from-purple-500 to-purple-700 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 animate-fade-in my-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="mb-4">
            <button 
              onClick={onLeave} 
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors font-medium"
            >
              ← Volver
            </button>
          </div>
          <div className="text-center">
            <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">🎅</div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">Amigo Invisible</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Únete a la sala</p>
          </div>
        </div>
        

        {/* Error */}
        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Step 1: Code */}
        {step === 'code' && (
          <form onSubmit={handleCodeSubmit} className="space-y-4 sm:space-y-6">
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
                className="w-full px-3 sm:px-4 py-3 sm:py-4 text-xl sm:text-2xl text-center font-bold border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent uppercase"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && (
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {loading ? 'Verificando...' : 'Continuar →'}
            </button>
          </form>
        )}

        {/* Step 2: Form */}
        {step === 'form' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Room Code Display */}
            <div className="flex items-center justify-between p-3 sm:p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <span className="font-semibold text-green-800 dark:text-green-300 text-sm sm:text-base">Sala: {code}</span>
              <button 
                onClick={() => setStep('code')} 
                className="text-green-600 dark:text-green-400 hover:underline text-xs sm:text-sm font-medium"
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
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent disabled:opacity-50"
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
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent disabled:opacity-50"
                />
                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-500">Recibirás tu amigo invisible por email</p>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {loading && (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {loading ? 'Uniéndose...' : '🎁 Unirse a la sala'}
              </button>
            </form>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-500 px-2">
          <p>Escanea el QR del organizador o ingresa el código de la sala</p>
        </div>
      </div>
    </div>
  )
}

export default StudentView
