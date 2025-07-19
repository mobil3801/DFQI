import React, { memo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { productApi, categoryApi } from '@/utils/api'
import ProductCard from '@/components/ProductCard'
import LoadingSpinner from '@/components/LoadingSpinner'

/**
 * Category page displaying products filtered by category
 */
const CategoryPage = memo(() => {
  const { slug } = useParams<{ slug: string }>()

  // Fetch category details
  const { data: category, isLoading: categoryLoading } = useQuery(
    ['category', slug],
    () => categoryApi.getCategory(slug!),
    {
      enabled: !!slug,
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  )

  // Fetch products in category
  const { data: productsData, isLoading: productsLoading } = useQuery(
    ['products', { category: slug }],
    () => productApi.getProducts({ category: slug }, 1, 20),
    {
      enabled: !!slug,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  )

  const isLoading = categoryLoading || productsLoading
  const products = productsData?.data || []

  if (isLoading) {
    return <LoadingSpinner message="Loading category..." />
  }

  if (!category) {
    return (
      <div className="error-state" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>Category not found</h2>
        <p>The category you are looking for does not exist.</p>
        <Link to="/products" className="btn" style={{ marginTop: '1rem' }}>
          Browse All Products
        </Link>
      </div>
    )
  }

  return (
    <div className="category-page" style={{ padding: '2rem 0' }}>
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
          <span style={{ color: 'var(--color-text)' }}>{category.name}</span>
        </nav>

        {/* Category Header */}
        <div
          className="category-header"
          style={{
            textAlign: 'center',
            marginBottom: '3rem',
            padding: '2rem',
            backgroundColor: 'var(--color-bg)',
            borderRadius: 'var(--border-radius)',
            boxShadow: 'var(--box-shadow)',
          }}
        >
          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: '600',
              marginBottom: '1rem',
              color: 'var(--color-text)',
            }}
          >
            {category.name}
          </h1>
          
          {category.description && (
            <p
              style={{
                fontSize: '1.125rem',
                color: 'var(--color-text-light)',
                marginBottom: '1rem',
                maxWidth: '600px',
                margin: '0 auto 1rem',
              }}
            >
              {category.description}
            </p>
          )}
          
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              borderRadius: 'var(--border-radius)',
              fontSize: '0.875rem',
              fontWeight: '600',
            }}
          >
            {category.productCount} Products Available
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
              }}
            >
              <h2
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: 'var(--color-text)',
                }}
              >
                Products in {category.name}
              </h2>
              
              <span style={{ color: 'var(--color-text-light)' }}>
                Showing {products.length} of {category.productCount} products
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={index < 8} // Priority loading for first 8 products
                />
              ))}
            </div>

            {/* Load More Button */}
            {productsData && productsData.hasNextPage && (
              <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <Link
                  to={`/products?category=${slug}`}
                  className="btn btn-outline"
                  style={{
                    padding: '1rem 2rem',
                    fontSize: '1.125rem',
                    fontWeight: '600',
                  }}
                >
                  View All Products in {category.name}
                </Link>
              </div>
            )}
          </>
        ) : (
          <div
            className="no-products"
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              color: 'var(--color-text-light)',
            }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              No products in this category
            </h3>
            <p>Check back later for new products or browse other categories.</p>
            <Link
              to="/products"
              className="btn"
              style={{ marginTop: '2rem' }}
            >
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  )
})

CategoryPage.displayName = 'CategoryPage'

export default CategoryPage