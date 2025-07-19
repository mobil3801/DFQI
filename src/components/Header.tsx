import React from 'react'
import { Link } from 'react-router-dom'
// Performance issue: Importing entire lodash
import _ from 'lodash'

interface HeaderProps {
  theme: string
  setTheme: (theme: string) => void
  user: any
}

const Header: React.FC<HeaderProps> = ({ theme, setTheme, user }) => {
  // Performance issue: Expensive operation on every render
  const menuItems = _.shuffle([
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ])

  // Performance issue: Inline styles
  const headerStyle = {
    backgroundColor: theme === 'light' ? '#ffffff' : '#1a1a1a',
    borderBottom: '1px solid #ddd',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky' as const,
    top: 0,
    zIndex: 1000,
  }

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
          {menuItems.map(item => (
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
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          style={{
            padding: '8px 16px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            backgroundColor: 'transparent',
            cursor: 'pointer'
          }}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        
        {user ? (
          <span>Welcome, {user.name}</span>
        ) : (
          <button style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Login
          </button>
        )}
      </div>
    </header>
  )
}

export default Header