import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { HapticFeedback } from '../lib/haptic'

function TeacherView({ room, participants, onStartDraw, onGoBack, onViewResults, onRemoveParticipant }) {
  const [roomUrl, setRoomUrl] = useState('')
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    // URL para que los estudiantes se unan
    const url = `${window.location.origin}?code=${room.code}`
    setRoomUrl(url)
  }, [room.code])

  const handleRemoveParticipant = async (participant) => {
    if (room.status !== 'waiting') {
      HapticFeedback.warning()
      alert('No se pueden expulsar participantes después del sorteo')
      return
    }

    HapticFeedback.selection()
    const confirmRemove = window.confirm(
      `¿Expulsar a ${participant.name}?\n\nPodrá volver a unirse si quiere.`
    )

    if (confirmRemove) {
      try {
        HapticFeedback.heavy()
        await onRemoveParticipant(participant.id)
        HapticFeedback.success()
      } catch (error) {
        HapticFeedback.error()
        alert('Error al expulsar: ' + error.message)
      }
    }
  }

  // Función para ocultar parcialmente el email
  const maskEmail = (email) => {
    if (!email) return ''
    
    const [localPart, domain] = email.split('@')
    if (!domain) return email
    
    // Mostrar primeros 2 caracteres y últimos 2 del nombre
    const visibleChars = 2
    if (localPart.length <= visibleChars * 2) {
      return `${localPart[0]}${'*'.repeat(localPart.length - 1)}@${domain}`
    }
    
    const start = localPart.substring(0, visibleChars)
    const end = localPart.substring(localPart.length - visibleChars)
    const masked = `${start}${'*'.repeat(localPart.length - visibleChars * 2)}${end}@${domain}`
    
    return masked
  }

  // Generar color del avatar basado en el nombre
  const getAvatarColor = (name, index) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
      '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
      '#F8B739', '#52B788', '#E76F51', '#2A9D8F'
    ]
    return colors[index % colors.length]
  }

  // Obtener emoji basado en el índice
  const getAvatarEmoji = (index) => {
    const emojis = ['😊', '🎉', '🌟', '🎨', '🚀', '🎭', '🎪', '🎯', '🎸', '⚡', '🌈', '🔥']
    return emojis[index % emojis.length]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-700 dark:from-gray-900 dark:to-gray-800 safe-area-padding">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button 
            onClick={onGoBack}
            className="mb-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            ← Salir
          </button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{room.name}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Profesor: {room.teacher_name}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-2 gap-6">
        {/* Join Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Los estudiantes pueden unirse con:</h2>
          
          {/* Code Display */}
          <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-300 dark:border-purple-700 rounded-lg">
            <p className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">Código de sala:</p>
            <p className="text-4xl font-bold text-purple-600 dark:text-purple-400 tracking-wider font-mono">{room.code}</p>
          </div>

          {/* QR Code */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">O escanear este QR:</h3>
            <div className="inline-block p-4 bg-white dark:bg-gray-700 rounded-xl shadow-md">
              <QRCodeSVG 
                value={roomUrl} 
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 break-all">{roomUrl}</p>
          </div>
        </div>

        {/* Participants Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          {/* Panel Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Participantes</h2>
            <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 font-bold rounded-full">
              {participants.length}
            </span>
          </div>

          {participants.length === 0 ? (
            /* Empty State */
            <div className="py-12 text-center">
              <div className="text-7xl mb-4">👥</div>
              <p className="text-gray-600 dark:text-gray-400">Esperando que los estudiantes se unan...</p>
            </div>
          ) : (
            <>
              {/* Avatars Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-6">
                {participants.map((participant, index) => (
                  <div key={participant.id} className="relative group">
                    {room.status === 'waiting' && (
                      <button
                        onClick={() => handleRemoveParticipant(participant)}
                        title={`Expulsar a ${participant.name}`}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      >
                        ✕
                      </button>
                    )}
                    <div 
                      className="w-full aspect-square rounded-full flex items-center justify-center text-3xl shadow-lg"
                      style={{ backgroundColor: getAvatarColor(participant.name, index) }}
                    >
                      {getAvatarEmoji(index)}
                    </div>
                    <p className="mt-2 text-xs text-center text-gray-700 dark:text-gray-300 font-medium truncate">
                      {participant.name}
                    </p>
                  </div>
                ))}
              </div>

              {/* Emails List */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  📧 Correos registrados ({participants.length})
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {participants.map((participant, index) => (
                    <div key={participant.id} className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500 dark:text-gray-500">{index + 1}.</span>
                      <span className="font-medium text-gray-800 dark:text-white">{participant.name}:</span>
                      <span className="text-gray-600 dark:text-gray-400 truncate" title={participant.email}>
                        {maskEmail(participant.email)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Actions */}
          {participants.length >= 2 && room.status === 'waiting' && (
            <button 
              onClick={() => {
                HapticFeedback.heavy()
                onStartDraw()
              }}
              className="w-full mt-6 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-bold py-4 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl"
            >
              🎲 Realizar Sorteo ({participants.length} participantes)
            </button>
          )}

          {participants.length > 0 && participants.length < 2 && (
            <div className="mt-6 p-4 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-300 rounded-lg text-sm">
              Se necesitan al menos 2 participantes para realizar el sorteo
            </div>
          )}

          {room.status === 'drawing' && (
            <div className="mt-6 text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-700 dark:text-gray-300">Realizando sorteo y enviando emails...</p>
            </div>
          )}

          {room.status === 'completed' && (
            <div className="mt-6 p-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-700 rounded-xl text-center">
              <div className="text-6xl mb-3">🎉</div>
              <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">¡Sorteo completado!</h3>
              <p className="text-green-700 dark:text-green-400 mb-4">
                Todos los participantes han recibido su amigo invisible por email
              </p>
              <button 
                onClick={() => onViewResults(room.id)}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors"
              >
                📊 Ver resultados del sorteo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TeacherView
