'use client';
import React, { useState } from 'react';
import styles from './register.module.css';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    name: '',
    avatar: '' // optional
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,  // ✅ send username
          name: formData.name,
          password: formData.password,
          avatar: formData.avatar || '',
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Registration failed');
      } else {
        // Save token
        localStorage.setItem('token', data.token);

        // Redirect to dashboard
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerSection}>
      <div className={styles.registerContainer}>
        <h1 className={styles.heading}>GirlHype</h1>
        <form onSubmit={handleSubmit}>
          
          {/* Email */}
          <div className={styles.formGroup}>
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Username */}
          <div className={styles.formGroup}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Choose a username"
              required
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Create a password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Full Name */}
          <div className={styles.formGroup}>
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              placeholder="Your full name"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className={styles.loginLink}>
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
}
