'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from '../styles/Register.module.css'

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
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
    setSuccess('')
    setLoading(true)

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess('Account created successfully! Redirecting to login...')
        setTimeout(() => {
          router.push('/')
        }, 2000)
      } else {
        setError(data.message || 'Registration failed')
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
        <div className={styles.header}>
          <h1 className={styles.title}>Sign Up</h1>
          <p className={styles.subtitle}>It's quick and easy.</p>
        </div>
        
        <div className={styles.formCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className="error">{error}</div>}
            
            {success && <div className="success">{success}</div>}
            
            
            <div className={styles.nameRow}>
              <div className="form-group">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="First name"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Last name"
                  required
                />
              </div>
            </div>
            
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
                placeholder="New password"
                required
              />
            </div>
            
            <div className="form-group">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-input"
                placeholder="Confirm password"
                required
              />
            </div>
            
            <button 
              type="submit" 
              className={`btn btn-secondary ${styles.signUpBtn}`}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
            
            <div className={styles.loginLink}>
              <button 
                type="button"
                onClick={() => router.push('/')}
                className={styles.backToLogin}
              >
                Already have an account?
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}