import { useState } from 'react'
import './TeacherAuth.css'

function TeacherAuth({ onLogin, onRegister }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        await onLogin(email, password)
      } else {
        if (password.length < 6) {
          throw new Error('La contraseña debe tener al menos 6 caracteres')
        }
        await onRegister(email, password, name)
      }
    } catch (err) {
      setError(err.message || 'Error en la autenticación')
      setLoading(false)
    }
  }

  return (
    <div className="teacher-auth">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">👨‍🏫</div>
          <h1>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h1>
          <p>Acceso para Profesores</p>
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label>Nombre completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: María García"
                required={!isLogin}
                disabled={loading}
                autoFocus
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="profesor@instituto.edu"
              required
              disabled={loading}
              autoFocus={isLogin}
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="btn-spinner"></div>
                {isLogin ? 'Iniciando sesión...' : 'Creando cuenta...'}
              </>
            ) : (
              isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'
            )}
          </button>
        </form>

        <div className="auth-switch">
          {isLogin ? (
            <p>
              ¿No tienes cuenta?{' '}
              <button onClick={() => setIsLogin(false)} className="switch-btn">
                Crear cuenta
              </button>
            </p>
          ) : (
            <p>
              ¿Ya tienes cuenta?{' '}
              <button onClick={() => setIsLogin(true)} className="switch-btn">
                Iniciar sesión
              </button>
            </p>
          )}
        </div>

        <div className="auth-footer">
          <p>🔒 Tu cuenta te permite gestionar múltiples sorteos y recuperar tus salas</p>
        </div>
      </div>
    </div>
  )
}

export default TeacherAuth
