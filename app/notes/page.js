"use client";

import { useState, useEffect } from "react";
import styles from "../styles/Notes.module.css";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");
  const [loading, setLoading] = useState(true);
  const [showNotepad, setShowNotepad] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // 🧠 Load notes on mount
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch("/api/notes");
        if (!res.ok) throw new Error("Failed to fetch notes");
        const data = await res.json();
        setNotes(data);
      } catch (error) {
        console.error("❌ Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  // 📝 Save note
  const handleSave = async () => {
    if (!noteText.trim()) return alert("Write something before saving!");

    const button = document.querySelector(`.${styles.saveButton}`);
    button?.classList.add(styles.saved);

    setTimeout(() => {
      button?.classList.remove(styles.saved);
    }, 600);

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: noteText }),
      });

      if (!res.ok) throw new Error("Failed to save note");

      const newNote = await res.json();
      setNotes((prev) => [newNote, ...prev]);
      setNoteText("");

      // 🎉 Show success popup
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    } catch (error) {
      console.error("❌ Error saving note:", error);
    }
  };

  // 🗑 Delete note
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete note");
      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (error) {
      console.error("❌ Error deleting note:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>💖 My Notes</h1>

      {/* ✨ Fancy Floating Button */}
      <button
        className={`${styles.floatingButton} ${showNotepad ? styles.closeButton : ""}`}
        onClick={() => setShowNotepad((prev) => !prev)}
      >
        {showNotepad ? "✖ Close" : "➕ New Note"}
      </button>

      {/* 🪄 Animated Notepad */}
      <div
        className={`${styles.notepadWrapper} ${
          showNotepad ? styles.showNotepad : ""
        }`}
      >
        {showNotepad && (
          <div className={styles.notepad}>
            <textarea
              className={styles.textarea}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Write your thoughts..."
            />
            <button className={styles.saveButton} onClick={handleSave}>
              Save Note 💾
            </button>
          </div>
        )}
      </div>

      {/* 🗒 Notes List */}
      {loading ? (
        <p className={styles.loading}>Loading your notes...</p>
      ) : (
        <ul className={styles.notesList}>
          {notes.length === 0 ? (
            <p className={styles.empty}>No notes yet — start writing ✨</p>
          ) : (
            notes.map((note) => (
              <li key={note._id} className={styles.noteItem}>
                <p className={styles.noteText}>{note.text}</p>
                <small className={styles.timestamp}>
                  {new Date(note.createdAt).toLocaleString()}
                </small>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(note._id)}
                >
                  🗑
                </button>
              </li>
            ))
          )}
        </ul>
      )}

      {/* ✅ Success Popup */}
      {showPopup && <div className={styles.successPopup}>✅ Note Saved!</div>}

      {/* 🌸 Floating Background Icons */}
      <span className={styles.floatingIcon} style={{ top: "10%", left: "5%" }}>💖</span>
      <span className={styles.floatingIcon} style={{ top: "30%", right: "10%" }}>⭐</span>
      <span className={styles.floatingIcon} style={{ bottom: "15%", left: "15%" }}>🖊️</span>
      <span className={styles.floatingIcon} style={{ bottom: "25%", right: "5%" }}>🌸</span>
    </div>
  );
}
