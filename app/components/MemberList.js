"use client";
import React, { useEffect, useState } from "react";
import styles from "../styles/Group.module.css";

export default function MemberList({ group }) {
  const [members, setMembers] = useState([]);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🧠 Load group members
  useEffect(() => {
    if (!group?._id) return;

    async function fetchMembers() {
      try {
        const res = await fetch(`/api/groups/${group._id}`);
        if (!res.ok) throw new Error("Failed to fetch group info");

        const data = await res.json();
        setMembers(Array.isArray(data.members) ? data.members : []);
      } catch (error) {
        console.error("❌ Error fetching members:", error);
        setMembers([]);
      }
    }

    fetchMembers();
  }, [group?._id]);

  // 🔍 Search users NOT in group — with safe checks
  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }

    async function searchUsers() {
      try {
        setLoading(true);

        const res = await fetch(`/api/users?q=${encodeURIComponent(search)}`);
        if (!res.ok) throw new Error("Failed to search users");

        const result = await res.json();

        // Ensure "users" exists and is an array
        const userList = Array.isArray(result.users) ? result.users : [];

        const filtered = userList.filter(
          (user) => !members.some((m) => m._id === user._id)
        );

        setSearchResults(filtered);
      } catch (error) {
        console.error("❌ Error searching users:", error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }

    const delay = setTimeout(searchUsers, 400);
    return () => clearTimeout(delay);
  }, [search, members]);

  // ➕ Add a member
  async function handleAddMember(userId) {
    try {
      const res = await fetch("/api/groups", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId: group._id, userId }),
      });

      if (!res.ok) throw new Error("Failed to add member");

      const updated = await res.json();
      setMembers(Array.isArray(updated.members) ? updated.members : []);

      setShowAddMenu(false);
      setSearch("");
      setSearchResults([]);

      alert("✅ Member added successfully!");
    } catch (error) {
      console.error("❌ Error adding member:", error);
      alert("Failed to add member.");
    }
  }

  // If no group selected
  if (!group)
    return (
      <div className={styles.panel}>
        <h3 className={styles.sectionTitle}>Members</h3>
        <p>Select a group to view members 👥</p>
      </div>
    );

  return (
    <div className={styles.panel}>
      <h3 className={styles.sectionTitle}>Members ({members.length})</h3>

      {/* MEMBER LIST */}
      {members.length === 0 ? (
        <p>No members yet 👀</p>
      ) : (
        <div className={styles.memberList}>
          {members.map((member) => (
            <div key={member._id} className={styles.memberItem}>
              <div className={styles.memberName}>
                <div className={styles.avatar}>
                  {member.name
                    ? member.name.charAt(0).toUpperCase()
                    : member.email?.charAt(0).toUpperCase() || "?"}
                </div>
                <span>{member.name || member.email}</span>
              </div>

              <div
                className={`${styles.statusDot} ${
                  member.isOnline ? styles.statusOnline : ""
                }`}
              ></div>
            </div>
          ))}
        </div>
      )}

      {/* ADD MEMBER */}
      <div className={styles.addMemberBox}>
        {showAddMenu ? (
          <div className={styles.searchContainer}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for a user..."
              className={styles.searchInput}
            />

            {loading ? (
              <p>Searching...</p>
            ) : searchResults.length > 0 ? (
              <ul className={styles.searchResults}>
                {searchResults.map((user) => (
                  <li
                    key={user._id}
                    onClick={() => handleAddMember(user._id)}
                    className={styles.searchItem}
                  >
                    {user.name || user.email}
                  </li>
                ))}
              </ul>
            ) : (
              search && <p>No users found</p>
            )}

            <button
              onClick={() => setShowAddMenu(false)}
              className={styles.cancelButton}
            >
              Close
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAddMenu(true)}
            className={styles.addMemberButton}
          >
            ➕ Add Member
          </button>
        )}
      </div>
    </div>
  );
}
