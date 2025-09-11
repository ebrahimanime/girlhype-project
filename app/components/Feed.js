'use client'

import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import PostCard from './PostCard'
import CreatePost from './CreatePost'
import styles from '../styles/Feed.module.css'

export default function Feed({ user }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const token = Cookies.get('token')
      const res = await fetch('/api/posts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (res.ok) {
        const data = await res.json()
        setPosts(data.posts)
      } else {
        setError('Failed to fetch posts')
      }
    } catch (error) {
      setError('Failed to fetch posts')
    } finally {
      setLoading(false)
    }
  }

  const handlePostCreated = () => {
    fetchPosts()
  }

  const handlePostDeleted = () => {
    fetchPosts()
  }

  const handlePostLiked = () => {
    fetchPosts()
  }

  const handleCommentAdded = () => {
    fetchPosts()
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading posts...</p>
      </div>
    )
  }

  return (
    <div className={styles.feed}>
      <CreatePost user={user} onPostCreated={handlePostCreated} />
      
      {error && <div className="error">{error}</div>}
      
      
      <div className={styles.posts}>
        {posts.length === 0 ? (
          <div className={styles.noPosts}>
            <h3>No posts yet</h3>
            <p>Be the first to share something!</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              currentUser={user}
              onDelete={handlePostDeleted}
              onLike={handlePostLiked}
              onComment={handleCommentAdded}
            />
          ))
        )}
      </div>
    </div>
  )
}