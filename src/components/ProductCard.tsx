import React, { useState } from 'react'
import { Link } from 'react-router-dom'
// Performance issue: Importing entire moment library
import moment from 'moment'

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

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Performance issue: Expensive calculation on every render
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price)

  // Performance issue: Expensive date formatting on every render
  const formattedDate = moment().format('MMMM Do YYYY, h:mm:ss a')

  // Performance issue: Inline styles creating new objects on every render
  const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    margin: '8px',
    backgroundColor: isHovered ? '#f5f5f5' : '#ffffff',
    transition: 'all 0.3s ease',
    transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
    boxShadow: isHovered ? '0 4px 8px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.05)',
  }

  const imageStyle = {
    width: '100%',
    height: '200px',
    objectFit: 'cover' as const,
    borderRadius: '4px',
    opacity: imageLoaded ? 1 : 0,
    transition: 'opacity 0.3s ease',
  }

  // Performance issue: Inline event handlers
  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => setIsHovered(false)
  const handleImageLoad = () => setImageLoaded(true)
  const handleImageError = () => setImageError(true)

  // Performance issue: Inline JSX calculations
  const renderStars = () => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= product.rating ? '#ffd700' : '#ddd' }}>
          ★
        </span>
      )
    }
    return stars
  }

  return (
    <div 
      style={cardStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ position: 'relative' }}>
          {!imageError ? (
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
              Image not available
            </div>
          )}
          
          {/* Performance issue: Inline badge component */}
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            backgroundColor: '#ff4757',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
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
              {renderStars()}
              <span style={{ marginLeft: '4px', fontSize: '12px', color: '#666' }}>
                ({product.rating.toFixed(1)})
              </span>
            </div>
          </div>

          {/* Performance issue: Unnecessary date display */}
          <div style={{ fontSize: '10px', color: '#999' }}>
            Added: {formattedDate}
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ProductCard