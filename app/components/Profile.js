'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import Navbar from './Navbar'
import styles from '../styles/Profile.module.css'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchUserData()
    
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setDarkMode(true)
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  }, [])

  const fetchUserData = async () => {
    try {
      const token = Cookies.get('token')
      if (!token) {
        router.push('/')
        return
      }

      const res = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (res.ok) {
        const userData = await res.json()
        setUser(userData.user)
      } else {
        router.push('/')
      }
    } catch (error) {
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    
    if (newDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
      localStorage.setItem('theme', 'light')
    }
  }

  const handleLogout = () => {
    Cookies.remove('token')
    router.push('/')
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className={styles.profilePage}>
      <Navbar 
        user={user}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onLogout={handleLogout}
      />
      
      <div className={styles.profileContent}>
        <div className={styles.coverPhoto}>
          <div className={styles.coverGradient}></div>
        </div>
        
        <div className={styles.profileHeader}>
          <div className={styles.profileAvatar}>
            <div className={styles.avatar}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
          
          <div className={styles.profileInfo}>
            <h1 className={styles.profileName}>{user?.name}</h1>
            <p className={styles.profileEmail}>{user?.email}</p>
            <p className={styles.profileJoined}>
              Joined {new Date(user?.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long'
              })}
            </p>
          </div>
          
          <div className={styles.profileActions}>
            <button className="btn btn-primary">Edit Profile</button>
            <button className="btn btn-outline">Settings</button>
          </div>
        </div>
        
        <div className={styles.profileTabs}>
          <button className={`${styles.tab} ${styles.activeTab}`}>Posts</button>
          <button className={styles.tab}>About</button>
          <button className={styles.tab}>Friends</button>
          <button className={styles.tab}>Photos</button>
        </div>
        
        <div className={styles.profileBody}>
          <div className={styles.profileSidebar}>
            <div className="card" style={{ padding: '20px' }}>
              <h3>About</h3>
              <div className={styles.aboutItem}>
                <span className={styles.aboutIcon}>📧</span>
                <span>{user?.email}</span>
              </div>
              <div className={styles.aboutItem}>
                <span className={styles.aboutIcon}>📅</span>
                <span>Joined {new Date(user?.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <div className={styles.profileMain}>
            <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
              <h3>Your Posts</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>
                Your posts will appear here
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}