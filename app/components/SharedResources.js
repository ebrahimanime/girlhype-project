"use client";
import React, { useState } from "react";
import styles from "../styles/Group.module.css";

export default function SharedResources() {
  const [resources, setResources] = useState([]);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkURL, setLinkURL] = useState("");

  // 📸 Handle Image Upload
  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const imageURL = URL.createObjectURL(file);

    const newResource = {
      type: "image",
      src: imageURL,
    };

    setResources((prev) => [...prev, newResource]);
  }

  // 🔗 Save Link
  function handleSaveLink() {
    if (!linkTitle.trim() || !linkURL.trim()) {
      alert("Please fill in both fields.");
      return;
    }

    const newResource = {
      type: "link",
      title: linkTitle,
      link: linkURL,
    };

    setResources((prev) => [...prev, newResource]);

    setShowLinkInput(false);
    setLinkTitle("");
    setLinkURL("");
  }

  return (
    <div className={styles.resourcesContainer}>
      
      {/* --- BUTTONS --- */}
      <div className={styles.resourceButtons}>
        
        {/* Upload Btn */}
        <label className={styles.uploadButton}>
          Upload Image
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageUpload}
          />
        </label>

        {/* Add Link Btn */}
        <button
          className={styles.addLinkButton}
          onClick={() => setShowLinkInput(!showLinkInput)}
        >
          Add Link
        </button>
      </div>

      {/* --- LINK INPUT UI --- */}
      {showLinkInput && (
        <div className={styles.linkInputBox}>
          <input
            type="text"
            placeholder="Resource Title"
            className={styles.textInput}
            value={linkTitle}
            onChange={(e) => setLinkTitle(e.target.value)}
          />

          <input
            type="text"
            placeholder="Paste URL here..."
            className={styles.textInput}
            value={linkURL}
            onChange={(e) => setLinkURL(e.target.value)}
          />

          <button className={styles.saveLinkButton} onClick={handleSaveLink}>
            Save Link
          </button>
        </div>
      )}

      {/* --- DISPLAY RESOURCES --- */}
      <ul className={styles.resourceList}>
        {resources.map((r, i) => (
          <li key={i} className={styles.resourceItem}>
            {r.type === "link" && (
              <a href={r.link} target="_blank" rel="noopener noreferrer">
                {r.title}
              </a>
            )}

            {r.type === "image" && (
              <img src={r.src} className={styles.resourceImage} alt="uploaded" />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
