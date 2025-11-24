function PageLayout({ children, centered = false, className = '' }) {
  return (
    <div 
      className={`min-h-screen min-h-[100svh] min-h-[100dvh] overflow-y-auto bg-radial-purple dark:bg-radial-dark ${
        centered ? 'flex items-center justify-center' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}

export default PageLayout
