'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Feed from './Feed'
import styles from '../styles/Dashboard.module.css'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchUserData()
    
    // Check for saved theme preference
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

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
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
    <div className={styles.dashboard}>
      <Navbar 
        user={user}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onToggleSidebar={toggleSidebar}
        onLogout={handleLogout}
      />
      
      <div className={styles.content}>
        <Sidebar 
          collapsed={sidebarCollapsed}
          user={user}
        />
        
        <main className={`${styles.main} ${sidebarCollapsed ? styles.mainExpanded : ''}`}>
          <Feed user={user} />
        </main>
      </div>
    </div>
  )
}