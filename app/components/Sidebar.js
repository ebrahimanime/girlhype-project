'use client'

import { useRouter } from 'next/navigation'
import styles from '../styles/Sidebar.module.css'

export default function Sidebar({ collapsed, user }) {
  const router = useRouter()

  const menuItems = [
    { icon: '🏠', label: 'Home', path: '/dashboard' },
    { icon: '👤', label: 'Profile', path: '/profile' },
    { icon: '👥', label: 'Friends', path: '/friends' },
    { icon: '📱', label: 'Pages', path: '/pages' },
    { icon: '👥', label: 'Groups', path: '/groups' },
    
    { icon: '📺', label: 'Watch', path: '/watch' },
    { icon: '📅', label: 'Events', path: '/events' },
    { icon: '💾', label: 'Saved', path: '/saved' },
  ]

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.sidebarContent}>
        
        {/* User Info */}
        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div className={styles.userDetails}>
                <h3>{user?.name}</h3>
                <p>{user?.email}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className={styles.navigation}>
          {menuItems.map((item, index) => (
            <button
              key={index}
              className={styles.navItem}
              onClick={() => router.push(item.path)}
              title={collapsed ? item.label : ''}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {!collapsed && <span className={styles.navLabel}>{item.label}</span>}
            </button>
          ))}
        </nav>

       
        
      </div>
    </aside>
  )
}
