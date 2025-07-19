import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { Product } from '@/types'
import LazyImage from './LazyImage'
import clsx from 'clsx'

interface ProductCardProps {
  product: Product
  className?: string
  priority?: boolean
}

/**
 * Optimized product card component
 * Memoized for performance with large lists
 * Uses lazy loading for images
 */
const ProductCard = memo<ProductCardProps>(({ 
  product, 
  className,
  priority = false 
}) => {
  const {
    id,
    name,
    description,
    price,
    rating,
    reviewCount,
    inStock,
    imageUrl,
    thumbnailUrl,
  } = product

  // Format price
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)

  // Generate star rating
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.floor(rating))

  return (
    <article 
      className={clsx('card product-card contain-layout', className)}
      itemScope
      itemType="https://schema.org/Product"
    >
      <Link 
        to={`/products/${id}`}
        className="product-link"
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        {/* Product Image */}
        <div className="product-image-container" style={{ position: 'relative', marginBottom: '1rem' }}>
          <LazyImage
            src={thumbnailUrl || imageUrl}
            alt={name}
            width={300}
            height={200}
            className="product-image"
          />
          
          {/* Stock status badge */}
          <div
            className={clsx(
              'stock-badge',
              inStock ? 'in-stock' : 'out-of-stock'
            )}
            style={{
              position: 'absolute',
              top: '0.5rem',
              right: '0.5rem',
              padding: '0.25rem 0.5rem',
              borderRadius: 'var(--border-radius)',
              fontSize: '0.75rem',
              fontWeight: '600',
              backgroundColor: inStock ? 'var(--color-success)' : 'var(--color-error)',
              color: 'white',
            }}
          >
            {inStock ? 'In Stock' : 'Out of Stock'}
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info">
          <h3 
            className="product-name"
            itemProp="name"
            style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              lineHeight: '1.4',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {name}
          </h3>

          <p 
            className="product-description"
            itemProp="description"
            style={{
              color: 'var(--color-text-light)',
              fontSize: '0.875rem',
              marginBottom: '0.75rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {description}
          </p>

          {/* Rating */}
          <div 
            className="product-rating"
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '0.75rem',
            }}
            itemProp="aggregateRating"
            itemScope
            itemType="https://schema.org/AggregateRating"
          >
            <div className="stars" style={{ display: 'flex', marginRight: '0.5rem' }}>
              {stars.map((filled, i) => (
                <span
                  key={i}
                  style={{
                    color: filled ? '#fbbf24' : '#d1d5db',
                    fontSize: '1rem',
                  }}
                >
                  ★
                </span>
              ))}
            </div>
            <span 
              className="rating-text"
              style={{ 
                fontSize: '0.875rem',
                color: 'var(--color-text-light)',
              }}
            >
              <span itemProp="ratingValue">{rating.toFixed(1)}</span> 
              (<span itemProp="reviewCount">{reviewCount}</span> reviews)
            </span>
          </div>

          {/* Price */}
          <div 
            className="product-price"
            itemProp="offers"
            itemScope
            itemType="https://schema.org/Offer"
            style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: 'var(--color-primary)',
            }}
          >
            <span itemProp="price" content={price.toString()}>{formattedPrice}</span>
            <meta itemProp="priceCurrency" content="USD" />
            <meta itemProp="availability" content={inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"} />
          </div>
        </div>
      </Link>
    </article>
  )
})

ProductCard.displayName = 'ProductCard'

export default ProductCard