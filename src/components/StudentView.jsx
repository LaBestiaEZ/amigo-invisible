import { useState } from 'react'
import './StudentView.css'
import { HapticFeedback } from '../lib/haptic'

function StudentView({ onJoinRoom, initialCode = '' }) {
  const [code, setCode] = useState(initialCode)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [step, setStep] = useState(initialCode ? 'form' : 'code') // code or form
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCodeSubmit = (e) => {
    e.preventDefault()
    if (code.trim()) {
      HapticFeedback.light()
      setStep('form')
      setError('')
    }
  }

  const handleJoinSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    HapticFeedback.medium()

    try {
      await onJoinRoom(code.toUpperCase(), name.trim(), email.trim())
      HapticFeedback.success()
    } catch (err) {
      HapticFeedback.error()
      setError(err.message || 'Error al unirse a la sala')
      setLoading(false)
    }
  }

  return (
    <div className="student-view">
      <div className="student-container">
        <div className="student-header">
          <div className="logo">🎅</div>
          <h1>Amigo Invisible</h1>
          <p>Únete a la sala de tu clase</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {step === 'code' && (
          <form onSubmit={handleCodeSubmit} className="code-form">
            <div className="form-group">
              <label>Código de la sala</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Ej: ABC123"
                maxLength={6}
                className="code-input"
                autoFocus
                required
              />
            </div>
            <button type="submit" className="btn-primary">
              Continuar →
            </button>
          </form>
        )}

        {step === 'form' && (
          <div className="join-form-container">
            <div className="room-code-display">
              <span>Sala: {code}</span>
              <button 
                onClick={() => setStep('code')} 
                className="change-code-btn"
              >
                Cambiar
              </button>
            </div>

            <form onSubmit={handleJoinSubmit} className="join-form">
              <div className="form-group">
                <label>Tu nombre completo</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  required
                  disabled={loading}
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>Tu email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ej: juan@instituto.edu"
                  required
                  disabled={loading}
                />
                <small>Recibirás tu amigo invisible por email</small>
              </div>

              <button 
                type="submit" 
                className="btn-join"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="btn-spinner"></div>
                    Uniéndose...
                  </>
                ) : (
                  '🎁 Unirse a la sala'
                )}
              </button>
            </form>
          </div>
        )}

        <div className="student-footer">
          <p>Escanea el QR del profesor o ingresa el código de la sala</p>
        </div>
      </div>
    </div>
  )
}

export default StudentView
