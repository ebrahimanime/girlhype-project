'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from '../styles/FriendsPage.module.css'

export default function FriendsPage({ user }) {
  const [activeTab, setActiveTab] = useState('all')
  const [friends, setFriends] = useState([])
  const [friendRequests, setFriendRequests] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const router = useRouter()

  // Mock data
  useEffect(() => {
    const mockFriends = [
      {
        id: 1,
        name: 'Alex Johnson',
        username: '@alexj',
        avatar: 'AJ',
        isOnline: true,
        mutualFriends: 15,
        lastActive: '2m ago'
      },
      {
        id: 2,
        name: 'Sarah Miller',
        username: '@sarahm',
        avatar: 'SM',
        isOnline: false,
        mutualFriends: 8,
        lastActive: '1h ago'
      },
      {
        id: 3,
        name: 'Mike Chen',
        username: '@mikec',
        avatar: 'MC',
        isOnline: true,
        mutualFriends: 12,
        lastActive: 'Just now'
      }
    ]

    const mockRequests = [
      {
        id: 4,
        name: 'Emma Wilson',
        username: '@emmaw',
        avatar: 'EW',
        mutualFriends: 3,
        timestamp: '2h ago'
      },
      {
        id: 5,
        name: 'Jordan Taylor',
        username: '@jordant',
        avatar: 'JT',
        mutualFriends: 7,
        timestamp: '1d ago'
      }
    ]

    const mockSuggestions = [
      {
        id: 6,
        name: 'Lisa Park',
        username: '@lisap',
        avatar: 'LP',
        mutualFriends: 4,
        bio: 'Love hiking and photography'
      },
      {
        id: 7,
        name: 'David Kim',
        username: '@davidk',
        avatar: 'DK',
        mutualFriends: 2,
        bio: 'Software developer and gamer'
      }
    ]

    setFriends(mockFriends)
    setFriendRequests(mockRequests)
    setSuggestions(mockSuggestions)
  }, [])

  const handleAcceptRequest = (requestId) => {
    const request = friendRequests.find(req => req.id === requestId)
    if (request) {
      setFriendRequests(prev => prev.filter(req => req.id !== requestId))
      setFriends(prev => [...prev, { ...request, isOnline: false, lastActive: 'Just now' }])
    }
  }

  const handleDeclineRequest = (requestId) => {
    setFriendRequests(prev => prev.filter(req => req.id !== requestId))
  }

  const handleAddFriend = (suggestionId) => {
    const suggestion = suggestions.find(sug => sug.id === suggestionId)
    if (suggestion) {
      setSuggestions(prev => prev.filter(sug => sug.id !== suggestionId))
      // In a real app, you'd send a friend request here
      alert(`Friend request sent to ${suggestion.name}!`)
    }
  }

  const handleRemoveFriend = (friendId) => {
    setFriends(prev => prev.filter(friend => friend.id !== friendId))
  }

  const handleMessageFriend = (friendId) => {
    router.push('/messages')
  }

  return (
    <div className={styles.friendsContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button 
            className={styles.backButton}
            onClick={() => router.back()}
          >
            ←
          </button>
          <div className={styles.headerContent}>
            <h1>Friends</h1>
            <div className={styles.stats}>
              <span>{friends.length} friends</span>
              {friendRequests.length > 0 && (
                <span className={styles.requestsCount}>{friendRequests.length} requests</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'all' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Friends
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'requests' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Requests
          {friendRequests.length > 0 && (
            <span className={styles.badge}>{friendRequests.length}</span>
          )}
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'suggestions' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('suggestions')}
        >
          Suggestions
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {activeTab === 'all' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Your Friends</h2>
              <span className={styles.count}>{friends.length}</span>
            </div>
            <div className={styles.list}>
              {friends.length > 0 ? (
                friends.map(friend => (
                  <div key={friend.id} className={styles.card}>
                    <div className={styles.userInfo}>
                      <div className={styles.avatar}>
                        {friend.avatar}
                        {friend.isOnline && <span className={styles.onlineIndicator}></span>}
                      </div>
                      <div className={styles.userDetails}>
                        <h3 className={styles.name}>{friend.name}</h3>
                        <p className={styles.username}>{friend.username}</p>
                        <div className={styles.meta}>
                          <span className={styles.mutual}>{friend.mutualFriends} mutual friends</span>
                          <span className={styles.status}>
                            {friend.isOnline ? 'Online' : `Last active ${friend.lastActive}`}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.actions}>
                      <button 
                        className={styles.primaryButton}
                        onClick={() => handleMessageFriend(friend.id)}
                      >
                        Message
                      </button>
                      <button 
                        className={styles.secondaryButton}
                        onClick={() => handleRemoveFriend(friend.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <p>No friends yet</p>
                  <button 
                    className={styles.actionButton}
                    onClick={() => setActiveTab('suggestions')}
                  >
                    Find Friends
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Friend Requests</h2>
              <span className={styles.count}>{friendRequests.length}</span>
            </div>
            <div className={styles.list}>
              {friendRequests.length > 0 ? (
                friendRequests.map(request => (
                  <div key={request.id} className={styles.card}>
                    <div className={styles.userInfo}>
                      <div className={styles.avatar}>
                        {request.avatar}
                      </div>
                      <div className={styles.userDetails}>
                        <h3 className={styles.name}>{request.name}</h3>
                        <p className={styles.username}>{request.username}</p>
                        <div className={styles.meta}>
                          <span className={styles.mutual}>{request.mutualFriends} mutual friends</span>
                          <span className={styles.timestamp}>Sent {request.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.actions}>
                      <button 
                        className={styles.primaryButton}
                        onClick={() => handleAcceptRequest(request.id)}
                      >
                        Accept
                      </button>
                      <button 
                        className={styles.secondaryButton}
                        onClick={() => handleDeclineRequest(request.id)}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <p>No pending requests</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'suggestions' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>People You May Know</h2>
              <span className={styles.count}>{suggestions.length}</span>
            </div>
            <div className={styles.list}>
              {suggestions.length > 0 ? (
                suggestions.map(suggestion => (
                  <div key={suggestion.id} className={styles.card}>
                    <div className={styles.userInfo}>
                      <div className={styles.avatar}>
                        {suggestion.avatar}
                      </div>
                      <div className={styles.userDetails}>
                        <h3 className={styles.name}>{suggestion.name}</h3>
                        <p className={styles.username}>{suggestion.username}</p>
                        <div className={styles.meta}>
                          <span className={styles.mutual}>{suggestion.mutualFriends} mutual friends</span>
                          <span className={styles.bio}>{suggestion.bio}</span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.actions}>
                      <button 
                        className={styles.primaryButton}
                        onClick={() => handleAddFriend(suggestion.id)}
                      >
                        Add Friend
                      </button>
                      <button className={styles.secondaryButton}>
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <p>No more suggestions for now</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}