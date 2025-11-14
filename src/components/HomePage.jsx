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
    <div className="min-h-screen min-h-[100svh] min-h-[100dvh] bg-gradient-to-br from-purple-500 to-purple-700 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-4xl animate-fade-in my-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="text-5xl sm:text-7xl mb-3 sm:mb-4">🎅</div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-3 px-2">Amigo Invisible</h1>
          <p className="text-purple-100 dark:text-gray-300 text-base sm:text-lg px-4">Sistema de sorteo para institutos</p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Teacher Card */}
          <div 
            onClick={onCreateRoom}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95"
          >
            <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">👨‍🏫</div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2">Soy Organizador</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">Crear y gestionar salas de sorteo</p>
            <button className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base">
              Acceder
            </button>
          </div>

          {/* Student Card */}
          <div 
            onClick={onJoinAsStudent}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95"
          >
            <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">🎓</div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2">Soy Invitado</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">Unirme a una sala existente</p>
            <button className="w-full bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base">
              Unirse con Código
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center px-4">
          <p className="text-sm sm:text-base text-purple-100 dark:text-gray-400">✨ Sistema interactivo de amigo invisible con códigos QR</p>
        </div>
      </div>
    </div>
  )
}

export default HomePage
