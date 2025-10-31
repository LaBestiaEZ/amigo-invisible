import { useState } from 'react'

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
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-700 dark:from-gray-900 dark:to-gray-800 safe-area-padding">
      {/* Header Mejorado */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 dark:from-gray-800 dark:to-gray-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Top Row: Logo y Logout */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white/20 dark:bg-white/10 rounded-full flex items-center justify-center text-3xl backdrop-blur-sm">
                👨‍🏫
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Panel del Profesor</h1>
                <p className="text-sm text-purple-100 dark:text-gray-400">{user.email}</p>
              </div>
            </div>
            <button 
              onClick={onLogout} 
              className="px-4 py-2 bg-white/20 hover:bg-white/30 dark:bg-red-500/80 dark:hover:bg-red-600 backdrop-blur-sm text-white rounded-lg font-medium transition-all hover:scale-105 active:scale-95"
            >
              Cerrar Sesión
            </button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-xl">
                  📚
                </div>
                <div>
                  <p className="text-xs text-purple-100 dark:text-gray-400">Total Salas</p>
                  <p className="text-2xl font-bold text-white">{rooms.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/30 rounded-lg flex items-center justify-center text-xl">
                  ✓
                </div>
                <div>
                  <p className="text-xs text-purple-100 dark:text-gray-400">Completadas</p>
                  <p className="text-2xl font-bold text-white">{rooms.filter(r => r.status === 'completed').length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/30 rounded-lg flex items-center justify-center text-xl">
                  ⏳
                </div>
                <div>
                  <p className="text-xs text-purple-100 dark:text-gray-400">En Espera</p>
                  <p className="text-2xl font-bold text-white">{rooms.filter(r => r.status === 'waiting').length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Actions Bar */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Mis Salas de Sorteo</h2>
          <button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 ${showCreateForm ? 'bg-gray-600 hover:bg-gray-700' : 'bg-green-500 hover:bg-green-600'} text-white`}
          >
            {showCreateForm ? '✕ Cancelar' : '➕ Nueva Sala'}
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6 animate-[fade-in_0.3s_ease-out]">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Crear Nueva Sala</h3>
            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre de la sala
                </label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Ej: Amigo Invisible 4ºA - 2025"
                  required
                  disabled={loading}
                  autoFocus
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Creando...' : '🚀 Crear Sala'}
              </button>
            </form>
          </div>
        )}

        {/* Empty State */}
        {rooms.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
            <div className="text-7xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No tienes salas aún</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Crea tu primera sala para empezar un sorteo de amigo invisible</p>
            <button 
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
            >
              ➕ Crear Primera Sala
            </button>
          </div>
        ) : (
          /* Rooms Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div key={room.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white flex-1">{room.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    room.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                    room.status === 'drawing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                  }`}>
                    {getStatusBadge(room.status).text}
                  </span>
                </div>

                {/* Card Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Código:</span>
                    <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{room.code}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Creada:</span>
                    <span className="text-gray-800 dark:text-gray-300">{formatDate(room.created_at)}</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => onOpenRoom(room)}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white font-semibold py-2 rounded-lg transition-colors"
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
                      className="px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
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
