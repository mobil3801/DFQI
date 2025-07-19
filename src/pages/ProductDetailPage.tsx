import React, { memo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { productApi } from '@/utils/api'
import LazyImage from '@/components/LazyImage'
import ProductCard from '@/components/ProductCard'
import LoadingSpinner from '@/components/LoadingSpinner'

/**
 * Product detail page with optimized loading and related products
 */
const ProductDetailPage = memo(() => {
  const { id } = useParams<{ id: string }>()

  // Fetch product details
  const { data: product, isLoading, isError, error } = useQuery(
    ['product', id],
    () => productApi.getProduct(id!),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  )

  // Fetch related products
  const { data: relatedProducts = [] } = useQuery(
    ['products', { category: product?.category, related: true }],
    () => productApi.getProducts({ category: product?.category }, 1, 4),
    {
      enabled: !!product?.category,
      staleTime: 10 * 60 * 1000, // 10 minutes
      select: (data) => data.data.filter(p => p.id !== product?.id), // Exclude current product
    }
  )

  if (isLoading) {
    return <LoadingSpinner message="Loading product details..." />
  }

  if (isError || !product) {
    return (
      <div className="error-state" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <p>{(error as Error)?.message || 'The product you are looking for does not exist.'}</p>
        <Link to="/products" className="btn" style={{ marginTop: '1rem' }}>
          Back to Products
        </Link>
      </div>
    )
  }

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price)

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.floor(product.rating))

  return (
    <div className="product-detail-page" style={{ padding: '2rem 0' }}>
      <div className="container">
        {/* Breadcrumb */}
        <nav style={{ marginBottom: '2rem' }}>
          <Link to="/" style={{ color: 'var(--color-text-light)', textDecoration: 'none' }}>
            Home
          </Link>
          {' / '}
          <Link to="/products" style={{ color: 'var(--color-text-light)', textDecoration: 'none' }}>
            Products
          </Link>
          {' / '}
          <span style={{ color: 'var(--color-text)' }}>{product.name}</span>
        </nav>

        {/* Product Details */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3rem',
            marginBottom: '4rem',
          }}
          className="product-details"
        >
          {/* Product Image */}
          <div className="product-image-section">
            <LazyImage
              src={product.imageUrl}
              alt={product.name}
              width={600}
              height={400}
              className="main-product-image"
              style={{
                borderRadius: 'var(--border-radius)',
                boxShadow: 'var(--box-shadow)',
              }}
            />
          </div>

          {/* Product Info */}
          <div className="product-info-section">
            <h1
              style={{
                fontSize: '2.5rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: 'var(--color-text)',
                lineHeight: '1.2',
              }}
            >
              {product.name}
            </h1>

            {/* Rating */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1.5rem',
              }}
            >
              <div className="stars" style={{ display: 'flex', marginRight: '0.5rem' }}>
                {stars.map((filled, i) => (
                  <span
                    key={i}
                    style={{
                      color: filled ? '#fbbf24' : '#d1d5db',
                      fontSize: '1.25rem',
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span style={{ color: 'var(--color-text-light)' }}>
                {product.rating.toFixed(1)} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div
              style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: 'var(--color-primary)',
                marginBottom: '1.5rem',
              }}
            >
              {formattedPrice}
            </div>

            {/* Stock Status */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--border-radius)',
                backgroundColor: product.inStock ? 'var(--color-success)' : 'var(--color-error)',
                color: 'white',
                fontWeight: '600',
                marginBottom: '2rem',
              }}
            >
              {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
            </div>

            {/* Description */}
            <div style={{ marginBottom: '2rem' }}>
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginBottom: '1rem',
                }}
              >
                Description
              </h3>
              <p
                style={{
                  color: 'var(--color-text-light)',
                  lineHeight: '1.6',
                }}
              >
                {product.description}
              </p>
            </div>

            {/* Features */}
            {product.features.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    marginBottom: '1rem',
                  }}
                >
                  Features
                </h3>
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                  }}
                >
                  {product.features.map((feature, index) => (
                    <li
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '0.5rem',
                        color: 'var(--color-text-light)',
                      }}
                    >
                      <span
                        style={{
                          color: 'var(--color-success)',
                          marginRight: '0.5rem',
                          fontWeight: '600',
                        }}
                      >
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
              }}
            >
              <button
                className="btn"
                disabled={!product.inStock}
                style={{
                  backgroundColor: product.inStock ? 'var(--color-primary)' : '#ccc',
                  color: 'white',
                  padding: '1rem 2rem',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  cursor: product.inStock ? 'pointer' : 'not-allowed',
                }}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              
              <button
                className="btn btn-outline"
                style={{
                  padding: '1rem 2rem',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                }}
              >
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="related-products">
            <h2
              style={{
                fontSize: '2rem',
                fontWeight: '600',
                marginBottom: '2rem',
                color: 'var(--color-text)',
              }}
            >
              Related Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
})

ProductDetailPage.displayName = 'ProductDetailPage'

export default ProductDetailPage