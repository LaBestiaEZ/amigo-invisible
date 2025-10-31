import { useState } from 'react'

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
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center p-4 safe-area-padding">
      <div className="w-full max-w-4xl animate-[fade-in_0.5s_ease-out]">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-7xl mb-4">🎅</div>
          <h1 className="text-5xl font-bold text-white mb-3">Amigo Invisible</h1>
          <p className="text-purple-100 text-lg">Sistema de sorteo para institutos</p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Teacher Card */}
          <div 
            onClick={onCreateRoom}
            className="bg-white rounded-2xl shadow-xl p-8 text-center cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95"
          >
            <div className="text-6xl mb-4">👨‍🏫</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Soy Profesor</h2>
            <p className="text-gray-600 mb-6">Crear y gestionar salas de sorteo</p>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              Acceder
            </button>
          </div>

          {/* Student Card */}
          <div 
            onClick={onJoinAsStudent}
            className="bg-white rounded-2xl shadow-xl p-8 text-center cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95"
          >
            <div className="text-6xl mb-4">🎓</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Soy Estudiante</h2>
            <p className="text-gray-600 mb-6">Unirme a una sala existente</p>
            <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              Unirse con Código
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-purple-100">✨ Sistema interactivo de amigo invisible con códigos QR</p>
        </div>
      </div>
    </div>
  )
}

export default HomePage
