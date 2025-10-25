'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import Navbar from './Navbar'
import styles from '../styles/EditProfile.module.css'

export default function EditProfile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    username: '',
    phone: ''
  })
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
        setFormData({
          name: userData.user.name || '',
          email: userData.user.email || '',
          bio: userData.user.bio || '',
          location: userData.user.location || '',
          website: userData.user.website || '',
          username: userData.user.username || '',
          phone: userData.user.phone || ''
        })
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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const token = Cookies.get('token')
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        alert('Profile updated successfully!')
        router.push('/profile')
      } else {
        alert('Failed to update profile')
      }
    } catch (error) {
      alert('Error updating profile')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    router.push('/profile')
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
    <div className={styles.editProfilePage}>
      <Navbar
        user={user}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onLogout={handleLogout}
      />
     
      <div className={styles.editProfileContainer}>
        {/* Header */}
        <div className={styles.pageHeader}>
          <div className={styles.headerBackground}>
            <div className={styles.headerOverlay}></div>
          </div>
         
          <div className={styles.headerContent}>
            <div className={styles.headerTop}>
              <button
                className={styles.backButton}
                onClick={() => router.back()}
              >
                <span className={styles.backIcon}>←</span>
                <span className={styles.backText}>Back</span>
              </button>
             
              <div className={styles.headerActions}>
                <button
                  className={styles.cancelBtnHeader}
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  className={styles.saveBtnHeader}
                  onClick={handleSubmit}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className={styles.spinnerSmall}></span>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
           
            <div className={styles.headerMain}>
              <div className={styles.headerAvatar}>
                <div className={styles.avatarHeader}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className={styles.avatarBadge}>
                  <span className={styles.badgeIcon}>✎</span>
                </div>
              </div>
             
              <div className={styles.headerText}>
                <h1 className={styles.pageTitle}>Edit Profile</h1>
                <p className={styles.pageSubtitle}>
                  Manage your personal information and preferences
                </p>
                <div className={styles.profileStats}>
                  <span className={styles.statItem}>
                    <strong>Member since</strong> {new Date(user?.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.editProfileContent}>
          {/* Sidebar Navigation */}
          <div className={styles.sidebar}>
            <div className={styles.profileCard}>
              <div className={styles.avatarSection}>
                <div className={styles.avatarLarge}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className={styles.avatarActions}>
                  <button className={styles.changePhotoBtn}>
                    Change Photo
                  </button>
                  <button className={styles.removePhotoBtn}>
                    Remove
                  </button>
                </div>
              </div>
             
              <div className={styles.userInfo}>
                <h3>{user?.name}</h3>
                <p>{user?.email}</p>
              </div>
            </div>

            <nav className={styles.sidebarNav}>
              <button
                className={`${styles.navItem} ${activeTab === 'basic' ? styles.navItemActive : ''}`}
                onClick={() => setActiveTab('basic')}
              >
                <span className={styles.navIcon}>👤</span>
                Basic Info
              </button>
              <button
                className={`${styles.navItem} ${activeTab === 'social' ? styles.navItemActive : ''}`}
                onClick={() => setActiveTab('social')}
              >
                <span className={styles.navIcon}>🌐</span>
                Social Links
              </button>
              <button
                className={`${styles.navItem} ${activeTab === 'privacy' ? styles.navItemActive : ''}`}
                onClick={() => setActiveTab('privacy')}
              >
                <span className={styles.navIcon}>🔒</span>
                Privacy
              </button>
              <button
                className={`${styles.navItem} ${activeTab === 'preferences' ? styles.navItemActive : ''}`}
                onClick={() => setActiveTab('preferences')}
              >
                <span className={styles.navIcon}>⚙️</span>
                Preferences
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className={styles.mainContent}>
            <form className={styles.editForm} onSubmit={handleSubmit}>
              {/* Basic Information Tab */}
              {activeTab === 'basic' && (
                <div className={styles.tabContent}>
                  <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Basic Information</h2>
                    <p className={styles.sectionDescription}>
                      Update your basic profile information
                    </p>
                   
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={styles.formInput}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Username *</label>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          className={styles.formInput}
                          placeholder="Choose a username"
                          required
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={styles.formInput}
                          placeholder="Enter your email"
                          required
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={styles.formInput}
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>
                  </div>

                  <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>About Me</h2>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Bio</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        className={styles.formTextarea}
                        placeholder="Tell people about yourself..."
                        rows="4"
                        maxLength="150"
                      />
                      <div className={styles.textareaFooter}>
                        <span className={styles.charCount}>
                          {formData.bio.length}/150 characters
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Social Links Tab */}
              {activeTab === 'social' && (
                <div className={styles.tabContent}>
                  <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Social Links</h2>
                    <p className={styles.sectionDescription}>
                      Add your social media profiles and website
                    </p>
                   
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Website</label>
                        <div className={styles.inputWithIcon}>
                          <span className={styles.inputIcon}>🌐</span>
                          <input
                            type="url"
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
                            className={styles.formInput}
                            placeholder="https://yourwebsite.com"
                          />
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Location</label>
                        <div className={styles.inputWithIcon}>
                          <span className={styles.inputIcon}>📍</span>
                          <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className={styles.formInput}
                            placeholder="Your city and country"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div className={styles.tabContent}>
                  <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Privacy Settings</h2>
                    <p className={styles.sectionDescription}>
                      Control who can see your information
                    </p>
                   
                    <div className={styles.privacyOptions}>
                      <div className={styles.privacyOption}>
                        <div className={styles.optionInfo}>
                          <h4>Profile Visibility</h4>
                          <p>Choose who can see your profile page</p>
                        </div>
                        <select className={styles.privacySelect}>
                          <option value="public">Public - Anyone can see</option>
                          <option value="friends">Friends Only</option>
                          <option value="private">Private - Only Me</option>
                        </select>
                      </div>

                      <div className={styles.privacyOption}>
                        <div className={styles.optionInfo}>
                          <h4>Email Visibility</h4>
                          <p>Choose who can see your email address</p>
                        </div>
                        <select className={styles.privacySelect}>
                          <option value="private">Private - Only Me</option>
                          <option value="friends">Friends Only</option>
                          <option value="public">Public - Anyone can see</option>
                        </select>
                      </div>

                      <div className={styles.privacyOption}>
                        <div className={styles.optionInfo}>
                          <h4>Activity Status</h4>
                          <p>Show when you're active on the platform</p>
                        </div>
                        <label className={styles.toggle}>
                          <input type="checkbox" defaultChecked />
                          <span className={styles.toggleSlider}></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className={styles.tabContent}>
                  <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Preferences</h2>
                    <p className={styles.sectionDescription}>
                      Customize your experience
                    </p>
                   
                    <div className={styles.privacyOptions}>
                      <div className={styles.privacyOption}>
                        <div className={styles.optionInfo}>
                          <h4>Email Notifications</h4>
                          <p>Receive email updates about your account</p>
                        </div>
                        <label className={styles.toggle}>
                          <input type="checkbox" defaultChecked />
                          <span className={styles.toggleSlider}></span>
                        </label>
                      </div>

                      <div className={styles.privacyOption}>
                        <div className={styles.optionInfo}>
                          <h4>Push Notifications</h4>
                          <p>Get notified about new messages and updates</p>
                        </div>
                        <label className={styles.toggle}>
                          <input type="checkbox" defaultChecked />
                          <span className={styles.toggleSlider}></span>
                        </label>
                      </div>

                      {/* <div className={styles.privacyOption}>
                        <div className={styles.optionInfo}>
                          <h4>Dark Mode</h4>
                          <p>Use dark theme across the application</p>
                        </div>
                        <label className={styles.toggle}>
                          <input
                            type="checkbox"
                            checked={darkMode}
                            onChange={toggleDarkMode}
                          />
                          <span className={styles.toggleSlider}></span>
                        </label>
                      </div> */}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.saveBtn}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className={styles.spinnerSmall}></span>
                      Saving Changes...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
