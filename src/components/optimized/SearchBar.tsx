import React, { useState, useCallback, useMemo } from 'react'
import { useDebounce } from '../../hooks/optimized/useDebounce'

interface SearchBarProps {
  onSearch: (term: string) => void
}

// Performance optimization: Move static data outside component
const SUGGESTIONS = [
  'electronics',
  'clothing',
  'books',
  'home',
  'sports',
  'beauty',
  'toys',
  'automotive'
]

const SearchBar: React.FC<SearchBarProps> = React.memo(({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])

  // Performance optimization: Use custom debounce hook
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // Performance optimization: Memoize filtered suggestions
  const filteredSuggestions = useMemo(() => {
    if (searchTerm.length > 2) {
      return SUGGESTIONS.filter(item => 
        item.includes(searchTerm.toLowerCase())
      )
    }
    return []
  }, [searchTerm])

  // Performance optimization: Memoize event handlers
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
  }, [])

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setSearchTerm(suggestion)
    onSearch(suggestion)
    setSuggestions([])
  }, [onSearch])

  // Performance optimization: Trigger search when debounced term changes
  React.useEffect(() => {
    onSearch(debouncedSearchTerm)
  }, [debouncedSearchTerm, onSearch])

  // Performance optimization: Update suggestions when filtered suggestions change
  React.useEffect(() => {
    setSuggestions(filteredSuggestions)
  }, [filteredSuggestions])

  return (
    <div style={{ position: 'relative', width: '300px' }}>
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={handleInputChange}
        style={{
          width: '100%',
          padding: '12px 16px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          fontSize: '16px',
          outline: 'none'
        }}
      />
      
      {suggestions.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          zIndex: 1000
        }}>
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              style={{
                padding: '8px 16px',
                cursor: 'pointer',
                borderBottom: index < suggestions.length - 1 ? '1px solid #eee' : 'none'
              }}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  )
})

SearchBar.displayName = 'SearchBar'

export default SearchBar