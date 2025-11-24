function LoadingSpinner({ size = 'medium', color = 'purple' }) {
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  }

  const colors = {
    purple: 'border-purple-500 dark:border-purple-400',
    green: 'border-green-500 dark:border-green-400',
    white: 'border-white dark:border-white'
  }

  return (
    <div 
      className={`${sizes[size]} border-4 ${colors[color]} border-t-transparent rounded-full animate-spin`}
    />
  )
}

export default LoadingSpinner
