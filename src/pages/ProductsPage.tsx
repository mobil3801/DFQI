import React, { memo, useState, useCallback, useMemo } from 'react'
import { useInfiniteQuery } from 'react-query'
import { productApi } from '@/utils/api'
import { ProductFilters } from '@/types'
import VirtualizedProductList from '@/components/VirtualizedProductList'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useDebounce } from '@/hooks/useDebounce'

/**
 * Products page with virtualized list and infinite scrolling
 * Optimized for performance with large datasets
 */
const ProductsPage = memo(() => {
  const [filters, setFilters] = useState<ProductFilters>({
    sortBy: 'name',
    sortOrder: 'asc',
  })
  const [searchQuery, setSearchQuery] = useState('')

  // Debounce search query to reduce API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  // Create final filters with debounced search
  const finalFilters = useMemo(() => ({
    ...filters,
    search: debouncedSearchQuery || undefined,
  }), [filters, debouncedSearchQuery])

  // Infinite query for products with virtualization
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ['products', finalFilters],
    ({ pageParam = 1 }) => productApi.getProducts(finalFilters, pageParam, 20),
    {
      getNextPageParam: (lastPage) => 
        lastPage.hasNextPage ? lastPage.page + 1 : undefined,
      staleTime: 2 * 60 * 1000, // 2 minutes
      cacheTime: 5 * 60 * 1000, // 5 minutes
      keepPreviousData: true, // Keep previous data while loading new filters
    }
  )

  // Flatten pages into single array for virtualization
  const products = useMemo(() => {
    return data?.pages.flatMap(page => page.data) ?? []
  }, [data])

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: Partial<ProductFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  // Handle search input change
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [])

  // Load next page for infinite scrolling
  const loadNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  if (isError) {
    return (
      <div className="error-state" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>Error loading products</h2>
        <p>{(error as Error)?.message || 'Something went wrong'}</p>
      </div>
    )
  }

  return (
    <div className="products-page" style={{ padding: '2rem 0' }}>
      <div className="container">
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: '600',
            marginBottom: '2rem',
            color: 'var(--color-text)',
          }}
        >
          Products
        </h1>

        {/* Filters and Search */}
        <div
          className="filters-section"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2rem',
            padding: '1.5rem',
            backgroundColor: 'var(--color-bg)',
            borderRadius: 'var(--border-radius)',
            boxShadow: 'var(--box-shadow)',
          }}
        >
          {/* Search Input */}
          <div style={{ flex: '1', minWidth: '300px' }}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '2px solid var(--color-border)',
                borderRadius: 'var(--border-radius)',
                fontSize: '1rem',
              }}
            />
          </div>

          {/* Sort By */}
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange({ sortBy: e.target.value as any })}
            style={{
              padding: '0.75rem 1rem',
              border: '2px solid var(--color-border)',
              borderRadius: 'var(--border-radius)',
              fontSize: '1rem',
              backgroundColor: 'var(--color-bg)',
            }}
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="rating">Sort by Rating</option>
            <option value="createdAt">Sort by Date</option>
          </select>

          {/* Sort Order */}
          <select
            value={filters.sortOrder}
            onChange={(e) => handleFilterChange({ sortOrder: e.target.value as any })}
            style={{
              padding: '0.75rem 1rem',
              border: '2px solid var(--color-border)',
              borderRadius: 'var(--border-radius)',
              fontSize: '1rem',
              backgroundColor: 'var(--color-bg)',
            }}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>

          {/* Price Range */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice || ''}
              onChange={(e) => handleFilterChange({ 
                minPrice: e.target.value ? Number(e.target.value) : undefined 
              })}
              style={{
                width: '120px',
                padding: '0.75rem 1rem',
                border: '2px solid var(--color-border)',
                borderRadius: 'var(--border-radius)',
                fontSize: '1rem',
              }}
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice || ''}
              onChange={(e) => handleFilterChange({ 
                maxPrice: e.target.value ? Number(e.target.value) : undefined 
              })}
              style={{
                width: '120px',
                padding: '0.75rem 1rem',
                border: '2px solid var(--color-border)',
                borderRadius: 'var(--border-radius)',
                fontSize: '1rem',
              }}
            />
          </div>

          {/* In Stock Filter */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--color-bg-light)',
              borderRadius: 'var(--border-radius)',
            }}
          >
            <input
              type="checkbox"
              checked={filters.inStock || false}
              onChange={(e) => handleFilterChange({ 
                inStock: e.target.checked ? true : undefined 
              })}
            />
            In Stock Only
          </label>
        </div>

        {/* Results Info */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <p style={{ color: 'var(--color-text-light)' }}>
            {data?.pages[0]?.total ? `${data.pages[0].total} products found` : ''}
            {debouncedSearchQuery && ` for "${debouncedSearchQuery}"`}
          </p>
          
          {isFetchingNextPage && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LoadingSpinner size="small" message="" />
              <span style={{ color: 'var(--color-text-light)', fontSize: '0.875rem' }}>
                Loading more...
              </span>
            </div>
          )}
        </div>

        {/* Products List */}
        {isLoading ? (
          <LoadingSpinner message="Loading products..." />
        ) : products.length > 0 ? (
          <VirtualizedProductList
            products={products}
            hasNextPage={!!hasNextPage}
            isNextPageLoading={isFetchingNextPage}
            loadNextPage={loadNextPage}
            itemHeight={450}
            overscan={2}
          />
        ) : (
          <div
            className="no-products"
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              color: 'var(--color-text-light)',
            }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No products found</h3>
            <p>Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </div>
  )
})

ProductsPage.displayName = 'ProductsPage'

export default ProductsPage