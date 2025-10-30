import { useEffect, useState } from 'react'
import './StudentWaiting.css'

function StudentWaiting({ participant, room, onLeave, supabase }) {
  const [dots, setDots] = useState('')
  const [assignment, setAssignment] = useState(null)
  const [loadingAssignment, setLoadingAssignment] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 500)
    return () => clearInterval(interval)
  }, [])

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

      // Ahora obtener el nombre del receiver
      const { data: receiverData, error: receiverError } = await supabase
        .from('room_participants')
        .select('name')
        .eq('id', assignmentData.receiver_id)
        .single()

      if (receiverError) {
        console.error('❌ Error al buscar receptor:', receiverError)
        return
      }

      console.log('✅ Receptor encontrado:', receiverData)
      setAssignment({ receiver_name: receiverData.name })
    } catch (err) {
      console.error('❌ Error general:', err)
    } finally {
      setLoadingAssignment(false)
    }
  }

  return (
    <div className="student-waiting">
      <div className="waiting-container">
        <button onClick={onLeave} className="leave-btn">← Salir</button>
        
        <div className="waiting-content">
          <div className="success-animation">
            <div className="checkmark">✓</div>
          </div>
          
          <h1>¡Te has unido con éxito!</h1>
          <h2>{room.name}</h2>
          
          <div className="participant-card-waiting">
            <div className="participant-icon">👤</div>
            <div>
              <p className="participant-name-large">{participant.name}</p>
              <p className="participant-email-small">{participant.email}</p>
            </div>
          </div>

          {/* Link personal para volver */}
          <div className="personal-link-section">
            <p className="personal-link-title">🔗 Guarda este link para volver después:</p>
            <div className="personal-link-box">
              <input 
                type="text" 
                value={`${window.location.origin}?p=${participant.id}`}
                readOnly
                className="personal-link-input"
                onClick={(e) => e.target.select()}
              />
              <button 
                className="copy-link-btn"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}?p=${participant.id}`)
                  alert('¡Link copiado! Guárdalo para volver después')
                }}
              >
                📋 Copiar
              </button>
            </div>
            <small className="personal-link-hint">
              Con este link podrás ver tu resultado cuando quieras
            </small>
          </div>

          {room.status === 'waiting' && (
            <div className="waiting-message">
              <div className="waiting-icon">⏳</div>
              <p>Esperando a que el profesor realice el sorteo{dots}</p>
              <small>Recibirás un email con tu amigo invisible cuando el sorteo esté listo</small>
            </div>
          )}

          {room.status === 'drawing' && (
            <div className="drawing-message">
              <div className="spinner-large"></div>
              <p>¡El sorteo está en proceso!</p>
              <small>Revisa tu email en unos momentos...</small>
            </div>
          )}

          {room.status === 'completed' && (
            <div className="completed-message">
              <div className="gift-icon">🎁</div>
              <h3>¡Sorteo completado!</h3>
              
              {loadingAssignment ? (
                <div className="loading-assignment">
                  <div className="spinner-small"></div>
                  <p>Cargando tu resultado...</p>
                </div>
              ) : assignment ? (
                <div className="assignment-reveal">
                  <p className="assignment-intro">Tu amigo invisible es:</p>
                  <div className="receiver-card">
                    <div className="receiver-icon">🎅</div>
                    <div className="receiver-name">{assignment.receiver_name}</div>
                  </div>
                  <div className="assignment-reminder">
                    <p>🤫 ¡Recuerda mantenerlo en secreto!</p>
                  </div>
                  <div className="email-reminder">
                    <small>También hemos enviado esta información a:</small>
                    <p>{participant.email}</p>
                  </div>
                </div>
              ) : (
                <div className="email-reminder">
                  <p>Revisa tu email para ver quién es tu amigo invisible</p>
                  <strong>Email enviado a:</strong>
                  <p>{participant.email}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentWaiting
