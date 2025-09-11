'use client'

import { useState } from 'react'
import Cookies from 'js-cookie'
import styles from '../styles/PostCard.module.css'

export default function PostCard({ post, currentUser, onDelete, onLike, onComment }) {
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLike = async () => {
    try {
      const token = Cookies.get('token')
      const res = await fetch(`/api/posts/${post._id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (res.ok) {
        onLike()
      }
    } catch (error) {
      console.error('Failed to like post:', error)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const token = Cookies.get('token')
      const res = await fetch(`/api/posts/${post._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (res.ok) {
        onDelete()
      }
    } catch (error) {
      console.error('Failed to delete post:', error)
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return

    setLoading(true)
    try {
      const token = Cookies.get('token')
      const res = await fetch(`/api/posts/${post._id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: commentText })
      })

      if (res.ok) {
        setCommentText('')
        onComment()
      }
    } catch (error) {
      console.error('Failed to add comment:', error)
    } finally {
      setLoading(false)
    }
  }

  const isLiked = post.likes?.includes(currentUser?._id)
  const isOwner = post.author._id === currentUser?._id

  return (
    <div className={`card ${styles.postCard}`}>
      <div className={styles.postHeader}>
        <div className={styles.authorInfo}>
          <div className={styles.avatar}>
            {post.author.name.charAt(0).toUpperCase()}
          </div>
          <div className={styles.authorDetails}>
            <h4 className={styles.authorName}>{post.author.name}</h4>
            <p className={styles.postDate}>
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
        
        {isOwner && (
          <button 
            onClick={handleDelete}
            className={styles.deleteBtn}
            title="Delete post"
          >
            🗑️
          </button>
        )}
      </div>

      <div className={styles.postContent}>
        <p>{post.content}</p>
      </div>

      <div className={styles.postStats}>
        <span className={styles.likesCount}>
          {post.likes?.length || 0} {post.likes?.length === 1 ? 'like' : 'likes'}
        </span>
        <span className={styles.commentsCount}>
          {post.comments?.length || 0} {post.comments?.length === 1 ? 'comment' : 'comments'}
        </span>
      </div>

      <div className={styles.postActions}>
        <button 
          onClick={handleLike}
          className={`${styles.actionBtn} ${isLiked ? styles.liked : ''}`}
        >
          {isLiked ? '❤️' : '🤍'} Like
        </button>
        
        <button 
          onClick={() => setShowComments(!showComments)}
          className={styles.actionBtn}
        >
          💬 Comment
        </button>
        
        <button className={styles.actionBtn}>
          📤 Share
        </button>
      </div>

      {showComments && (
        <div className={styles.commentsSection}>
          <form onSubmit={handleComment} className={styles.commentForm}>
            <div className={styles.avatar}>
              {currentUser?.name?.charAt(0).toUpperCase()}
            </div>
            <div className={styles.commentInputContainer}>
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className={styles.commentInput}
              />
              <button 
                type="submit" 
                className={styles.commentSubmit}
                disabled={loading || !commentText.trim()}
              >
                {loading ? '...' : '➤'}
              </button>
            </div>
          </form>

          <div className={styles.comments}>
            {post.comments?.length === 0 ? (
              <p className={styles.noComments}>No comments yet</p>
            ) : (
              post.comments?.map((comment, index) => (
                <div key={index} className={styles.comment}>
                  <div className={styles.avatar}>
                    {comment.author.name.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.commentContent}>
                    <div className={styles.commentBubble}>
                      <h5 className={styles.commentAuthor}>{comment.author.name}</h5>
                      <p>{comment.content}</p>
                    </div>
                    <div className={styles.commentActions}>
                      <button className={styles.commentAction}>Like</button>
                      <button className={styles.commentAction}>Reply</button>
                      <span className={styles.commentTime}>
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}