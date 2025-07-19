import React, { useState, useCallback, useMemo, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
// Performance optimization: Import specific functions instead of entire libraries
import shuffle from 'lodash/shuffle'
import { format } from 'date-fns'
import Header from '../components/optimized/Header'
import Footer from '../components/optimized/Footer'
import LoadingSpinner from '../components/optimized/LoadingSpinner'
import '../App.css'

// Performance optimization: Lazy load pages
const ProductList = lazy(() => import('../pages/optimized/ProductList'))
const ProductDetail = lazy(() => import('../pages/optimized/ProductDetail'))

// Performance optimization: Create query client outside component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// Performance optimization: Move styles outside component
const getAppStyles = (theme: string) => ({
  backgroundColor: theme === 'light' ? '#ffffff' : '#1a1a1a',
  color: theme === 'light' ? '#000000' : '#ffffff',
  minHeight: '100vh',
  transition: 'all 0.3s ease'
})

function App() {
  const [theme, setTheme] = useState('light')
  const [user, setUser] = useState(null)
  
  // Performance optimization: Memoize expensive operations
  const expensiveOperationResult = useMemo(() => {
    const data = Array.from({ length: 10000 }, (_, i) => i)
    return shuffle(data).slice(0, 100)
  }, []) // Only run once on mount

  // Performance optimization: Memoize styles
  const appStyle = useMemo(() => getAppStyles(theme), [theme])

  // Performance optimization: Memoize event handlers
  const handleThemeToggle = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div style={appStyle}>
          <Header 
            theme={theme} 
            onThemeToggle={handleThemeToggle} 
            user={user} 
          />
          <main>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<ProductList />} />
                <Route path="/product/:id" element={<ProductDetail />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App