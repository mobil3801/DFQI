import React, { useState, useEffect } from 'react'
// Performance issue: Importing entire lodash
import _ from 'lodash'

interface SearchBarProps {
  onSearch: (term: string) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])

  // Performance issue: Expensive debouncing on every render
  const debouncedSearch = _.debounce((term: string) => {
    onSearch(term)
  }, 300)

  // Performance issue: Expensive suggestion generation
  useEffect(() => {
    if (searchTerm.length > 2) {
      const mockSuggestions = [
        'electronics',
        'clothing',
        'books',
        'home',
        'sports',
        'beauty',
        'toys',
        'automotive'
      ].filter(item => item.includes(searchTerm.toLowerCase()))
      
      setSuggestions(mockSuggestions)
    } else {
      setSuggestions([])
    }
  }, [searchTerm])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    debouncedSearch(value)
  }

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
              key={index}
              onClick={() => {
                setSearchTerm(suggestion)
                onSearch(suggestion)
                setSuggestions([])
              }}
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
}

export default SearchBar