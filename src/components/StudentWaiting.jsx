import { useEffect, useState } from 'react'
import { HapticFeedback } from '../lib/haptic'

function StudentWaiting({ participant, room, onLeave, supabase, isNewJoin = false }) {
  const [dots, setDots] = useState('')
  const [assignment, setAssignment] = useState(null)
  const [loadingAssignment, setLoadingAssignment] = useState(false)
  const [preferences, setPreferences] = useState(participant.preferences || '')
  const [savingPreferences, setSavingPreferences] = useState(false)
  const [showPreferencesSuccess, setShowPreferencesSuccess] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(isNewJoin)

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 500)
    return () => clearInterval(interval)
  }, [])

  // Ocultar modal de éxito después de 2 segundos con fade out
  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        setShowSuccessModal(false)
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [showSuccessModal])

  // Suscribirse a cambios en la sala
  useEffect(() => {
    if (!supabase || !room?.id) return

    const channel = supabase
      .channel(`room-${room.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rooms',
          filter: `id=eq.${room.id}`
        },
        (payload) => {
          console.log('Cambio en la sala:', payload)
          if (payload.new.status === 'completed') {
            loadAssignment()
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [room?.id, supabase])

  // Cargar asignación cuando el sorteo se complete
  useEffect(() => {
    console.log('🔄 Estado de la sala:', room.status)
    if (room.status === 'completed' && !assignment) {
      console.log('🎁 Sorteo completado! Cargando asignación...')
      loadAssignment()
    }
  }, [room.status])

  const loadAssignment = async () => {
    setLoadingAssignment(true)
    try {
      console.log('🔍 Buscando asignación para:', {
        room_id: room.id,
        giver_id: participant.id,
        participant_name: participant.name
      })

      // Primero intentar obtener el receiver_id desde la tabla de asignaciones
      const { data: assignmentData, error: assignmentError } = await supabase
        .from('secret_santa_assignments')
        .select('receiver_id')
        .eq('room_id', room.id)
        .eq('giver_id', participant.id)
        .maybeSingle()

      if (assignmentError) {
        console.error('❌ Error al buscar asignación:', assignmentError)
        return
      }

      if (!assignmentData) {
        console.log('⚠️ No se encontró asignación aún')
        return
      }

      console.log('✅ Asignación encontrada:', assignmentData)

      // Ahora obtener el nombre y preferencias del receiver
      const { data: receiverData, error: receiverError} = await supabase
        .from('room_participants')
        .select('name, preferences')
        .eq('id', assignmentData.receiver_id)
        .single()

      if (receiverError) {
        console.error('❌ Error al buscar receptor:', receiverError)
        return
      }

      console.log('✅ Receptor encontrado:', receiverData)
      setAssignment({ 
        receiver_name: receiverData.name,
        receiver_preferences: receiverData.preferences
      })
    } catch (err) {
      console.error('❌ Error general:', err)
    } finally {
      setLoadingAssignment(false)
    }
  }

  const savePreferences = async () => {
    setSavingPreferences(true)
    try {
      const { error } = await supabase
        .from('room_participants')
        .update({ preferences })
        .eq('id', participant.id)

      if (error) {
        console.error('Error al guardar preferencias:', error)
        alert('Error al guardar preferencias')
        return
      }

      HapticFeedback.success()
      setShowPreferencesSuccess(true)
      setTimeout(() => setShowPreferencesSuccess(false), 3000)
    } catch (err) {
      console.error('Error:', err)
      alert('Error al guardar preferencias')
    } finally {
      setSavingPreferences(false)
    }
  }

  return (
    <>
      {/* Success Modal Overlay */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-[fade-in_0.3s_ease-out,fade-out_0.5s_ease-in_2s_forwards]">
          <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center text-white text-7xl font-bold shadow-2xl">
            ✓
          </div>
        </div>
      )}

      <div className="min-h-screen min-h-[100svh] min-h-[100dvh] bg-gradient-to-br from-purple-500 to-purple-700 dark:from-gray-900 dark:to-gray-800 p-4 overflow-y-auto">
        <div className="max-w-2xl mx-auto my-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 animate-fade-in">
            {/* Leave Button */}
            <div className="mb-6">
              <button 
                onClick={onLeave} 
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors font-medium"
              >
                ← Volver
              </button>
            </div>
          
          
          <h2 className="text-xl text-center text-gray-600 dark:text-gray-400 mb-8">{room.name}</h2>
          
          {/* Participant Card */}
          <div className="flex items-center gap-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg mb-6">
            <div className="text-4xl">👤</div>
            <div>
              <p className="text-lg font-bold text-gray-800 dark:text-white">{participant.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{participant.email}</p>
            </div>
          </div>

          {/* Personal Link Section */}
          <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="font-semibold text-blue-800 dark:text-blue-300 mb-3">🔗 Guarda este link para volver después:</p>
            <input 
              type="text" 
              value={`${window.location.origin}?p=${participant.id}`}
              readOnly
              onClick={(e) => e.target.select()}
              className="w-full px-3 py-2 mb-2 text-sm bg-white dark:bg-gray-800 border border-blue-300 dark:border-blue-700 rounded text-gray-800 dark:text-white font-mono"
            />
            <button 
              onClick={() => {
                HapticFeedback.light()
                navigator.clipboard.writeText(`${window.location.origin}?p=${participant.id}`)
                HapticFeedback.success()
                alert('¡Link copiado! Guárdalo para volver después')
              }}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              📋 Copiar link
            </button>
            <small className="block mt-2 text-xs text-blue-700 dark:text-blue-400">
              Con este link podrás ver tu resultado cuando quieras
            </small>
          </div>

          {/* Preferences Section */}
          {room.status === 'waiting' && (
            <div className="mb-8 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <p className="font-semibold text-purple-800 dark:text-purple-300 mb-3">🎁 Mis gustos/preferencias (opcional):</p>
              <p className="text-sm text-purple-700 dark:text-purple-400 mb-3">
                Ayuda a quien te toque a elegir un mejor regalo. Puedes poner: hobbies, colores favoritos, cosas que te gustan, etc.
              </p>
              <textarea
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                placeholder="Ej: Me gusta leer, el color azul, la música rock..."
                className="w-full px-3 py-2 mb-3 bg-white dark:bg-gray-800 border border-purple-300 dark:border-purple-700 rounded text-gray-800 dark:text-white min-h-[100px] resize-y"
                maxLength={500}
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={savePreferences}
                  disabled={savingPreferences}
                  className="flex-1 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white font-semibold py-2 rounded-lg transition-colors"
                >
                  {savingPreferences ? 'Guardando...' : '💾 Guardar preferencias'}
                </button>
                {showPreferencesSuccess && (
                  <div className="text-green-600 dark:text-green-400 font-semibold">✓ Guardado</div>
                )}
              </div>
              <small className="block mt-2 text-xs text-purple-700 dark:text-purple-400">
                {preferences.length}/500 caracteres
              </small>
            </div>
          )}

          {/* Waiting Status */}
          {room.status === 'waiting' && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">⏳</div>
              <p className="text-lg text-gray-800 dark:text-white mb-2">
                Esperando a que el organizador/a realice el sorteo{dots}
              </p>
              <small className="text-gray-600 dark:text-gray-400">
                Recibirás un email con tu amigo invisible cuando el sorteo esté listo
              </small>
            </div>
          )}

          {/* Drawing Status */}
          {room.status === 'drawing' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-lg font-semibold text-gray-800 dark:text-white mb-2">¡El sorteo está en proceso!</p>
              <small className="text-gray-600 dark:text-gray-400">Revisa tu email en unos momentos...</small>
            </div>
          )}

          {/* Completed Status */}
          {room.status === 'completed' && (
            <div className="text-center py-8">
              <div className="text-7xl mb-4">🎁</div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">¡Sorteo completado!</h3>
              
              {loadingAssignment ? (
                <div className="py-4">
                  <div className="w-12 h-12 mx-auto mb-3 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-600 dark:text-gray-400">Cargando tu resultado...</p>
                </div>
              ) : assignment ? (
                <div className="space-y-6">
                  <p className="text-lg text-gray-700 dark:text-gray-300">Tu amigo invisible es:</p>
                  <div className="p-6 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl">
                    <div className="text-6xl mb-3">🎅</div>
                    <div className="text-3xl font-bold text-purple-800 dark:text-purple-300">{assignment.receiver_name}</div>
                  </div>
                  
                  {assignment.receiver_preferences && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg text-left">
                      <p className="font-semibold text-blue-800 dark:text-blue-300 mb-2">🎁 Sus gustos/preferencias:</p>
                      <p className="text-blue-700 dark:text-blue-400 whitespace-pre-wrap">{assignment.receiver_preferences}</p>
                    </div>
                  )}
                  
                  <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg">
                    <p className="text-yellow-800 dark:text-yellow-300">🤫 ¡Recuerda mantenerlo en secreto!</p>
                  </div>
                 {/*<div className="text-sm text-gray-600 dark:text-gray-400">
                    <small>También hemos enviado esta información a:</small>
                    <p className="font-medium text-gray-800 dark:text-white mt-1">{participant.email}</p>
                  </div>*/} 
                </div>
              ) : (
                <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <p className="text-gray-800 dark:text-white mb-2">Revisa tu email para ver quién es tu amigo invisible</p>
                  <strong className="block text-gray-700 dark:text-gray-300 mb-1">Email enviado a:</strong>
                  <p className="text-gray-900 dark:text-white font-medium">{participant.email}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  )
}

export default StudentWaiting
