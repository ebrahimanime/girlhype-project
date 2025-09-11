'use client'

import { useState } from 'react'
import Cookies from 'js-cookie'
import styles from '../styles/CreatePost.module.css'

export default function CreatePost({ user, onPostCreated }) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)
    setError('')

    try {
      const token = Cookies.get('token')
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      })

      if (res.ok) {
        setContent('')
        onPostCreated()
      } else {
        const data = await res.json()
        setError(data.message || 'Failed to create post')
      }
    } catch (error) {
      setError('Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`card ${styles.createPost}`}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className={styles.userInfo}>
          <h4>{user?.name}</h4>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className="error">{error}</div>}
        
        
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`What's on your mind, ${user?.name?.split(' ')[0]}?`}
          className={styles.textarea}
          rows={3}
        />

        <div className={styles.actions}>
          <div className={styles.postOptions}>
            <button type="button" className={styles.optionBtn}>
              📷 Photo/Video
            </button>
            <button type="button" className={styles.optionBtn}>
              😊 Feeling/Activity
            </button>
            <button type="button" className={styles.optionBtn}>
              📍 Check In
            </button>
          </div>

          <button 
            type="submit" 
            className={`btn btn-primary ${styles.postBtn}`}
            disabled={loading || !content.trim()}
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  )
}