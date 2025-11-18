"use client";

import { useState, useRef, useEffect } from "react";
import styles from "../styles/Group.module.css";

export default function GroupChat({ messages, onSendMessage, loading, currentUserId }) {
  const [text, setText] = useState("");
  const chatEndRef = useRef(null);

  // 📜 Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text);
    setText("");
  };

  return (
    <div className={styles.chatContainer}>
      {/* 🗨️ Messages */}
      <div className={styles.messagesBox}>
        {loading ? (
          <p>Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className={styles.placeholder}>No messages yet — start the conversation! 💬</p>
        ) : (
          messages.map((msg, index) => {
            const isOwn = msg.sender?._id === currentUserId;
            const senderName = isOwn
              ? "You"
              : msg.sender?.name || msg.sender?.email || "Unknown";

            return (
              <div
                key={index}
                className={`${styles.messageRow} ${isOwn ? styles.ownMessageRow : ""}`}
              >
                {!isOwn && (
                  <div className={styles.avatarBubble}>
                    {senderName.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className={`${styles.messageBubble} ${isOwn ? styles.ownBubble : ""}`}>
                  {!isOwn && <span className={styles.senderName}>{senderName}</span>}
                  <p>{msg.text}</p>
                  <span className={styles.timestamp}>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {/* ✉️ Message Input */}
      <form onSubmit={handleSubmit} className={styles.chatInputBox}>
        <input
          type="text"
          placeholder="Type your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
          className={styles.chatInput}
        />
        <button type="submit" disabled={!text.trim() || loading} className={styles.sendButton}>
          Send 🚀
        </button>
      </form>
    </div>
  );
}
