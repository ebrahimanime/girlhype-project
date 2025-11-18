"use client";
import { useState } from "react";
import "../styles/Group.module.css";

export default function GroupOverview({ onCreate }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(name, description);
    setName("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="createGroupForm">
      <input
        type="text"
        placeholder="Group name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">Create</button>
    </form>
  );
}
