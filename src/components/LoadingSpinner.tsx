import React, { memo } from 'react'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  message?: string
  className?: string
}

/**
 * Reusable loading spinner component
 * Optimized for performance with memoization
 */
const LoadingSpinner = memo<LoadingSpinnerProps>(({
  size = 'medium',
  message = 'Loading...',
  className = '',
}) => {
  const sizeMap = {
    small: { spinner: '20px', text: '0.875rem' },
    medium: { spinner: '40px', text: '1rem' },
    large: { spinner: '60px', text: '1.125rem' },
  }

  const { spinner, text } = sizeMap[size]

  return (
    <div
      className={`loading-spinner ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
      role="status"
      aria-label={message}
    >
      <div
        className="spinner"
        style={{
          border: '3px solid #f3f3f3',
          borderTop: '3px solid var(--color-primary)',
          borderRadius: '50%',
          width: spinner,
          height: spinner,
          animation: 'spin 1s linear infinite',
          marginBottom: '1rem',
        }}
      />
      
      {message && (
        <p
          style={{
            fontSize: text,
            color: 'var(--color-text-light)',
            margin: 0,
          }}
        >
          {message}
        </p>
      )}
    </div>
  )
})

LoadingSpinner.displayName = 'LoadingSpinner'

export default LoadingSpinner