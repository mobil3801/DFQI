import React, { useState, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useIntersectionObserver } from '../../hooks/optimized/useIntersectionObserver'
import { formatPrice, formatRating } from '../../utils/optimized/formatters'

interface Product {
  id: number
  name: string
  price: number
  category: string
  rating: number
  image: string
  description: string
}

interface ProductCardProps {
  product: Product
}

// Performance optimization: Move static styles outside component
const CARD_STYLES = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '16px',
  margin: '8px',
  transition: 'all 0.3s ease',
}

const IMAGE_STYLES = {
  width: '100%',
  height: '200px',
  objectFit: 'cover' as const,
  borderRadius: '4px',
  transition: 'opacity 0.3s ease',
}

const BADGE_STYLES = {
  position: 'absolute' as const,
  top: '8px',
  right: '8px',
  backgroundColor: '#ff4757',
  color: 'white',
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: 'bold'
}

// Performance optimization: Memoize component
const ProductCard: React.FC<ProductCardProps> = React.memo(({ product }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Performance optimization: Use intersection observer for lazy loading
  const { elementRef, isIntersecting } = useIntersectionObserver()

  // Performance optimization: Memoize expensive calculations
  const formattedPrice = useMemo(() => formatPrice(product.price), [product.price])
  const formattedRating = useMemo(() => formatRating(product.rating), [product.rating])

  // Performance optimization: Memoize styles
  const cardStyle = useMemo(() => ({
    ...CARD_STYLES,
    backgroundColor: isHovered ? '#f5f5f5' : '#ffffff',
    transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
    boxShadow: isHovered ? '0 4px 8px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.05)',
  }), [isHovered])

  const imageStyle = useMemo(() => ({
    ...IMAGE_STYLES,
    opacity: imageLoaded ? 1 : 0,
  }), [imageLoaded])

  // Performance optimization: Memoize event handlers
  const handleMouseEnter = useCallback(() => setIsHovered(true), [])
  const handleMouseLeave = useCallback(() => setIsHovered(false), [])
  const handleImageLoad = useCallback(() => setImageLoaded(true), [])
  const handleImageError = useCallback(() => setImageError(true), [])

  // Performance optimization: Memoize star rendering
  const stars = useMemo(() => {
    const starArray = []
    for (let i = 1; i <= 5; i++) {
      starArray.push(
        <span key={i} style={{ color: i <= product.rating ? '#ffd700' : '#ddd' }}>
          ★
        </span>
      )
    }
    return starArray
  }, [product.rating])

  return (
    <div 
      ref={elementRef}
      style={cardStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ position: 'relative' }}>
          {!imageError && isIntersecting ? (
            <img
              src={product.image}
              alt={product.name}
              style={imageStyle}
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
            />
          ) : (
            <div style={{ 
              width: '100%', 
              height: '200px', 
              backgroundColor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px'
            }}>
              {imageError ? 'Image not available' : 'Loading...'}
            </div>
          )}
          
          <div style={BADGE_STYLES}>
            {product.category}
          </div>
        </div>

        <div style={{ marginTop: '12px' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>
            {product.name}
          </h3>
          
          <p style={{ 
            margin: '0 0 8px 0', 
            fontSize: '14px', 
            color: '#666',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical' as const,
            overflow: 'hidden'
          }}>
            {product.description}
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#2ed573' }}>
              {formattedPrice}
            </span>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {stars}
              <span style={{ marginLeft: '4px', fontSize: '12px', color: '#666' }}>
                ({formattedRating})
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
})

ProductCard.displayName = 'ProductCard'

export default ProductCard