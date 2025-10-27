"use client";

import { useState, useEffect, useContext } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "../styles/Events.module.css";
import { ThemeContext } from "../context/ThemeContext";

export default function EventsPage() {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeLeft, setTimeLeft] = useState("");
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    time: "",
    type: "",
    description: "",
    location: "",
  });
  const [editingEvent, setEditingEvent] = useState(null);

  // ✅ Fetch events from MongoDB
  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      const formatted = data.map((ev) => ({
        ...ev,
        date: new Date(ev.date),
      }));
      setEvents(formatted);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

 const handleSaveEvent = async (e) => {
  e.preventDefault(); // ✅ stops page reload
  console.log("Saving event:", newEvent);

  try {
    const eventData = { ...newEvent, date: selectedDate };

    if (editingEvent) {
      eventData._id = editingEvent._id;
    }

    const res = await fetch("/api/events", {
      method: editingEvent ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData),
    });

    const responseText = await res.text();
    console.log("Response:", responseText);

    if (!res.ok) throw new Error("Failed to save event");
    await fetchEvents();
    resetForm();
  } catch (error) {
    console.error("Error saving event:", error);
    alert("Error saving event. Check console for details.");
  }
};
 

  // ✅ Delete Event
  const handleDeleteEvent = async (id) => {
    try {
      const res = await fetch("/api/events", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete event");
      await fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setNewEvent({
      title: "",
      time: "",
      type: "",
      description: "",
      location: "",
    });
    setEditingEvent(null);
  };

  // 🕒 Countdown Timer
  const selectedEvent =
    events.find(
      (event) => event.date.toDateString() === selectedDate.toDateString()
    ) || events.sort((a, b) => a.date - b.date)[0];

  useEffect(() => {
    if (!selectedEvent) {
      setTimeLeft("");
      return;
    }
    const interval = setInterval(() => {
      const now = new Date();
      const distance = selectedEvent.date - now;
      if (distance <= 0) {
        setTimeLeft("No Event Today");
        clearInterval(interval);
        return;
      }
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((distance / (1000 * 60)) % 60);
      const seconds = Math.floor((distance / 1000) % 60);
      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedEvent]);

  // 🔍 Filters
  const filteredEvents = events.filter(
    (event) => filter === "All" || event.type === filter
  );
  const eventsForDate = filteredEvents.filter(
    (event) => event.date.toDateString() === selectedDate.toDateString()
  );

  return (
    <div className={`${styles.page} ${darkMode ? styles.dark : styles.light}`}>
      <header className={styles.header}>
        <h1 className={styles.logo}>GirlHype</h1>
        <h2 className={styles.pageTitle}>School Events</h2>

        {/* 🌗 Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          style={{
            background: darkMode ? "#000" : "#f9f9f9",
            color: darkMode ? "#fff" : "#000",
            border: "1px solid #ccc",
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </header>

      {/* 🔥 Featured Event */}
      {selectedEvent && (
        <div className={styles.featuredBanner}>
          <h2>🔥 Upcoming Event: {selectedEvent.title}</h2>
          <p>
            {selectedEvent.date.toDateString()} • {selectedEvent.time}
          </p>
          <p>{selectedEvent.description}</p>
          <div className={styles.countdownBox}>
            <span className={styles.timerLabel}>⏳ Starts in:</span>
            <span className={styles.timerValue}>{timeLeft}</span>
          </div>
          <button className={styles.registerButton}>Register Now</button>
        </div>
      )}

      {/* 🎯 Filters */}
      <div className={styles.filters}>
        {["All", "Workshop", "Hackathon"].map((type) => (
          <button
            key={type}
            className={`${styles.filterButton} ${
              filter === type ? styles.activeFilter : ""
            }`}
            onClick={() => setFilter(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {/* 📅 Calendar */}
        <div
          className={`${styles.calendarSection} ${
            darkMode ? styles.darkCalendar : styles.lightCalendar
          }`}
        >
          <Calendar
            onChange={(date) => {
              setSelectedDate(date);
              setShowForm(true);
              setEditingEvent(null);
            }}
            value={selectedDate}
            tileClassName={({ date }) =>
              events.some(
                (event) => event.date.toDateString() === date.toDateString()
              )
                ? styles.highlightDate
                : null
            }
          />
          <button
            className={styles.addEventButton}
            onClick={() => {
              setShowForm(true);
              setEditingEvent(null);
            }}
          >
            ➕ Add Event
          </button>
        </div>

        {/* 📋 Events */}
        <div className={styles.eventsSection}>
          <h3 className={styles.sectionTitle}>
            Events on {selectedDate.toDateString()}
          </h3>
          {eventsForDate.length > 0 ? (
            <div className={styles.eventGrid}>
              {eventsForDate.map((event) => (
                <div key={event._id || event.id} className={styles.eventCard}>
                  <img
                    src="/event-placeholder.jpg"
                    alt={event.title}
                    className={styles.eventImage}
                  />
                  <div className={styles.cardContent}>
                    <span className={styles.eventBadge}>{event.type}</span>
                    <h4>{event.title}</h4>
                    <p className={styles.eventDate}>🕒 {event.time}</p>
                    <p className={styles.eventLocation}>📍 {event.location}</p>
                    <div className={styles.cardActions}>
                      <button
                        className={styles.registerSmall}
                        onClick={() =>
                          window.alert("Registration feature coming soon!")
                        }
                      >
                        Register
                      </button>
                      <button
                        className={styles.editButton}
                        onClick={() => {
                          setEditingEvent(event);
                          setNewEvent(event);
                          setSelectedDate(new Date(event.date));
                          setShowForm(true);
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDeleteEvent(event._id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <img src="/no-events.png" alt="No events" />
              <p>No events scheduled for this day.</p>
              <button onClick={() => setShowForm(true)}>➕ Add Event</button>
            </div>
          )}
        </div>
      </div>

      {/* 📝 Add/Edit Form */}
      {showForm && (
        <div className={styles.eventForm}>
          <h3>
            {editingEvent ? "Edit Event" : "Add Event"} for{" "}
            {selectedDate.toDateString()}
          </h3>
          <input
            type="text"
            placeholder="Title"
            value={newEvent.title}
            onChange={(e) =>
              setNewEvent({ ...newEvent, title: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Time (e.g., 10:00 AM - 1:00 PM)"
            value={newEvent.time}
            onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
          />
          <input
            type="text"
            placeholder="Type (Workshop, Hackathon...)"
            value={newEvent.type}
            onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
          />
          <textarea
            placeholder="Description"
            value={newEvent.description}
            onChange={(e) =>
              setNewEvent({ ...newEvent, description: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Location"
            value={newEvent.location}
            onChange={(e) =>
              setNewEvent({ ...newEvent, location: e.target.value })
            }
          />
          <div className={styles.formActions}>
            <button onClick={handleSaveEvent}>💾 Save</button>
            <button onClick={resetForm}>❌ Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
