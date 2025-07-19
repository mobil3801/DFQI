import React, { useState } from 'react'
import { useSignIn, useSignUp, useSignOut, useAuth } from '../lib/useSupabase'

const Auth: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const { data: user } = useAuth()
  const signInMutation = useSignIn()
  const signUpMutation = useSignUp()
  const signOutMutation = useSignOut()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    try {
      if (isSignUp) {
        await signUpMutation.mutateAsync({ email, password })
        setMessage('Check your email for the confirmation link!')
      } else {
        await signInMutation.mutateAsync({ email, password })
        setMessage('Signed in successfully!')
      }
    } catch (error: any) {
      setMessage(error.message || 'An error occurred')
    }
  }

  const handleSignOut = async () => {
    try {
      await signOutMutation.mutateAsync()
      setMessage('Signed out successfully!')
    } catch (error: any) {
      setMessage(error.message || 'An error occurred')
    }
  }

  if (user) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Welcome, {user.email}!</h2>
          <p>You are signed in.</p>
          <button 
            onClick={handleSignOut}
            disabled={signOutMutation.isLoading}
            className="auth-button"
          >
            {signOutMutation.isLoading ? 'Signing out...' : 'Sign Out'}
          </button>
          {message && <p className="auth-message">{message}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
            />
          </div>
          <div className="auth-field">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="auth-input"
            />
          </div>
          <button 
            type="submit"
            disabled={signInMutation.isLoading || signUpMutation.isLoading}
            className="auth-button"
          >
            {signInMutation.isLoading || signUpMutation.isLoading
              ? (isSignUp ? 'Signing up...' : 'Signing in...')
              : (isSignUp ? 'Sign Up' : 'Sign In')
            }
          </button>
        </form>
        <button 
          onClick={() => setIsSignUp(!isSignUp)}
          className="auth-toggle"
        >
          {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
        </button>
        {message && <p className="auth-message">{message}</p>}
      </div>
    </div>
  )
}

export default Auth