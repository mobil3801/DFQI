import React, { memo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SearchBar from './SearchBar'
import { Product } from '@/types'

/**
 * Header component with navigation and search
 * Memoized for performance optimization
 */
const Header = memo(() => {
  const navigate = useNavigate()

  const handleSearchSelect = (product: Product) => {
    navigate(`/products/${product.id}`)
  }

  return (
    <header
      className="header"
      style={{
        backgroundColor: 'var(--color-bg)',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: 'var(--box-shadow)',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 0',
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            className="logo"
            style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: 'var(--color-primary)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            🛍️ ProductPortal
          </Link>

          {/* Search Bar */}
          <div
            style={{
              flex: 1,
              maxWidth: '500px',
              margin: '0 2rem',
            }}
          >
            <SearchBar
              onSearchSelect={handleSearchSelect}
              placeholder="Search products..."
            />
          </div>

          {/* Navigation */}
          <nav
            className="nav"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
            }}
          >
            <Link
              to="/"
              className="nav-link"
              style={{
                textDecoration: 'none',
                color: 'var(--color-text)',
                fontWeight: '500',
                transition: 'var(--transition)',
              }}
            >
              Home
            </Link>
            <Link
              to="/products"
              className="nav-link"
              style={{
                textDecoration: 'none',
                color: 'var(--color-text)',
                fontWeight: '500',
                transition: 'var(--transition)',
              }}
            >
              Products
            </Link>
            <button
              className="btn btn-outline"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--color-primary)',
                border: '2px solid var(--color-primary)',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--border-radius)',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                transition: 'var(--transition)',
              }}
            >
              🛒 Cart
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
})

Header.displayName = 'Header'

export default Header