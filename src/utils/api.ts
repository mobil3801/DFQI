import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { Product, Category, ProductFilters, PaginatedResponse } from '@/types'

// Create axios instance with optimized defaults
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request/Response interceptors for performance monitoring
api.interceptors.request.use(
  (config) => {
    // Add timestamp for request timing
    config.metadata = { startTime: Date.now() }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response time for monitoring
    const endTime = Date.now()
    const duration = endTime - response.config.metadata?.startTime
    if (duration > 1000) {
      console.warn(`Slow API request: ${response.config.url} took ${duration}ms`)
    }
    return response
  },
  (error) => {
    // Enhanced error handling
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data)
    }
    return Promise.reject(error)
  }
)

// Request deduplication cache
const requestCache = new Map<string, Promise<any>>()

// Generic request function with caching
async function cachedRequest<T>(
  key: string,
  requestFn: () => Promise<AxiosResponse<T>>,
  cacheDuration = 5000
): Promise<T> {
  // Check if request is already in progress
  if (requestCache.has(key)) {
    return requestCache.get(key)!
  }

  // Create new request
  const requestPromise = requestFn()
    .then((response) => response.data)
    .finally(() => {
      // Remove from cache after completion
      setTimeout(() => {
        requestCache.delete(key)
      }, cacheDuration)
    })

  // Cache the promise
  requestCache.set(key, requestPromise)
  
  return requestPromise
}

// API functions
export const productApi = {
  // Get paginated products with filters
  getProducts: async (
    filters: ProductFilters = {},
    page = 1,
    limit = 20
  ): Promise<PaginatedResponse<Product>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = value.toString()
        }
        return acc
      }, {} as Record<string, string>)
    })

    const cacheKey = `products-${params.toString()}`
    
    return cachedRequest(
      cacheKey,
      () => api.get<PaginatedResponse<Product>>(`/products?${params}`)
    )
  },

  // Get single product with caching
  getProduct: async (id: string): Promise<Product> => {
    const cacheKey = `product-${id}`
    
    return cachedRequest(
      cacheKey,
      () => api.get<Product>(`/products/${id}`),
      10000 // Cache for 10 seconds
    )
  },

  // Search products with debouncing support
  searchProducts: async (
    query: string,
    limit = 10
  ): Promise<Product[]> => {
    if (!query.trim()) return []
    
    const cacheKey = `search-${query}-${limit}`
    
    return cachedRequest(
      cacheKey,
      () => api.get<Product[]>(`/products/search?q=${encodeURIComponent(query)}&limit=${limit}`),
      2000 // Short cache for search results
    )
  }
}

export const categoryApi = {
  // Get all categories
  getCategories: async (): Promise<Category[]> => {
    const cacheKey = 'categories'
    
    return cachedRequest(
      cacheKey,
      () => api.get<Category[]>('/categories'),
      30000 // Cache categories for 30 seconds
    )
  },

  // Get category by slug
  getCategory: async (slug: string): Promise<Category> => {
    const cacheKey = `category-${slug}`
    
    return cachedRequest(
      cacheKey,
      () => api.get<Category>(`/categories/${slug}`)
    )
  }
}

// Utility function to prefetch data
export const prefetchData = {
  products: (filters: ProductFilters = {}) => {
    productApi.getProducts(filters, 1, 20)
  },
  
  categories: () => {
    categoryApi.getCategories()
  }
}

// Clear cache utility
export const clearApiCache = () => {
  requestCache.clear()
}

export default api