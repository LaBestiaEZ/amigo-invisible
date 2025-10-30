import { useState } from 'react'
import './HomePage.css'

function HomePage({ onCreateRoom, onJoinAsStudent }) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [roomName, setRoomName] = useState('')
  const [teacherName, setTeacherName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreateRoom = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onCreateRoom(roomName, teacherName)
    } catch (error) {
      console.error('Error creating room:', error)
      setLoading(false)
    }
  }

  return (
    <div className="home-page">
      <div className="home-container">
        <div className="home-header">
          <div className="home-logo">🎅</div>
          <h1>Amigo Invisible</h1>
          <p className="home-subtitle">Sistema de sorteo para institutos</p>
        </div>

        <div className="role-selection">
          <div className="role-card teacher-card" onClick={onCreateRoom}>
            <div className="role-icon">👨‍🏫</div>
            <h2>Soy Profesor</h2>
            <p>Crear y gestionar salas de sorteo</p>
            <button className="role-btn teacher-btn">
              Acceder
            </button>
          </div>

          <div className="role-card student-card" onClick={onJoinAsStudent}>
            <div className="role-icon">🎓</div>
            <h2>Soy Estudiante</h2>
            <p>Unirme a una sala existente</p>
            <button className="role-btn student-btn">
              Unirse con Código
            </button>
          </div>
        </div>

        <div className="home-footer">
          <p>✨ Sistema interactivo de amigo invisible con códigos QR</p>
        </div>
      </div>
    </div>
  )
}

export default HomePage
