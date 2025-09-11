'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from '../styles/Navbar.module.css'

export default function Navbar({ user, darkMode, onToggleDarkMode, onToggleSidebar, onLogout }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const router = useRouter()

  const handleSearch = (e) => {
    e.preventDefault()
    // Implement search functionality
    console.log('Searching for:', searchQuery)
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContent}>
        <div className={styles.leftSection}>
          <button 
            className={styles.menuToggle}
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          
          <div className={styles.logo} onClick={() => router.push('/dashboard')}>
            <h2>HypeChat</h2>
          </div>
        </div>

        <div className={styles.centerSection}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <div className={styles.searchContainer}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search HypeChat"
                className={styles.searchInput}
              />
              <button type="submit" className={styles.searchButton}>
                🔍
              </button>
            </div>
          </form>
        </div>

        <div className={styles.rightSection}>
          <button 
            className={styles.themeToggle}
            onClick={onToggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          <div className={styles.profileSection}>
            <button 
              className={styles.profileButton}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className={styles.avatar}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className={styles.userName}>{user?.name}</span>
              <span className={styles.dropdownArrow}>▼</span>
            </button>

            {showProfileMenu && (
              <div className={styles.profileMenu}>
                <button 
                  className={styles.menuItem}
                  onClick={() => {
                    router.push('/profile')
                    setShowProfileMenu(false)
                  }}
                >
                  👤 Profile
                </button>
                <button 
                  className={styles.menuItem}
                  onClick={() => {
                    // Settings functionality
                    setShowProfileMenu(false)
                  }}
                >
                  ⚙️ Settings
                </button>
                <hr className={styles.menuDivider} />
                <button 
                  className={styles.menuItem}
                  onClick={() => {
                    onLogout()
                    setShowProfileMenu(false)
                  }}
                >
                  🚪 Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}