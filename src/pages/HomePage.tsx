import React, { memo, useEffect } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { productApi, categoryApi, prefetchData } from '@/utils/api'
import ProductCard from '@/components/ProductCard'
import LazyImage from '@/components/LazyImage'
import LoadingSpinner from '@/components/LoadingSpinner'

/**
 * Home page with featured products and categories
 * Implements prefetching and performance optimizations
 */
const HomePage = memo(() => {
  // Prefetch data for better performance
  useEffect(() => {
    // Prefetch products and categories for faster navigation
    prefetchData.products()
    prefetchData.categories()
  }, [])

  // Fetch featured products
  const { data: featuredProducts = [], isLoading: productsLoading } = useQuery(
    ['products', { featured: true }],
    () => productApi.getProducts({ sortBy: 'rating', sortOrder: 'desc' }, 1, 8),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      select: (data) => data.data, // Extract just the products array
    }
  )

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery(
    'categories',
    categoryApi.getCategories,
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  )

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section
        className="hero"
        style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
          color: 'white',
          padding: '4rem 0',
          textAlign: 'center',
        }}
      >
        <div className="container">
          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: '700',
              marginBottom: '1rem',
              lineHeight: '1.2',
            }}
          >
            Welcome to ProductPortal
          </h1>
          <p
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
              marginBottom: '2rem',
              opacity: 0.9,
              maxWidth: '600px',
              margin: '0 auto 2rem',
            }}
          >
            Discover amazing products with lightning-fast performance and seamless browsing experience
          </p>
          <Link
            to="/products"
            className="btn"
            style={{
              backgroundColor: 'white',
              color: 'var(--color-primary)',
              padding: '1rem 2rem',
              fontSize: '1.125rem',
              fontWeight: '600',
              textDecoration: 'none',
              borderRadius: 'var(--border-radius)',
              display: 'inline-block',
              transition: 'var(--transition)',
            }}
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section" style={{ padding: '4rem 0' }}>
        <div className="container">
          <h2
            style={{
              fontSize: '2rem',
              fontWeight: '600',
              textAlign: 'center',
              marginBottom: '3rem',
              color: 'var(--color-text)',
            }}
          >
            Shop by Category
          </h2>

          {categoriesLoading ? (
            <LoadingSpinner message="Loading categories..." />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {categories.slice(0, 8).map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.slug}`}
                  className="category-card card"
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    textAlign: 'center',
                    padding: '1.5rem',
                    transition: 'var(--transition)',
                  }}
                >
                  {category.imageUrl && (
                    <LazyImage
                      src={category.imageUrl}
                      alt={category.name}
                      width={100}
                      height={100}
                      className="category-image"
                      style={{
                        borderRadius: '50%',
                        margin: '0 auto 1rem',
                        objectFit: 'cover',
                      }}
                    />
                  )}
                  <h3
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {category.name}
                  </h3>
                  <p
                    style={{
                      color: 'var(--color-text-light)',
                      fontSize: '0.875rem',
                    }}
                  >
                    {category.productCount} products
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section
        className="featured-products-section"
        style={{
          padding: '4rem 0',
          backgroundColor: 'var(--color-bg)',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '3rem',
            }}
          >
            <h2
              style={{
                fontSize: '2rem',
                fontWeight: '600',
                color: 'var(--color-text)',
              }}
            >
              Featured Products
            </h2>
            <Link
              to="/products"
              style={{
                color: 'var(--color-primary)',
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '1.125rem',
                transition: 'var(--transition)',
              }}
            >
              View All →
            </Link>
          </div>

          {productsLoading ? (
            <LoadingSpinner message="Loading featured products..." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featuredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={index < 4} // Priority loading for first 4 products
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Performance Stats Section */}
      <section
        className="stats-section"
        style={{
          padding: '4rem 0',
          backgroundColor: 'var(--color-bg-light)',
        }}
      >
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 text-center">
            <div className="stat-item" style={{ padding: '2rem' }}>
              <div
                style={{
                  fontSize: '3rem',
                  fontWeight: '700',
                  color: 'var(--color-primary)',
                  marginBottom: '1rem',
                }}
              >
                99%
              </div>
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                }}
              >
                Uptime
              </h3>
              <p style={{ color: 'var(--color-text-light)' }}>
                Reliable service you can count on
              </p>
            </div>

            <div className="stat-item" style={{ padding: '2rem' }}>
              <div
                style={{
                  fontSize: '3rem',
                  fontWeight: '700',
                  color: 'var(--color-primary)',
                  marginBottom: '1rem',
                }}
              >
                &lt;1s
              </div>
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                }}
              >
                Load Time
              </h3>
              <p style={{ color: 'var(--color-text-light)' }}>
                Lightning-fast performance optimized
              </p>
            </div>

            <div className="stat-item" style={{ padding: '2rem' }}>
              <div
                style={{
                  fontSize: '3rem',
                  fontWeight: '700',
                  color: 'var(--color-primary)',
                  marginBottom: '1rem',
                }}
              >
                10k+
              </div>
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                }}
              >
                Products
              </h3>
              <p style={{ color: 'var(--color-text-light)' }}>
                Vast selection with smart filtering
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
})

HomePage.displayName = 'HomePage'

export default HomePage