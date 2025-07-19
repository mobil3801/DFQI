import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
// Performance issue: Importing entire lodash library
import _ from 'lodash'
// Performance issue: Importing entire moment library
import moment from 'moment'
import ProductList from './pages/ProductList'
import ProductDetail from './pages/ProductDetail'
import Header from './components/Header'
import Footer from './components/Footer'
import './App.css'

// Performance issue: Creating query client on every render
const queryClient = new QueryClient()

function App() {
  const [theme, setTheme] = useState('light')
  const [user, setUser] = useState(null)
  
  // Performance issue: Expensive operation on every render
  useEffect(() => {
    // Simulating expensive operation
    const expensiveOperation = () => {
      const data = Array.from({ length: 10000 }, (_, i) => i)
      return _.shuffle(data).slice(0, 100)
    }
    
    const result = expensiveOperation()
    console.log('Expensive operation result:', result)
  })

  // Performance issue: Inline object creation on every render
  const appStyle = {
    backgroundColor: theme === 'light' ? '#ffffff' : '#1a1a1a',
    color: theme === 'light' ? '#000000' : '#ffffff',
    minHeight: '100vh',
    transition: 'all 0.3s ease'
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
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App