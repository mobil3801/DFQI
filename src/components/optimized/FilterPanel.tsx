import React, { useMemo, useCallback } from 'react'

interface FilterPanelProps {
  filters: any
  onFilterChange: (filters: any) => void
  sortBy: string
  onSortChange: (sortBy: string) => void
}

// Performance optimization: Move static data outside component
const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home']
const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'price', label: 'Price' },
  { value: 'rating', label: 'Rating' },
  { value: 'category', label: 'Category' }
]

// Performance optimization: Memoize component
const FilterPanel: React.FC<FilterPanelProps> = React.memo(({ 
  filters, 
  onFilterChange, 
  sortBy, 
  onSortChange 
}) => {
  // Performance optimization: Memoize styles
  const panelStyle = useMemo(() => ({
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    marginBottom: '16px'
  }), [])

  const selectStyle = useMemo(() => ({
    width: '100%',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px'
  }), [])

  // Performance optimization: Memoize event handlers
  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, category: e.target.value })
  }, [filters, onFilterChange])

  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(e.target.value)
  }, [onSortChange])

  return (
    <div style={panelStyle}>
      <h3 style={{ margin: '0 0 16px 0' }}>Filters</h3>
      
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
          Category:
        </label>
        <select
          value={filters.category || ''}
          onChange={handleFilterChange}
          style={selectStyle}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
          Sort by:
        </label>
        <select
          value={sortBy}
          onChange={handleSortChange}
          style={selectStyle}
        >
          {SORT_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
})

FilterPanel.displayName = 'FilterPanel'

export default FilterPanel