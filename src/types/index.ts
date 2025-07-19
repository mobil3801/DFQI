export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  imageUrl: string
  thumbnailUrl?: string
  rating: number
  reviewCount: number
  inStock: boolean
  features: string[]
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  productCount: number
  imageUrl?: string
}

export interface ProductFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  rating?: number
  search?: string
  sortBy?: 'name' | 'price' | 'rating' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface ApiError {
  message: string
  code: string
  status: number
}

export interface LoadingState {
  isLoading: boolean
  error: string | null
}

export interface IntersectionObserverEntry {
  isIntersecting: boolean
  target: Element
}