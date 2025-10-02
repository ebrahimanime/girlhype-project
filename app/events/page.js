"use client";

import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "../styles/Events.module.css";

export default function EventsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeLeft, setTimeLeft] = useState("");
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Intro to Web Development",
      date: new Date(2025, 8, 30),
      time: "10:00 AM - 1:00 PM",
      type: "Workshop",
      description: "Beginner-friendly coding session covering HTML, CSS & JS.",
      location: "GirlHype Campus, Cape Town",
    },
    {
      id: 2,
      title: "GirlHype Hackathon 2025",
      date: new Date(2025, 9, 15),
      time: "All Day",
      type: "Hackathon",
      description: "Collaborate in teams and build exciting coding projects.",
      location: "Virtual Event (Zoom link provided after registration)",
    },
  ]);

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

  // Featured event = next upcoming one
  const featuredEvent = events.sort((a, b) => a.date - b.date)[0];

  // Countdown timer
  useEffect(() => {
    if (!featuredEvent) return;
    const interval = setInterval(() => {
      const now = new Date();
      const distance = featuredEvent.date - now;

      if (distance <= 0) {
        setTimeLeft("Event is live! 🎉");
        clearInterval(interval);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((distance / (1000 * 60)) % 60);

      setTimeLeft(`${days}d ${hours}h ${minutes}m`);
    }, 1000);

    return () => clearInterval(interval);
  }, [featuredEvent]);

  // Save event (new or edited)
  const handleSaveEvent = () => {
    if (editingEvent) {
      setEvents(
        events.map((ev) =>
          ev.id === editingEvent.id
            ? { ...editingEvent, ...newEvent, date: selectedDate }
            : ev
        )
      );
    } else {
      setEvents([
        ...events,
        {
          id: Date.now(),
          ...newEvent,
          date: selectedDate,
        },
      ]);
    }
    setShowForm(false);
    setNewEvent({ title: "", time: "", type: "", description: "", location: "" });
    setEditingEvent(null);
  };

  const handleDeleteEvent = (id) => {
    setEvents(events.filter((ev) => ev.id !== id));
  };

  // Filtering
  const filteredEvents = events.filter(
    (event) => filter === "All" || event.type === filter
  );

  const eventsForDate = filteredEvents.filter(
    (event) => event.date.toDateString() === selectedDate.toDateString()
  );

  // Group events by Morning / Afternoon / Evening
  const groupEvents = (eventsList) => {
    const groups = { Morning: [], Afternoon: [], Evening: [] };
    eventsList.forEach((event) => {
      let hour = 12;
      if (event.time && event.time !== "All Day") {
        const timeStr = event.time.split("-")[0].trim(); // start time
        const [rawHour, rawMin] = timeStr.split(":");
        hour = parseInt(rawHour);
        if (timeStr.includes("PM") && hour !== 12) hour += 12;
      }

      if (hour < 12) groups.Morning.push(event);
      else if (hour < 18) groups.Afternoon.push(event);
      else groups.Evening.push(event);
    });
    return groups;
  };

  const groupedEvents = groupEvents(eventsForDate);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.logo}>GirlHype</h1>
        <h2 className={styles.pageTitle}>School Events</h2>
      </header>

      {/* Featured Event */}
      {featuredEvent && (
        <div className={styles.featuredBanner}>
          <h2>🔥 Featured Event: {featuredEvent.title}</h2>
          <p>
            {featuredEvent.date.toDateString()} • {featuredEvent.time}
          </p>
          <p>{featuredEvent.description}</p>
          <p className={styles.countdown}>⏳ Starts in: {timeLeft}</p>
          <button className={styles.registerButton}>Register Now</button>
        </div>
      )}

      {/* Filters */}
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
        {/* Calendar on left */}
        <div className={styles.calendarSection}>
          <Calendar
            onChange={setSelectedDate}
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

        {/* Events grouped by time */}
        <div className={styles.eventsSection}>
          <h3 className={styles.sectionTitle}>
            Events on {selectedDate.toDateString()}
          </h3>
          {eventsForDate.length > 0 ? (
            <>
              {Object.entries(groupedEvents).map(([period, evts]) =>
                evts.length > 0 ? (
                  <div key={period} className={styles.timeGroup}>
                    <h4 className={styles.timeGroupTitle}>{period}</h4>
                    {evts.map((event) => (
                      <div key={event.id} className={styles.eventCard}>
                        <h4>{event.title}</h4>
                        <p className={styles.eventDate}>🕒 {event.time}</p>
                        <p>{event.description}</p>
                        <p>📍 {event.location}</p>
                        <div className={styles.cardActions}>
                          <button
                            className={styles.editButton}
                            onClick={() => {
                              setEditingEvent(event);
                              setNewEvent({
                                title: event.title,
                                time: event.time,
                                type: event.type,
                                description: event.description,
                                location: event.location,
                              });
                              setSelectedDate(new Date(event.date));
                              setShowForm(true);
                            }}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className={styles.deleteButton}
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null
              )}
            </>
          ) : (
            <p className={styles.emptyText}>No events for this date</p>
          )}
        </div>
      </div>

      {/* Event Form */}
      {showForm && (
        <div className={styles.eventForm}>
          <h3>{editingEvent ? "Edit Event" : "Add Event"}</h3>
          <input
            type="text"
            placeholder="Title"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
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
            <button onClick={() => setShowForm(false)}>❌ Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
