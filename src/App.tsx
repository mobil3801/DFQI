import React, { useState, useEffect, useMemo } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
// Performance fix: Import only what we need
import { shuffle } from 'lodash'
import { format } from 'moment'
import ProductList from './pages/ProductList'
import ProductDetail from './pages/ProductDetail'
import Auth from './components/Auth'
import Header from './components/Header'
import Footer from './components/Footer'
import { useAuth } from './lib/useSupabase'
import './App.css'

// Performance fix: Create query client once
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
})

function App() {
  const [theme, setTheme] = useState('light')
  const { data: user, isLoading: authLoading } = useAuth()
  
  // Performance fix: Memoize expensive operations
  const expensiveData = useMemo(() => {
    const data = Array.from({ length: 10000 }, (_, i) => i)
    return shuffle(data).slice(0, 100)
  }, [])

  // Performance fix: Memoize styles
  const appStyle = useMemo(() => ({
    backgroundColor: theme === 'light' ? '#ffffff' : '#1a1a1a',
    color: theme === 'light' ? '#000000' : '#ffffff',
    minHeight: '100vh',
    transition: 'all 0.3s ease'
  }), [theme])

  if (authLoading) {
    return (
      <div style={appStyle}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div>Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div style={appStyle}>
          <Header theme={theme} setTheme={setTheme} user={user} />
          <main>
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/auth" element={<Auth />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App