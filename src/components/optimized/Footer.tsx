import React from 'react'

// Performance optimization: Memoize component
const Footer: React.FC = React.memo(() => {
  return (
    <footer style={{
      backgroundColor: '#f8f9fa',
      padding: '24px',
      textAlign: 'center',
      marginTop: 'auto'
    }}>
      <p style={{ margin: 0, color: '#666' }}>
        © 2024 Product Portal. All rights reserved.
      </p>
    </footer>
  )
})

Footer.displayName = 'Footer'

export default Footer