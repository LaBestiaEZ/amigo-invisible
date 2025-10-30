import { useState } from 'react'
import './TeacherDashboard.css'

function TeacherDashboard({ user, rooms, onCreateRoom, onOpenRoom, onDeleteRoom, onLogout }) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [roomName, setRoomName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreateRoom = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onCreateRoom(roomName)
      setRoomName('')
      setShowCreateForm(false)
    } catch (error) {
      console.error('Error creating room:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      waiting: { text: 'En espera', class: 'status-waiting' },
      drawing: { text: 'Sorteando...', class: 'status-drawing' },
      completed: { text: 'Completado', class: 'status-completed' }
    }
    return badges[status] || badges.waiting
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="teacher-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="user-info">
            <div className="user-avatar">👨‍🏫</div>
            <div>
              <h1>Mis Salas</h1>
              <p>{user.email}</p>
            </div>
          </div>
          <button onClick={onLogout} className="logout-btn">
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="actions-bar">
          <button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="create-room-btn"
          >
            {showCreateForm ? '✕ Cancelar' : '➕ Nueva Sala'}
          </button>
        </div>

        {showCreateForm && (
          <div className="create-form-card">
            <h3>Crear Nueva Sala</h3>
            <form onSubmit={handleCreateRoom}>
              <div className="form-group">
                <label>Nombre de la sala</label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Ej: Amigo Invisible 4ºA - 2025"
                  required
                  disabled={loading}
                  autoFocus
                />
              </div>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? 'Creando...' : '🚀 Crear Sala'}
              </button>
            </form>
          </div>
        )}

        {rooms.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No tienes salas aún</h3>
            <p>Crea tu primera sala para empezar un sorteo de amigo invisible</p>
            <button 
              onClick={() => setShowCreateForm(true)}
              className="create-first-btn"
            >
              ➕ Crear Primera Sala
            </button>
          </div>
        ) : (
          <div className="rooms-grid">
            {rooms.map((room) => (
              <div key={room.id} className="room-card">
                <div className="room-header">
                  <h3>{room.name}</h3>
                  <span className={`status-badge ${getStatusBadge(room.status).class}`}>
                    {getStatusBadge(room.status).text}
                  </span>
                </div>

                <div className="room-info">
                  <div className="info-item">
                    <span className="info-label">Código:</span>
                    <span className="info-value code">{room.code}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Creada:</span>
                    <span className="info-value">{formatDate(room.created_at)}</span>
                  </div>
                </div>

                <div className="room-actions">
                  <button 
                    onClick={() => onOpenRoom(room)}
                    className="open-btn"
                  >
                    {room.status === 'waiting' ? '👀 Abrir Sala' : '📊 Ver Detalles'}
                  </button>
                  {room.status === 'waiting' && (
                    <button 
                      onClick={() => {
                        if (window.confirm('¿Eliminar esta sala?')) {
                          onDeleteRoom(room.id)
                        }
                      }}
                      className="delete-btn"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TeacherDashboard
