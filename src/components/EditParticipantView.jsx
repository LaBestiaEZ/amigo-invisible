import { useState } from 'react'
import LoadingSpinner from './LoadingSpinner'
import PageLayout from './PageLayout'

function EditParticipantView({ participant, participants, onClose, onSave, onRemove, roomStatus }) {
  const [email, setEmail] = useState(participant?.email || '')
  const [preferences, setPreferences] = useState(participant?.preferences || '')
  const [restrictions, setRestrictions] = useState(participant?.restrictions || [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const canRemove = roomStatus === 'waiting'

  const toggleRestriction = (participantId) => {
    setRestrictions(prev => {
      if (prev.includes(participantId)) {
        return prev.filter(id => id !== participantId)
      } else {
        return [...prev, participantId]
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await onSave({
        id: participant.id,
        email: email.trim(),
        preferences: preferences.trim(),
        restrictions: restrictions
      })
      onClose()
    } catch (err) {
      setError(err.message || 'Error al guardar cambios')
      setLoading(false)
    }
  }

  const handleRemove = async () => {
    setLoading(true)
    setError('')
    try {
      await onRemove(participant)
      onClose()
    } catch (err) {
      setError(err.message || 'Error al expulsar participante')
      setLoading(false)
    }
  }

  // Filtrar participantes (excluir al actual)
  const otherParticipants = participants.filter(p => p.id !== participant.id)

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
            >
              ← 
            </button>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Editar Participante</h2>
          </div>

          <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-sm text-purple-800 dark:text-purple-300">
              <strong>Nombre:</strong> {participant?.name}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              📧 Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              placeholder="ejemplo@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🎁 Gustos/Preferencias <span className="text-xs text-gray-500">(opcional)</span>
            </label>
            <textarea
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              disabled={loading}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 resize-none"
              placeholder="Ej: Me gusta el chocolate, los libros de fantasía, la música..."
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Esta información se mostrará a quien le toque este participante
            </p>
          </div>

          {/* Restricciones */}
          {otherParticipants.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                🚫 Restricciones <span className="text-xs text-gray-500">(opcional)</span>
              </label>
              <div className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 max-h-48 overflow-y-auto">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  Marca las personas que <strong>NO</strong> pueden tocarle a <strong>{participant.name}</strong>:
                </p>
                <div className="space-y-2">
                  {otherParticipants.map(p => (
                    <label 
                      key={p.id}
                      className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={restrictions.includes(p.id)}
                        onChange={() => toggleRestriction(p.id)}
                        disabled={loading}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{p.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {restrictions.length > 0 
                  ? `${restrictions.length} restricción${restrictions.length > 1 ? 'es' : ''} aplicada${restrictions.length > 1 ? 's' : ''}`
                  : 'No hay restricciones'
                }
              </p>
            </div>
          )}

          {/* Botón de expulsar */}
          {onRemove && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                🚪 Expulsar de la sala
              </label>
              <button
                type="button"
                onClick={handleRemove}
                disabled={loading || !canRemove}
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Expulsar
              </button>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {canRemove 
                  ? 'El participante podrá volver a unirse con el código de la sala'
                  : 'No se pueden expulsar participantes después del sorteo'
                }
              </p>
            </div>
          )}

          {/* Espaciador y botones de acción */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <LoadingSpinner size="small" color="white" />}
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
          </form>

          
        </div>
      </div>
    </PageLayout>
  )
}

export default EditParticipantView
