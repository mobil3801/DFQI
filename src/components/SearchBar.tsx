import React, { useState, useEffect, useRef, memo } from 'react'
import { useQuery } from 'react-query'
import { useDebounce } from '@/hooks/useDebounce'
import { productApi } from '@/utils/api'
import { Product } from '@/types'
import clsx from 'clsx'

interface SearchBarProps {
  onSearchSelect?: (product: Product) => void
  placeholder?: string
  className?: string
}

/**
 * Optimized search bar with debouncing and autocomplete
 * Uses React Query for caching and request deduplication
 */
const SearchBar = memo<SearchBarProps>(({
  onSearchSelect,
  placeholder = "Search products...",
  className,
}) => {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  
  // Debounce search query to avoid excessive API calls
  const debouncedQuery = useDebounce(query, 300)

  // Search products with React Query
  const { data: searchResults = [], isLoading } = useQuery(
    ['search', debouncedQuery],
    () => productApi.searchProducts(debouncedQuery, 8),
    {
      enabled: debouncedQuery.length >= 2,
      staleTime: 30000, // 30 seconds
      cacheTime: 300000, // 5 minutes
    }
  )

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setSelectedIndex(-1)
    setIsOpen(value.length >= 2)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || searchResults.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : searchResults.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleSelect(searchResults[selectedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  // Handle result selection
  const handleSelect = (product: Product) => {
    setQuery(product.name)
    setIsOpen(false)
    setSelectedIndex(-1)
    onSearchSelect?.(product)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={clsx('search-bar', className)} style={{ position: 'relative' }}>
      {/* Search Input */}
      <div className="search-input-container" style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder={placeholder}
          className="search-input"
          style={{
            width: '100%',
            padding: '0.75rem 3rem 0.75rem 1rem',
            border: '2px solid var(--color-border)',
            borderRadius: 'var(--border-radius)',
            fontSize: '1rem',
            transition: 'var(--transition)',
          }}
          aria-label="Search products"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          role="combobox"
        />
        
        {/* Search Icon */}
        <div
          className="search-icon"
          style={{
            position: 'absolute',
            right: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-text-light)',
            pointerEvents: 'none',
          }}
        >
          🔍
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div
            className="search-loading"
            style={{
              position: 'absolute',
              right: '3rem',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            <div className="spinner" style={{ width: '16px', height: '16px' }} />
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div
          ref={resultsRef}
          className="search-results"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--border-radius)',
            boxShadow: 'var(--box-shadow)',
            maxHeight: '400px',
            overflowY: 'auto',
            zIndex: 1000,
          }}
          role="listbox"
        >
          {searchResults.length > 0 ? (
            searchResults.map((product, index) => (
              <div
                key={product.id}
                onClick={() => handleSelect(product)}
                className={clsx('search-result-item', {
                  'selected': index === selectedIndex
                })}
                style={{
                  padding: '0.75rem 1rem',
                  cursor: 'pointer',
                  borderBottom: index < searchResults.length - 1 ? '1px solid var(--color-border)' : 'none',
                  backgroundColor: index === selectedIndex ? 'var(--color-bg-light)' : 'transparent',
                  transition: 'var(--transition)',
                }}
                role="option"
                aria-selected={index === selectedIndex}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={product.thumbnailUrl || product.imageUrl}
                    alt={product.name}
                    style={{
                      width: '40px',
                      height: '40px',
                      objectFit: 'cover',
                      borderRadius: 'var(--border-radius)',
                      marginRight: '0.75rem',
                    }}
                    loading="lazy"
                  />
                  <div>
                    <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                      {product.name}
                    </div>
                    <div style={{ 
                      fontSize: '0.875rem', 
                      color: 'var(--color-text-light)',
                      fontWeight: '600',
                    }}>
                      ${product.price.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : debouncedQuery.length >= 2 && !isLoading ? (
            <div
              className="no-results"
              style={{
                padding: '1rem',
                textAlign: 'center',
                color: 'var(--color-text-light)',
              }}
            >
              No products found for "{debouncedQuery}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
})

SearchBar.displayName = 'SearchBar'

export default SearchBar