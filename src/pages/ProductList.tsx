import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import axios from 'axios'
// Performance issue: Importing entire lodash
import _ from 'lodash'
import ProductCard from '../components/ProductCard'
import SearchBar from '../components/SearchBar'
import FilterPanel from '../components/FilterPanel'

// Performance issue: Large mock data array
const mockProducts = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: Math.random() * 1000,
  category: ['Electronics', 'Clothing', 'Books', 'Home'][Math.floor(Math.random() * 4)],
  rating: Math.random() * 5,
  image: `https://picsum.photos/300/200?random=${i}`,
  description: `This is a detailed description for product ${i + 1} that contains a lot of text to simulate real product descriptions.`
}))

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({})
  const [sortBy, setSortBy] = useState('name')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)

  // Performance issue: Fetching all data at once without pagination
  const { data: products = mockProducts, isLoading, error } = useQuery(
    'products',
    async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      return mockProducts
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  )

  // Performance issue: Expensive filtering and sorting on every render
  const filteredAndSortedProducts = React.useMemo(() => {
    let filtered = products

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply filters
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category)
    }

    // Sort products
    filtered = _.orderBy(filtered, [sortBy], ['asc'])

    return filtered
  }, [products, searchTerm, filters, sortBy])

  // Performance issue: Calculating pagination on every render
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage)

  // Performance issue: Inline event handlers creating new functions on every render
  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

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