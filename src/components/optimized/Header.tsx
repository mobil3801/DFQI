import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'

interface HeaderProps {
  theme: string
  onThemeToggle: () => void
  user: any
}

// Performance optimization: Move static data outside component
const MENU_ITEMS = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' }
]

// Performance optimization: Memoize component
const Header: React.FC<HeaderProps> = React.memo(({ theme, onThemeToggle, user }) => {
  // Performance optimization: Memoize styles
  const headerStyle = useMemo(() => ({
    backgroundColor: theme === 'light' ? '#ffffff' : '#1a1a1a',
    borderBottom: '1px solid #ddd',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky' as const,
    top: 0,
    zIndex: 1000,
  }), [theme])

  const buttonStyle = useMemo(() => ({
    padding: '8px 16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: 'transparent',
    cursor: 'pointer'
  }), [])

  const loginButtonStyle = useMemo(() => ({
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }), [])

  return (
    <header style={headerStyle}>
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
          Product Portal
        </h1>
      </Link>

      <nav>
        <ul style={{ 
          display: 'flex', 
          listStyle: 'none', 
          margin: 0, 
          padding: 0, 
          gap: '24px' 
        }}>
          {MENU_ITEMS.map(item => (
            <li key={item.name}>
              <Link 
                to={item.path}
                style={{ 
                  textDecoration: 'none', 
                  color: 'inherit',
                  fontWeight: '500',
                  transition: 'color 0.3s ease'
                }}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={onThemeToggle} style={buttonStyle}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        
        {user ? (
          <span>Welcome, {user.name}</span>
        ) : (
          <button style={loginButtonStyle}>
            Login
          </button>
        )}
      </div>
    </header>
  )
})

Header.displayName = 'Header'

export default Header