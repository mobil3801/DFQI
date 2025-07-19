import React, { memo } from 'react'
import { Link } from 'react-router-dom'

/**
 * 404 Not Found page with helpful navigation
 */
const NotFoundPage = memo(() => {
  return (
    <div 
      className="not-found-page"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: '8rem',
          fontWeight: '700',
          color: 'var(--color-primary)',
          marginBottom: '1rem',
          lineHeight: '1',
        }}
      >
        404
      </div>
      
      <h1
        style={{
          fontSize: '2.5rem',
          fontWeight: '600',
          marginBottom: '1rem',
          color: 'var(--color-text)',
        }}
      >
        Page Not Found
      </h1>
      
      <p
        style={{
          fontSize: '1.125rem',
          color: 'var(--color-text-light)',
          marginBottom: '3rem',
          maxWidth: '500px',
        }}
      >
        Sorry, we couldn't find the page you're looking for. 
        The page might have been moved, deleted, or you entered the wrong URL.
      </p>
      
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <Link
          to="/"
          className="btn"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            padding: '1rem 2rem',
            fontSize: '1.125rem',
            fontWeight: '600',
            textDecoration: 'none',
            borderRadius: 'var(--border-radius)',
            transition: 'var(--transition)',
          }}
        >
          Go Home
        </Link>
        
        <Link
          to="/products"
          className="btn btn-outline"
          style={{
            backgroundColor: 'transparent',
            color: 'var(--color-primary)',
            border: '2px solid var(--color-primary)',
            padding: '1rem 2rem',
            fontSize: '1.125rem',
            fontWeight: '600',
            textDecoration: 'none',
            borderRadius: 'var(--border-radius)',
            transition: 'var(--transition)',
          }}
        >
          Browse Products
        </Link>
      </div>
      
      <div
        style={{
          marginTop: '3rem',
          padding: '2rem',
          backgroundColor: 'var(--color-bg-light)',
          borderRadius: 'var(--border-radius)',
          maxWidth: '600px',
        }}
      >
        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            marginBottom: '1rem',
            color: 'var(--color-text)',
          }}
        >
          Quick Links
        </h3>
        
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
          }}
        >
          <Link
            to="/"
            style={{
              color: 'var(--color-primary)',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'var(--transition)',
            }}
          >
            🏠 Home
          </Link>
          
          <Link
            to="/products"
            style={{
              color: 'var(--color-primary)',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'var(--transition)',
            }}
          >
            🛍️ Products
          </Link>
          
          <a
            href="mailto:support@productportal.com"
            style={{
              color: 'var(--color-primary)',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'var(--transition)',
            }}
          >
            📧 Contact Support
          </a>
          
          <button
            onClick={() => window.history.back()}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-primary)',
              fontWeight: '500',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '1rem',
              transition: 'var(--transition)',
            }}
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  )
})

NotFoundPage.displayName = 'NotFoundPage'

export default NotFoundPage