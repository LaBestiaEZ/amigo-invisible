import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import './TeacherView.css'

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
      alert('No se pueden expulsar participantes después del sorteo')
      return
    }

    const confirmRemove = window.confirm(
      `¿Expulsar a ${participant.name}?\n\nPodrá volver a unirse si quiere.`
    )

    if (confirmRemove) {
      try {
        await onRemoveParticipant(participant.id)
      } catch (error) {
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
    <div className="teacher-view">
      <div className="teacher-header">
        <button onClick={onGoBack} className="back-btn">← Salir</button>
        <div className="room-info">
          <h1>{room.name}</h1>
          <p className="teacher-name">Profesor: {room.teacher_name}</p>
        </div>
      </div>

      <div className="teacher-content">
        {/* Panel de código y QR */}
        <div className="join-panel">
          <h2>Los estudiantes pueden unirse con:</h2>
          
          <div className="code-display">
            <span className="code-label">Código de sala:</span>
            <span className="code-value">{room.code}</span>
          </div>

          <div className="qr-container">
            <h3>O escanear este QR:</h3>
            <div className="qr-code">
              <QRCodeSVG 
                value={roomUrl} 
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="qr-url">{roomUrl}</p>
          </div>
        </div>

        {/* Lista de participantes en tiempo real */}
        <div className="participants-panel">
          <div className="panel-header">
            <h2>Participantes</h2>
            <span className="count-badge">{participants.length}</span>
          </div>

          {participants.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <p>Esperando que los estudiantes se unan...</p>
            </div>
          ) : (
            <>
              {/* Grid de avatares estilo Kahoot */}
              <div className="avatars-grid">
                {participants.map((participant, index) => (
                  <div key={participant.id} className="avatar-card">
                    {room.status === 'waiting' && (
                      <button
                        className="remove-participant-btn"
                        onClick={() => handleRemoveParticipant(participant)}
                        title={`Expulsar a ${participant.name}`}
                      >
                        ✕
                      </button>
                    )}
                    <div 
                      className="avatar-circle"
                      style={{ backgroundColor: getAvatarColor(participant.name, index) }}
                    >
                      <span className="avatar-emoji">{getAvatarEmoji(index)}</span>
                    </div>
                    <span className="avatar-name">{participant.name}</span>
                  </div>
                ))}
              </div>

              {/* Lista de emails ocultos abajo */}
              <div className="emails-section">
                <h3 className="emails-title">
                  📧 Correos registrados ({participants.length})
                </h3>
                <div className="emails-list">
                  {participants.map((participant, index) => (
                    <div key={participant.id} className="email-item">
                      <span className="email-number">{index + 1}.</span>
                      <span className="email-name">{participant.name}:</span>
                      <span className="email-address" title={participant.email}>
                        {maskEmail(participant.email)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {participants.length >= 2 && room.status === 'waiting' && (
            <button 
              onClick={onStartDraw}
              className="draw-btn"
            >
              🎲 Realizar Sorteo ({participants.length} participantes)
            </button>
          )}

          {participants.length > 0 && participants.length < 2 && (
            <div className="warning-message">
              Se necesitan al menos 2 participantes para realizar el sorteo
            </div>
          )}

          {room.status === 'drawing' && (
            <div className="loading-message">
              <div className="spinner"></div>
              <p>Realizando sorteo y enviando emails...</p>
            </div>
          )}

          {room.status === 'completed' && (
            <div className="success-message">
              <div className="success-icon">🎉</div>
              <h3>¡Sorteo completado!</h3>
              <p>Todos los participantes han recibido su amigo invisible por email</p>
              <button 
                onClick={() => onViewResults(room.id)}
                className="view-results-btn"
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
