"use client";

import { useState } from "react";
import styles from "../styles/Friends.module.css";

export default function FriendsPage() {
  const [requests, setRequests] = useState([
    
  ]);

  const [suggestions, setSuggestions] = useState([
    
  ]);

  const acceptRequest = (id) => {
    setRequests(requests.filter((req) => req.id !== id));
    // Later: move to friends list
  };

  const declineRequest = (id) => {
    setRequests(requests.filter((req) => req.id !== id));
  };

  const addFriend = (id) => {
    setSuggestions(suggestions.filter((s) => s.id !== id));
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.logo}>GirlHype</h1>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="🔍 Search friends..."
            className={styles.searchInput}
          />
        </div>
      </header>

      <main className={styles.main}>
        {/* Friend Requests */}
        <section className={styles.section}>
          <h2 className={styles.title}>Friend Requests</h2>
          <div className={styles.friendsGrid}>
            {requests.length > 0 ? (
              requests.map((req) => (
                <div key={req.id} className={styles.friendCard}>
                  <div className={styles.avatar}>{req.name.charAt(0)}</div>
                  <span className={styles.friendName}>{req.name}</span>
                  <div className={styles.actions}>
                    <button
                      className={styles.acceptButton}
                      onClick={() => acceptRequest(req.id)}
                    >
                      ✅ Accept
                    </button>
                    <button
                      className={styles.declineButton}
                      onClick={() => declineRequest(req.id)}
                    >
                      ❌ Decline
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.emptyText}>No pending requests</p>
            )}
          </div>
        </section>

        {/* People You May Know */}
        <section className={styles.section}>
          <h2 className={styles.title}>People You May Know</h2>
          <div className={styles.friendsGrid}>
            {suggestions.length > 0 ? (
              suggestions.map((s) => (
                <div key={s.id} className={styles.friendCard}>
                  <div className={styles.avatar}>{s.name.charAt(0)}</div>
                  <span className={styles.friendName}>{s.name}</span>
                  <button
                    className={styles.addFriendButton}
                    onClick={() => addFriend(s.id)}
                  >
                    + Add Friend
                  </button>
                </div>
              ))
            ) : (
              <p className={styles.emptyText}>No suggestions right now</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
