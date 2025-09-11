'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from '../styles/Landing.module.css'

export default function LandingPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        document.cookie = `token=${data.token}; path=/; max-age=604800; secure; samesite=strict`
        router.push('/dashboard')
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (error) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.leftSide}>
          <div className={styles.logo}>
            <h1>HypeChat</h1>
          </div>
          <p className={styles.tagline}>
            Connect with friends and the world around you on HypeChat.
          </p>
        </div>
        
        <div className={styles.rightSide}>
          <div className={styles.loginCard}>
            <form onSubmit={handleSubmit} className={styles.loginForm}>
              {error && <div className="error">{error}</div>}
              
              
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Email address"
                  required
                />
              </div>
              
              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Password"
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className={`btn btn-primary ${styles.loginBtn}`}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>
              
              <div className={styles.divider}>
                <span>or</span>
              </div>
              
              <button 
                type="button"
                onClick={() => router.push('/register')}
                className={`btn btn-secondary ${styles.registerBtn}`}
              >
                Create New Account
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}