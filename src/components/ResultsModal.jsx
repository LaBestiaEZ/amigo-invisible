import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import './ResultsModal.css'

function ResultsModal({ roomId, roomName, onClose }) {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAssignments()
  }, [roomId])

  const loadAssignments = async () => {
    try {
      // Obtener todas las asignaciones con información de los participantes
      const { data, error } = await supabase
        .from('secret_santa_assignments')
        .select(`
          *,
          giver:room_participants!giver_id(id, name, email),
          receiver:room_participants!receiver_id(id, name, email)
        `)
        .eq('room_id', roomId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setAssignments(data || [])
    } catch (error) {
      console.error('Error loading assignments:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadResults = () => {
    // Crear contenido CSV
    let csv = 'Quien regala,Email,Amigo invisible,Email amigo invisible\n'
    assignments.forEach(assignment => {
      csv += `${assignment.giver.name},${assignment.giver.email},${assignment.receiver.name},${assignment.receiver.email}\n`
    })

    // Descargar archivo
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `sorteo-${roomName.replace(/\s+/g, '-')}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📊 Resultados del Sorteo</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="modal-info">
            <h3>{roomName}</h3>
            <p>Total de asignaciones: {assignments.length}</p>
            <p className="warning-text">
              ⚠️ Esta información es confidencial. Los estudiantes NO pueden verla.
            </p>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Cargando resultados...</p>
            </div>
          ) : (
            <>
              <div className="assignments-table">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Quien regala</th>
                      <th>→</th>
                      <th>Amigo invisible</th>
                      <th>Estado email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.map((assignment, index) => (
                      <tr key={assignment.id}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="person-cell">
                            <span className="person-name">{assignment.giver.name}</span>
                            <span className="person-email">{assignment.giver.email}</span>
                          </div>
                        </td>
                        <td className="arrow-cell">→</td>
                        <td>
                          <div className="person-cell">
                            <span className="person-name">{assignment.receiver.name}</span>
                            <span className="person-email">{assignment.receiver.email}</span>
                          </div>
                        </td>
                        <td>
                          {assignment.email_sent ? (
                            <span className="status-badge success">✓ Enviado</span>
                          ) : (
                            <span className="status-badge pending">⏳ Pendiente</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="modal-actions">
                <button onClick={downloadResults} className="download-btn">
                  💾 Descargar CSV
                </button>
                <button onClick={onClose} className="close-btn">
                  Cerrar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResultsModal
