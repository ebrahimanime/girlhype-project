'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import styles from '../styles/MessagesPage.module.css'

export default function MessagesPage({ user }) {
  const [conversations, setConversations] = useState([])
  const [messageRequests, setMessageRequests] = useState([])
  const [activeTab, setActiveTab] = useState('primary')
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef(null)
  const router = useRouter()

  // Clean, minimal mock data
  useEffect(() => {
    const mockConversations = [
      {
        id: 1,
        user: {
          id: 2,
          name: 'Alex Johnson',
          avatar: 'AJ',
          isOnline: true,
          lastActive: '2m ago'
        },
        lastMessage: 'Hey! The party tonight is gonna be lit!',
        timestamp: '2m ago',
        unreadCount: 2,
        isRead: false
      },
      {
        id: 2,
        user: {
          id: 3,
          name: 'Sarah Miller',
          avatar: 'SM',
          isOnline: false,
          lastActive: '1h ago'
        },
        lastMessage: 'Just posted new pics from the concert!',
        timestamp: '1h ago',
        unreadCount: 0,
        isRead: true
      },
      {
        id: 3,
        user: {
          id: 4,
          name: 'Mike Chen',
          avatar: 'MC',
          isOnline: true,
          lastActive: 'Just now'
        },
        lastMessage: 'Are we still meeting tomorrow?',
        timestamp: '3h ago',
        unreadCount: 1,
        isRead: false
      }
    ]

    const mockRequests = [
      {
        id: 4,
        user: {
          id: 5,
          name: 'Emma Wilson',
          avatar: 'EW',
          isOnline: false,
          lastActive: '2d ago'
        },
        lastMessage: 'Hi! I saw your post about the gaming tournament...',
        timestamp: '1d ago',
        mutualFriends: 3
      }
    ]

    setConversations(mockConversations)
    setMessageRequests(mockRequests)
  }, [])

  // Messages for each conversation
  const [conversationMessages, setConversationMessages] = useState({
    1: [
      { id: 1, text: 'Hey! The party tonight is gonna be lit!', sender: 'them', timestamp: '2:25 PM' },
      { id: 2, text: 'I know right! Can\'t wait to see everyone there!', sender: 'me', timestamp: '2:26 PM' },
      { id: 3, text: 'Bring your dancing shoes!', sender: 'them', timestamp: '2:26 PM' }
    ],
    2: [
      { id: 1, text: 'Just posted new pics from the concert!', sender: 'them', timestamp: '1:15 PM' },
      { id: 2, text: 'OMG the lighting looks incredible!', sender: 'me', timestamp: '1:16 PM' }
    ],
    3: [
      { id: 1, text: 'Are we still meeting tomorrow?', sender: 'them', timestamp: '11:30 AM' },
      { id: 2, text: 'Yeah! Court is booked for 3 PM', sender: 'me', timestamp: '11:31 AM' }
    ]
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [selectedConversation, conversationMessages])

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation)
    // Mark as read when selected
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversation.id 
          ? { ...conv, unreadCount: 0, isRead: true }
          : conv
      )
    )
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return

    const newMsg = {
      id: Date.now(),
      text: newMessage,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    // Update messages for current conversation
    setConversationMessages(prev => ({
      ...prev,
      [selectedConversation.id]: [...(prev[selectedConversation.id] || []), newMsg]
    }))

    // Update conversation list
    setConversations(prev => 
      prev.map(conv => 
        conv.id === selectedConversation.id 
          ? { 
              ...conv, 
              lastMessage: newMessage,
              timestamp: 'Just now',
              unreadCount: 0
            }
          : conv
      )
    )

    setNewMessage('')
  }

  const handleAcceptRequest = (requestId) => {
    const request = messageRequests.find(req => req.id === requestId)
    if (request) {
      setMessageRequests(prev => prev.filter(req => req.id !== requestId))
      setConversations(prev => [...prev, { 
        ...request, 
        unreadCount: 1,
        isRead: false
      }])
    }
  }

  const handleDeleteRequest = (requestId) => {
    setMessageRequests(prev => prev.filter(req => req.id !== requestId))
  }

  return (
    <div className={styles.messagesContainer}>
      {/* Header */}
      <div className={styles.messagesHeader}>
        <button 
          className={styles.backButton}
          onClick={() => router.back()}
        >
          ← Back
        </button>
        <h1>Messages</h1>
        <div className={styles.headerInfo}>
          {conversations.filter(c => c.user.isOnline).length} online
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.messagesContent}>
        {/* Sidebar */}
        <div className={styles.sidebar}>
          {/* Tabs */}
          <div className={styles.tabs}>
            <button 
              className={`${styles.tab} ${activeTab === 'primary' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('primary')}
            >
              Chats
              {conversations.filter(c => c.unreadCount > 0).length > 0 && (
                <span className={styles.badge}>
                  {conversations.filter(c => c.unreadCount > 0).length}
                </span>
              )}
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'requests' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('requests')}
            >
              Requests
              {messageRequests.length > 0 && (
                <span className={styles.badge}>
                  {messageRequests.length}
                </span>
              )}
            </button>
          </div>

          {/* Conversations List */}
          <div className={styles.conversationsList}>
            {activeTab === 'primary' ? (
              conversations.length > 0 ? (
                conversations.map(conversation => (
                  <div
                    key={conversation.id}
                    className={`${styles.conversationItem} ${
                      selectedConversation?.id === conversation.id ? styles.active : ''
                    } ${!conversation.isRead ? styles.unread : ''}`}
                    onClick={() => handleConversationSelect(conversation)}
                  >
                    <div className={styles.avatar}>
                      {conversation.user.avatar}
                      {conversation.user.isOnline && (
                        <span className={styles.onlineIndicator}></span>
                      )}
                    </div>
                    <div className={styles.conversationDetails}>
                      <div className={styles.conversationHeader}>
                        <span className={styles.userName}>{conversation.user.name}</span>
                        <span className={styles.timestamp}>{conversation.timestamp}</span>
                      </div>
                      <div className={styles.lastMessage}>
                        {conversation.lastMessage}
                      </div>
                      <div className={styles.userStatus}>
                        {conversation.user.isOnline ? 'Online' : `Last seen ${conversation.user.lastActive}`}
                      </div>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <span className={styles.unreadBadge}>
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <p>No messages yet</p>
                </div>
              )
            ) : (
              // Requests
              messageRequests.length > 0 ? (
                messageRequests.map(request => (
                  <div key={request.id} className={styles.requestItem}>
                    <div className={styles.avatar}>
                      {request.user.avatar}
                    </div>
                    <div className={styles.requestDetails}>
                      <div className={styles.requestHeader}>
                        <span className={styles.userName}>{request.user.name}</span>
                        <span className={styles.timestamp}>{request.timestamp}</span>
                      </div>
                      <div className={styles.lastMessage}>
                        {request.lastMessage}
                      </div>
                      <div className={styles.requestInfo}>
                        <span className={styles.mutualFriends}>
                          {request.mutualFriends} mutual friends
                        </span>
                        <span className={styles.userStatus}>
                          {request.user.isOnline ? 'Online' : `Last seen ${request.user.lastActive}`}
                        </span>
                      </div>
                      <div className={styles.requestActions}>
                        <button 
                          className={styles.acceptButton}
                          onClick={() => handleAcceptRequest(request.id)}
                        >
                          Accept
                        </button>
                        <button 
                          className={styles.deleteButton}
                          onClick={() => handleDeleteRequest(request.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <p>No message requests</p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={styles.chatArea}>
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className={styles.chatHeader}>
                <div className={styles.chatUserInfo}>
                  <div className={styles.avatar}>
                    {selectedConversation.user.avatar}
                    {selectedConversation.user.isOnline && (
                      <span className={styles.onlineIndicator}></span>
                    )}
                  </div>
                  <div>
                    <div className={styles.userName}>{selectedConversation.user.name}</div>
                    <div className={styles.userStatus}>
                      {selectedConversation.user.isOnline ? 'Online' : `Last seen ${selectedConversation.user.lastActive}`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className={styles.messagesList}>
                {conversationMessages[selectedConversation.id]?.map((message) => (
                  <div
                    key={message.id}
                    className={`${styles.message} ${
                      message.sender === 'me' ? styles.sent : styles.received
                    }`}
                  >
                    <div className={styles.messageContent}>
                      {message.text}
                    </div>
                    <div className={styles.messageTime}>
                      {message.timestamp}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className={styles.messageInputContainer}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className={styles.messageInput}
                />
                <button 
                  type="submit" 
                  className={styles.sendButton}
                  disabled={!newMessage.trim()}
                >
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className={styles.noChatSelected}>
              <div className={styles.placeholder}>
                <h3>Select a conversation</h3>
                <p>Choose a chat from the sidebar to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}