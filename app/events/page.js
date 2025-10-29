"use client";

import { useState, useEffect, useContext, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "../styles/Events.module.css";
import { ThemeContext } from "../context/ThemeContext";

export default function EventsPage() {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  // 🎯 States
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [newEvent, setNewEvent] = useState({
    title: "",
    time: "",
    type: "",
    description: "",
    location: "",
  });

  // ✅ Fetch Events
  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      const data = await res.json();

      if (!Array.isArray(data)) throw new Error("Invalid data format");

      // Convert MongoDB date strings → JS Date objects
      const normalized = data.map((event) => ({
        ...event,
        date: new Date(event.date),
      }));

      setEvents(normalized);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // ✅ Save Event (Add / Edit)
  const handleSaveEvent = async (e) => {
    e.preventDefault();

    const eventData = { ...newEvent, date: selectedDate };
    if (editingEvent?._id) eventData._id = editingEvent._id;

    try {
      const res = await fetch("/api/events", {
        method: editingEvent ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      const text = await res.text();
      console.log("Response:", text);

      if (!res.ok) throw new Error("Failed to save event");

      await fetchEvents();
      resetForm();
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Could not save event. See console for details.");
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

  // 🧹 Reset Form
  const resetForm = () => {
    setShowForm(false);
    setEditingEvent(null);
    setNewEvent({
      title: "",
      time: "",
      type: "",
      description: "",
      location: "",
    });
  };

  // 🕒 Upcoming Event + Countdown
  const selectedEvent = useMemo(() => {
    const event =
      events.find(
        (e) =>
          e.date && e.date.toDateString() === selectedDate.toDateString()
      ) || events.sort((a, b) => a.date - b.date)[0];
    return event || null;
  }, [events, selectedDate]);

  useEffect(() => {
    if (!selectedEvent) {
      setTimeLeft("");
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const distance = selectedEvent.date - now;

      if (distance <= 0) {
        setTimeLeft("Ongoing or Passed");
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
  const filteredEvents = useMemo(
    () =>
      events.filter((e) => filter === "All" || e.type === filter),
    [events, filter]
  );

  const eventsForDate = useMemo(
    () =>
      filteredEvents.filter(
        (e) => e.date && e.date.toDateString() === selectedDate.toDateString()
      ),
    [filteredEvents, selectedDate]
  );

  // 🌙 / ☀️ UI
  return (
    <div className={`${styles.page} ${darkMode ? styles.dark : styles.light}`}>
      <header className={styles.header}>
        <h1 className={styles.logo}>GirlHype</h1>
        <h2 className={styles.pageTitle}>School Events</h2>
        <button
          onClick={toggleDarkMode}
          className={styles.modeToggle}
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
            locale="en-GB"
            tileClassName={({ date }) =>
              events.some(
                (e) => e.date && e.date.toDateString() === date.toDateString()
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

        {/* 📋 Events List */}
        <div className={styles.eventsSection}>
          <h3 className={styles.sectionTitle}>
            Events on {selectedDate.toDateString()}
          </h3>

          {eventsForDate.length > 0 ? (
            <div className={styles.eventGrid}>
              {eventsForDate.map((event) => (
                <div key={event._id || event.id} className={styles.eventCard}>
                  <div className={styles.cardContent}>
                    <span className={styles.eventBadge}>{event.type}</span>
                    <h4>{event.title}</h4>
                    <p>🕒 {event.time}</p>
                    <p>📍 {event.location}</p>

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
            onChange={(e) =>
              setNewEvent({ ...newEvent, time: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Type (Workshop, Hackathon...)"
            value={newEvent.type}
            onChange={(e) =>
              setNewEvent({ ...newEvent, type: e.target.value })
            }
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
