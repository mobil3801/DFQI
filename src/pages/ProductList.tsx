import React, { useState, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
// Performance fix: Import only what we need
import { orderBy } from 'lodash'
import ProductCard from '../components/ProductCard'
import SearchBar from '../components/SearchBar'
import FilterPanel from '../components/FilterPanel'
import { useProducts } from '../lib/useSupabase'

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({})
  const [sortBy, setSortBy] = useState('name')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)

  // Performance fix: Use Supabase with React Query
  const { data: products = [], isLoading, error } = useProducts()

  // Performance fix: Memoized filtering and sorting
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Apply filters
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category)
    }

    // Sort products
    filtered = orderBy(filtered, [sortBy], ['asc'])

    return filtered
  }, [products, searchTerm, filters, sortBy])

  // Performance fix: Memoized pagination
  const paginatedProducts = useMemo(() => 
    filteredAndSortedProducts.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    ), [filteredAndSortedProducts, currentPage, itemsPerPage]
  )

  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage)

  // Performance fix: Memoized event handlers
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }, [])

  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }, [])

  const handleSortChange = useCallback((newSortBy: string) => {
    setSortBy(newSortBy)
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading products</div>

  return (
    <div className="product-list">
      <div className="product-list-header">
        <h1>Products ({filteredAndSortedProducts.length})</h1>
        <SearchBar onSearch={handleSearch} />
      </div>
      
      <div className="product-list-content">
        <FilterPanel 
          filters={filters}
          onFilterChange={handleFilterChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
        />
        
        <div className="products-grid">
          {/* Performance issue: No virtualization for large lists */}
          {paginatedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Performance issue: Inline pagination component */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={currentPage === page ? 'active' : ''}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  )
}

export default ProductList