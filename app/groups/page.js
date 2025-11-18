"use client";

import { useState, useEffect } from "react";
import GroupOverview from "../components/GroupOverview";
import GroupChat from "../components/GroupChat";
import MemberList from "../components/MemberList";
import SharedResources from "../components/SharedResources";
import styles from "../styles/Group.module.css";

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const userId = "68fa6dc7e80dde88e2fda536"; // Must exist in DB

  // 📌 Fetch all groups
  useEffect(() => {
    async function loadGroups() {
      try {
        const res = await fetch("/api/groups");
        if (!res.ok) throw new Error("Failed to fetch groups");
        const data = await res.json();
        setGroups(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("❌ Error fetching groups:", error);
      }
    }

    loadGroups();
  }, []);

  // 📌 Load Messages when selecting a group
  useEffect(() => {
    async function loadMessages() {
      if (!selectedGroup) return;

      try {
        setLoading(true);

        const res = await fetch(`/api/groups/${selectedGroup._id}`);
        if (!res.ok) throw new Error("Failed to load group");
        const data = await res.json();

        setMessages(Array.isArray(data.messages) ? data.messages : []);
      } catch (error) {
        console.error("❌ Error fetching group messages:", error);
      } finally {
        setLoading(false);
      }
    }

    loadMessages();
  }, [selectedGroup]);

  // ➕ Create New Group
  async function handleCreateGroup(name, description) {
    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          members: [userId],
        }),
      });

      if (!res.ok) throw new Error("Failed to create group");

      const data = await res.json();
      setGroups((prev) => [...prev, data]);
    } catch (error) {
      console.error("❌ Error creating group:", error);
    }
  }

  // ⭐ Send Message (no socket)
  async function handleSendMessage(text) {
    if (!selectedGroup || !text.trim()) return;

    try {
      const res = await fetch(`/api/groups/${selectedGroup._id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: userId,
          text,
        }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const savedMessage = await res.json();

      // Add instantly to UI
      setMessages((prev) => [...prev, savedMessage]);
    } catch (error) {
      console.error("❌ Error sending message:", error);
    }
  }

  // 🚪 Leave Group
  async function handleLeaveGroup(groupId) {
    const confirmLeave = confirm("Are you sure you want to leave this group?");
    if (!confirmLeave) return;

    try {
      const res = await fetch(`/api/groups/${groupId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) throw new Error("Failed to leave group");

      setGroups((prev) => prev.filter((g) => g._id !== groupId));
      setSelectedGroup(null);
      setMessages([]);

      const data = await res.json();
      alert(data.message || "Left group successfully.");
    } catch (error) {
      console.error("❌ Error leaving group:", error);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Study Groups</h1>
        <button onClick={() => setSelectedGroup(null)}>+ New Group</button>
      </div>

      <div className={styles.container}>

        {/* LEFT PANEL */}
        <div className={styles.panel}>
          <h2 className={styles.sectionTitle}>Your Groups</h2>

          <ul className={styles.groupList}>
            {groups.length > 0 ? (
              groups.map((g) => (
                <li
                  key={g._id}
                  className={`${styles.groupItem} ${
                    selectedGroup?._id === g._id ? styles.activeGroup : ""
                  }`}
                  onClick={() => setSelectedGroup(g)}
                >
                  {g.name}
                </li>
              ))
            ) : (
              <li className={styles.placeholder}>No groups yet — create one!</li>
            )}
          </ul>

          <div className={styles.createGroupBox}>
            <h3>Create Group</h3>
            <GroupOverview onCreate={handleCreateGroup} />
          </div>
        </div>

        {/* CENTER PANEL */}
        <div className={styles.panel}>
          {selectedGroup ? (
            <>
              <div className={styles.groupHeader}>
                <h2 className={styles.sectionTitle}>{selectedGroup.name}</h2>

                <button
                  onClick={() => handleLeaveGroup(selectedGroup._id)}
                  className={styles.leaveButton}
                >
                  Leave Group 🏃‍♂️
                </button>
              </div>

              {/* ⭐ NEW BUBBLE UI */}
              <div className={styles.groupInfoBubble}>
                <div className={styles.groupInfoRow}>
                  <span className={styles.groupIcon}>📘</span>
                  <h2 className={styles.groupTitle}>{selectedGroup.name}</h2>
                </div>

                <div className={styles.groupInfoRow}>
                  <span className={styles.groupIcon}>📝</span>
                  <p className={styles.groupDescription}>
                    {selectedGroup.description || "No description provided."}
                  </p>
                </div>
              </div>

              <GroupChat
                messages={messages}
                onSendMessage={handleSendMessage}
                loading={loading}
                currentUserId={userId}
              />
            </>
          ) : (
            <div className={styles.placeholder}>Select or create a group 💬</div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className={styles.panel}>
          <h2 className={styles.sectionTitle}>Members</h2>
          <MemberList group={selectedGroup} />

          <h2 className={styles.sectionTitle}>Shared Resources</h2>
          <SharedResources />
        </div>
      </div>
    </div>
  );
}
