import React, { useState, useCallback, useMemo } from 'react'
import { useQuery } from 'react-query'
import { AutoSizer, List } from 'react-virtualized'
// Performance optimization: Import specific functions instead of entire libraries
import orderBy from 'lodash/orderBy'
import ProductCard from '../../components/optimized/ProductCard'
import SearchBar from '../../components/optimized/SearchBar'
import FilterPanel from '../../components/optimized/FilterPanel'
import LoadingSpinner from '../../components/optimized/LoadingSpinner'

// Performance optimization: Move mock data outside component
const mockProducts = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: Math.random() * 1000,
  category: ['Electronics', 'Clothing', 'Books', 'Home'][Math.floor(Math.random() * 4)],
  rating: Math.random() * 5,
  image: `https://picsum.photos/300/200?random=${i}`,
  description: `This is a detailed description for product ${i + 1} that contains a lot of text to simulate real product descriptions.`
}))

const ITEMS_PER_PAGE = 20

const ProductList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({})
  const [sortBy, setSortBy] = useState('name')
  const [currentPage, setCurrentPage] = useState(1)

  // Performance optimization: Fetch data with proper caching
  const { data: products = mockProducts, isLoading, error } = useQuery(
    'products',
    async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return mockProducts
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  )

  // Performance optimization: Memoize expensive filtering and sorting
  const filteredAndSortedProducts = useMemo(() => {
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
    filtered = orderBy(filtered, [sortBy], ['asc'])

    return filtered
  }, [products, searchTerm, filters, sortBy])

  // Performance optimization: Memoize pagination calculations
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const paginatedProducts = filteredAndSortedProducts.slice(startIndex, endIndex)

    return {
      totalPages,
      paginatedProducts,
      startIndex,
      endIndex
    }
  }, [filteredAndSortedProducts, currentPage])

  // Performance optimization: Memoize event handlers
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

  // Performance optimization: Virtualized row renderer
  const rowRenderer = useCallback(({ index, key, style }: any) => {
    const product = paginationData.paginatedProducts[index]
    if (!product) return null

    return (
      <div key={key} style={style}>
        <ProductCard product={product} />
      </div>
    )
  }, [paginationData.paginatedProducts])

  if (isLoading) return <LoadingSpinner />
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
        
        <div className="products-grid" style={{ height: '600px' }}>
          {/* Performance optimization: Use virtualization for large lists */}
          <AutoSizer>
            {({ width, height }) => (
              <List
                width={width}
                height={height}
                rowCount={paginationData.paginatedProducts.length}
                rowHeight={320} // Approximate height of ProductCard
                rowRenderer={rowRenderer}
                overscanRowCount={5}
              />
            )}
          </AutoSizer>
        </div>
      </div>

      {/* Performance optimization: Memoized pagination */}
      <div className="pagination">
        {Array.from({ length: paginationData.totalPages }, (_, i) => i + 1).map(page => (
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