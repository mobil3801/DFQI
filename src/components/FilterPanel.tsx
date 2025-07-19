import React from 'react'

interface FilterPanelProps {
  filters: any
  onFilterChange: (filters: any) => void
  sortBy: string
  onSortChange: (sortBy: string) => void
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange, sortBy, onSortChange }) => {
  const categories = ['Electronics', 'Clothing', 'Books', 'Home']
  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'price', label: 'Price' },
    { value: 'rating', label: 'Rating' },
    { value: 'category', label: 'Category' }
  ]

  return (
    <div style={{
      padding: '16px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      marginBottom: '16px'
    }}>
      <h3 style={{ margin: '0 0 16px 0' }}>Filters</h3>
      
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
          Category:
        </label>
        <select
          value={filters.category || ''}
          onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
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
          onChange={(e) => onSortChange(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default FilterPanel