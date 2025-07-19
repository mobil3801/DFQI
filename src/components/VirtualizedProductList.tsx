import React, { memo, useMemo } from 'react'
import { FixedSizeList as List } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import { Product } from '@/types'
import ProductCard from './ProductCard'

interface VirtualizedProductListProps {
  products: Product[]
  hasNextPage: boolean
  isNextPageLoading: boolean
  loadNextPage: () => void
  itemHeight?: number
  overscan?: number
}

interface ItemData {
  products: Product[]
  itemsPerRow: number
}

/**
 * Virtualized product list for optimal performance with large datasets
 * Uses react-window for virtualization and infinite loading
 */
const VirtualizedProductList = memo<VirtualizedProductListProps>(({
  products,
  hasNextPage,
  isNextPageLoading,
  loadNextPage,
  itemHeight = 400,
  overscan = 5,
}) => {
  // Calculate items per row based on screen size
  const itemsPerRow = useMemo(() => {
    if (typeof window === 'undefined') return 4
    const width = window.innerWidth
    if (width < 768) return 1
    if (width < 1024) return 2
    if (width < 1280) return 3
    return 4
  }, [])

  // Calculate total number of rows
  const rowCount = Math.ceil(products.length / itemsPerRow)
  const itemCount = hasNextPage ? rowCount + 1 : rowCount

  // Check if item is loaded
  const isItemLoaded = (index: number) => {
    return index < rowCount
  }

  // Item data for the list
  const itemData: ItemData = useMemo(() => ({
    products,
    itemsPerRow,
  }), [products, itemsPerRow])

  return (
    <div className="virtualized-list-container" style={{ height: '600px', width: '100%' }}>
      <InfiniteLoader
        isItemLoaded={isItemLoaded}
        itemCount={itemCount}
        loadMoreItems={loadNextPage}
      >
        {({ onItemsRendered, ref }) => (
          <List
            ref={ref}
            height={600}
            itemCount={itemCount}
            itemSize={itemHeight}
            itemData={itemData}
            onItemsRendered={onItemsRendered}
            overscanCount={overscan}
            className="virtualized-list"
          >
            {VirtualizedRow}
          </List>
        )}
      </InfiniteLoader>
    </div>
  )
})

/**
 * Individual row component for the virtualized list
 */
const VirtualizedRow = memo<{
  index: number
  style: React.CSSProperties
  data: ItemData
}>(({ index, style, data }) => {
  const { products, itemsPerRow } = data
  const startIndex = index * itemsPerRow
  const endIndex = Math.min(startIndex + itemsPerRow, products.length)
  const rowProducts = products.slice(startIndex, endIndex)

  // Loading row
  if (startIndex >= products.length) {
    return (
      <div style={style} className="loading-row">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: itemsPerRow }).map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton" style={{ height: '200px', marginBottom: '1rem' }} />
              <div className="skeleton" style={{ height: '20px', marginBottom: '0.5rem' }} />
              <div className="skeleton" style={{ height: '16px', width: '60%' }} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={style} className="product-row">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {rowProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        
        {/* Fill empty slots with placeholders if needed */}
        {rowProducts.length < itemsPerRow &&
          Array.from({ length: itemsPerRow - rowProducts.length }).map((_, i) => (
            <div key={`placeholder-${i}`} style={{ visibility: 'hidden' }} />
          ))}
      </div>
    </div>
  )
})

VirtualizedRow.displayName = 'VirtualizedRow'
VirtualizedProductList.displayName = 'VirtualizedProductList'

export default VirtualizedProductList