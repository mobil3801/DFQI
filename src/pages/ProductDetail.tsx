import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
// Performance issue: Importing entire moment library
import moment from 'moment'

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  const { data: product, isLoading, error } = useQuery(
    ['product', id],
    async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      return {
        id: parseInt(id!),
        name: `Product ${id}`,
        price: Math.random() * 1000,
        category: 'Electronics',
        rating: Math.random() * 5,
        image: `https://picsum.photos/600/400?random=${id}`,
        description: `This is a detailed description for product ${id} that contains a lot of text to simulate real product descriptions.`
      }
    }
  )

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading product</div>
  if (!product) return <div>Product not found</div>

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        <div>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: '100%', borderRadius: '8px' }}
          />
        </div>
        
        <div>
          <h1 style={{ margin: '0 0 16px 0' }}>{product.name}</h1>
          <p style={{ color: '#666', marginBottom: '16px' }}>{product.description}</p>
          
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#2ed573' }}>
              ${product.price.toFixed(2)}
            </span>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <span>Rating: {product.rating.toFixed(1)}/5</span>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <span>Category: {product.category}</span>
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <span>Added: {moment().format('MMMM Do YYYY')}</span>
          </div>
          
          <button style={{
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer'
          }}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail