import { useState, useEffect } from 'react'
import './App.css'
import { supabase } from './lib/supabase'
import { sendBulkSecretSantaEmails } from './lib/emailService'
import HomePage from './components/HomePage'
import TeacherAuth from './components/TeacherAuth'
import TeacherDashboard from './components/TeacherDashboard'
import TeacherView from './components/TeacherView'
import StudentView from './components/StudentView'
import StudentWaiting from './components/StudentWaiting'
import ResultsModal from './components/ResultsModal'
import { v4 as uuidv4 } from 'uuid'

function App() {
  const [view, setView] = useState('home') // home, teacher-auth, teacher-dashboard, teacher-room, student, student-waiting
  const [user, setUser] = useState(null)
  const [currentRoom, setCurrentRoom] = useState(null)
  const [teacherRooms, setTeacherRooms] = useState([])
  const [participants, setParticipants] = useState([])
  const [currentParticipant, setCurrentParticipant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [supabaseConfigured, setSupabaseConfigured] = useState(true)
  const [showResultsModal, setShowResultsModal] = useState(false)
  const [resultsRoomId, setResultsRoomId] = useState(null)

  // Verificar configuración de Supabase
  useEffect(() => {
    const url = import.meta.env.VITE_SUPABASE_URL
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    if (!url || !key || url.includes('tu-url') || key.includes('tu-clave')) {
      setSupabaseConfigured(false)
      setLoading(false)
      return
    }

    // Verificar si hay código o participant_id en URL para estudiantes
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const participantId = urlParams.get('p')

    // Verificar sesión actual
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        // Usuario autenticado (profesor)
        loadTeacherRooms(session.user.id)
        setView('teacher-dashboard')
      } else if (participantId) {
        // Estudiante volviendo con su link personal
        await restoreStudentSession(participantId)
      } else if (code) {
        // No autenticado pero hay código en URL (estudiante con QR)
        setView('student')
      } else {
        // No autenticado y sin código (home)
        setView('home')
      }
      setLoading(false)
    })

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadTeacherRooms(session.user.id)
        setView('teacher-dashboard')
      } else {
        // Si se cierra sesión, verificar si hay código en URL
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        setView(code ? 'student' : 'home')
        setTeacherRooms([])
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Suscribirse a cambios en tiempo real de participantes
  useEffect(() => {
    if (!currentRoom || !supabaseConfigured) return

    const channel = supabase
      .channel(`room_${currentRoom.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'room_participants',
        filter: `room_id=eq.${currentRoom.id}`
      }, () => {
        loadParticipants(currentRoom.id)
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'rooms',
        filter: `id=eq.${currentRoom.id}`
      }, (payload) => {
        setCurrentRoom(payload.new)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentRoom, supabaseConfigured])

  const loadTeacherRooms = async (teacherId) => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('teacher_id', teacherId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTeacherRooms(data || [])
    } catch (error) {
      console.error('Error loading rooms:', error)
    }
  }

  const loadParticipants = async (roomId) => {
    try {
      const { data, error } = await supabase
        .from('room_participants')
        .select('*')
        .eq('room_id', roomId)
        .order('joined_at', { ascending: true })

      if (error) throw error
      setParticipants(data || [])
    } catch (error) {
      console.error('Error loading participants:', error)
    }
  }

  const generateRoomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  const handleTeacherLogin = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return data
  }

  const handleTeacherRegister = async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name
        }
      }
    })

    if (error) throw error
    
    if (data.user && data.session) {
      // Usuario registrado y autenticado
      return data
    } else {
      // Requiere confirmación de email
      throw new Error('Por favor, confirma tu email para continuar. Revisa tu bandeja de entrada.')
    }
  }

  const handleTeacherLogout = async () => {
    await supabase.auth.signOut()
    setView('home')
    setCurrentRoom(null)
    setTeacherRooms([])
  }

  const createRoom = async (name) => {
    setLoading(true)
    try {
      const code = generateRoomCode()
      const { data, error } = await supabase
        .from('rooms')
        .insert([{
          code,
          name,
          teacher_id: user.id,
          teacher_name: user.user_metadata?.name || user.email,
          teacher_email: user.email,
          status: 'waiting'
        }])
        .select()
        .single()

      if (error) throw error
      
      setCurrentRoom(data)
      setView('teacher-room')
      await loadParticipants(data.id)
      await loadTeacherRooms(user.id) // Actualizar la lista de salas
    } catch (error) {
      console.error('Error creating room:', error)
      alert('Error al crear la sala. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const joinRoom = async (code, name, email) => {
    try {
      // Buscar la sala
      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('code', code)
        .single()

      if (roomError || !room) {
        throw new Error('Sala no encontrada. Verifica el código.')
      }

      if (room.status !== 'waiting') {
        throw new Error('Esta sala ya no está aceptando participantes.')
      }

      // Verificar duplicados (nombre o email)
      const { data: existingParticipants } = await supabase
        .from('room_participants')
        .select('name, email')
        .eq('room_id', room.id)

      if (existingParticipants) {
        // Verificar email duplicado
        const emailExists = existingParticipants.find(
          p => p.email.toLowerCase() === email.toLowerCase()
        )
        if (emailExists) {
          throw new Error('Este email ya está registrado en esta sala.')
        }

        // Verificar nombre duplicado
        const nameExists = existingParticipants.find(
          p => p.name.toLowerCase().trim() === name.toLowerCase().trim()
        )
        if (nameExists) {
          throw new Error('Este nombre ya está registrado en esta sala. Por favor, usa tu nombre completo.')
        }
      }

      // Unirse a la sala
      const { data: participant, error: joinError } = await supabase
        .from('room_participants')
        .insert([{
          room_id: room.id,
          name,
          email
        }])
        .select()
        .single()

      if (joinError) {
        if (joinError.code === '23505') { // Duplicate key
          throw new Error('Este email ya está registrado en esta sala.')
        }
        throw joinError
      }

      setCurrentRoom(room)
      setCurrentParticipant(participant)
      setView('student-waiting')
      await loadParticipants(room.id)

      // Actualizar URL con el participant_id para poder volver después
      const newUrl = `${window.location.origin}?p=${participant.id}`
      window.history.replaceState({}, '', newUrl)
    } catch (error) {
      throw error
    }
  }

  const restoreStudentSession = async (participantId) => {
    try {
      console.log('🔄 Restaurando sesión del estudiante:', participantId)
      
      // Buscar el participante
      const { data: participant, error: participantError } = await supabase
        .from('room_participants')
        .select('*')
        .eq('id', participantId)
        .single()

      if (participantError || !participant) {
        console.error('❌ Participante no encontrado:', participantError)
        setView('home')
        return
      }

      console.log('✅ Participante encontrado:', participant)

      // Buscar la sala
      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', participant.room_id)
        .single()

      if (roomError || !room) {
        console.error('❌ Sala no encontrada:', roomError)
        setView('home')
        return
      }

      console.log('✅ Sala encontrada:', room)

      setCurrentRoom(room)
      setCurrentParticipant(participant)
      setView('student-waiting')
      await loadParticipants(room.id)
      
      console.log('✅ Sesión restaurada correctamente')
    } catch (error) {
      console.error('❌ Error restaurando sesión:', error)
      setView('home')
    }
  }

  const performDraw = async () => {
    if (participants.length < 2) {
      alert('Se necesitan al menos 2 participantes')
      return
    }

    try {
      // Actualizar estado de la sala
      await supabase
        .from('rooms')
        .update({ status: 'drawing' })
        .eq('id', currentRoom.id)

      // Crear asignaciones aleatorias
      const shuffled = [...participants]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }

      // Asegurar que nadie se regala a sí mismo
      for (let i = 0; i < participants.length; i++) {
        if (participants[i].id === shuffled[i].id) {
          const nextIndex = (i + 1) % shuffled.length
          ;[shuffled[i], shuffled[nextIndex]] = [shuffled[nextIndex], shuffled[i]]
        }
      }

      // Guardar asignaciones
      const assignments = participants.map((giver, index) => ({
        room_id: currentRoom.id,
        giver_id: giver.id,
        receiver_id: shuffled[index].id
      }))

      const { error } = await supabase
        .from('secret_santa_assignments')
        .insert(assignments)

      if (error) throw error

      // Enviar emails usando Resend y actualizar el estado en la BD
      const emailResults = await sendEmails(participants, shuffled)
      
      // Actualizar el campo email_sent en las asignaciones
      for (let i = 0; i < participants.length; i++) {
        const emailSent = emailResults[i]?.emailSent || false
        
        await supabase
          .from('secret_santa_assignments')
          .update({ email_sent: emailSent })
          .eq('room_id', currentRoom.id)
          .eq('giver_id', participants[i].id)
          .eq('receiver_id', shuffled[i].id)
      }

      // Marcar como completado
      await supabase
        .from('rooms')
        .update({ status: 'completed' })
        .eq('id', currentRoom.id)

      alert('¡Sorteo completado! Los emails han sido enviados.')
    } catch (error) {
      console.error('Error performing draw:', error)
      alert('Error al realizar el sorteo')
      
      // Revertir estado
      await supabase
        .from('rooms')
        .update({ status: 'waiting' })
        .eq('id', currentRoom.id)
    }
  }

  const sendEmails = async (givers, receivers) => {
    try {
      // Preparar datos para envío de emails
      const emailAssignments = givers.map((giver, index) => ({
        giverName: giver.name,
        giverEmail: giver.email,
        receiverName: receivers[index].name
      }))

      // Enviar todos los emails usando el servicio de Resend
      const results = await sendBulkSecretSantaEmails(emailAssignments, currentRoom.name)
      
      // Verificar resultados
      const failedEmails = results.filter(r => !r.emailSent)
      if (failedEmails.length > 0) {
        console.warn('Algunos emails no se enviaron:', failedEmails)
      }

      const successCount = results.filter(r => r.emailSent).length
      console.log(`✅ ${successCount} de ${results.length} emails enviados exitosamente`)
      
      return results
    } catch (error) {
      console.error('Error en sendEmails:', error)
      throw error
    }
  }

  const goBack = () => {
    if (view === 'teacher-room') {
      setView('teacher-dashboard')
      loadTeacherRooms(user.id)
    } else {
      setView('home')
    }
    setCurrentRoom(null)
    setParticipants([])
    setCurrentParticipant(null)
  }

  const openRoom = async (room) => {
    setCurrentRoom(room)
    setView('teacher-room')
    await loadParticipants(room.id)
  }

  const deleteRoom = async (roomId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta sala?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', roomId)
        .eq('teacher_id', user.id) // Seguridad: solo el profesor puede eliminar su sala

      if (error) throw error
      
      // Actualizar la lista de salas
      await loadTeacherRooms(user.id)
    } catch (error) {
      console.error('Error deleting room:', error)
      alert('Error al eliminar la sala. Inténtalo de nuevo.')
    }
  }

  const handleViewResults = (roomId) => {
    setResultsRoomId(roomId || currentRoom.id)
    setShowResultsModal(true)
  }

  const handleCloseResults = () => {
    setShowResultsModal(false)
    setResultsRoomId(null)
  }

  if (!supabaseConfigured) {
    return (
      <div className="app">
        <div className="config-warning-center">
          <h2>⚙️ Configuración Requerida</h2>
          <ol>
            <li>Crea un proyecto en <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">Supabase</a></li>
            <li>Ejecuta el script SQL que está en <code>supabase-setup.sql</code></li>
            <li>Copia tus credenciales al archivo <code>.env</code>:
              <pre>
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anon-key
              </pre>
            </li>
            <li>Reinicia el servidor de desarrollo</li>
          </ol>
          <p>Lee el archivo <code>README.md</code> para instrucciones detalladas.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="app">
        <div className="loading-screen">
          <div className="spinner-large"></div>
          <p>Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      {view === 'home' && (
        <HomePage 
          onCreateRoom={() => setView('teacher-auth')}
          onJoinAsStudent={() => setView('student')}
        />
      )}

      {view === 'teacher-auth' && (
        <TeacherAuth 
          onLogin={handleTeacherLogin}
          onRegister={handleTeacherRegister}
        />
      )}

      {view === 'teacher-dashboard' && user && (
        <TeacherDashboard 
          user={user}
          rooms={teacherRooms}
          onCreateRoom={createRoom}
          onOpenRoom={openRoom}
          onDeleteRoom={deleteRoom}
          onLogout={handleTeacherLogout}
        />
      )}

      {view === 'teacher-room' && currentRoom && (
        <TeacherView 
          room={currentRoom}
          participants={participants}
          onStartDraw={performDraw}
          onGoBack={goBack}
          onViewResults={handleViewResults}
        />
      )}

      {view === 'student' && (
        <StudentView 
          onJoinRoom={joinRoom}
          initialCode={new URLSearchParams(window.location.search).get('code') || ''}
        />
      )}

      {view === 'student-waiting' && currentRoom && currentParticipant && (
        <StudentWaiting 
          participant={currentParticipant}
          room={currentRoom}
          onLeave={goBack}
          supabase={supabase}
        />
      )}

      {showResultsModal && resultsRoomId && (
        <ResultsModal 
          roomId={resultsRoomId}
          roomName={currentRoom?.name || 'Sala'}
          onClose={handleCloseResults}
        />
      )}
    </div>
  )
}

export default App
