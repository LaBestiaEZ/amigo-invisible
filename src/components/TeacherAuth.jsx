import { useState } from 'react'
import LoadingSpinner from './LoadingSpinner'
import PageLayout from './PageLayout'

function TeacherAuth({ onLogin, onRegister, onBack}) {
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
    <PageLayout centered className="p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 animate-fade-in my-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4">
            <button
              onClick={onBack}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors font-medium"
            >
              ← Volver
            </button>
          </div>
          <div className="text-center">
            <div className="text-6xl mb-4">👨‍🏫</div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Acceso para Organizadores</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: María García"
                required={!isLogin}
                disabled={loading}
                autoFocus
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent disabled:opacity-50"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="profesor@instituto.edu"
              required
              disabled={loading}
              autoFocus={isLogin}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              disabled={loading}
              minLength={6}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent disabled:opacity-50"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <LoadingSpinner size="small" color="white" />}
            {loading ? (isLogin ? 'Iniciando sesión...' : 'Creando cuenta...') : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
          </button>
        </form>

        {/* Switch Mode */}
        <div className="mt-6 text-center text-gray-600 dark:text-gray-400">
          {isLogin ? (
            <p>
              ¿No tienes cuenta?{' '}
              <button 
                onClick={() => setIsLogin(false)} 
                className="text-purple-600 dark:text-purple-400 font-medium hover:underline"
              >
                Crear cuenta
              </button>
            </p>
          ) : (
            <p>
              ¿Ya tienes cuenta?{' '}
              <button 
                onClick={() => setIsLogin(true)} 
                className="text-purple-600 dark:text-purple-400 font-medium hover:underline"
              >
                Iniciar sesión
              </button>
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-500">
          <p>🔒 Tu cuenta te permite gestionar múltiples sorteos y recuperar tus salas</p>
        </div>
      </div>
    </PageLayout>
  )
}

export default TeacherAuth
