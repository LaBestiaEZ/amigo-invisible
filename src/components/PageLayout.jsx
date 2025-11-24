function PageLayout({ children, centered = false, className = '' }) {
  return (
    <div 
      className={`min-h-screen min-h-[100svh] min-h-[100dvh] bg-gradient-to-br from-purple-500 to-purple-700 dark:from-gray-900 dark:to-gray-800 overflow-y-auto ${
        centered ? 'flex items-center justify-center' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}

export default PageLayout
