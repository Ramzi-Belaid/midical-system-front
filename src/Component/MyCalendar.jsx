import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Modal from "react-modal";
import axios from "axios";
import "./myCalendar.css";

Modal.setAppElement("#root");

const MyCalendar = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);

  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
    description: "",
    color: "#007bff",
  });

  useEffect(() => {
    axios.get("http://localhost:5000/events")
      .then((response) => {
        const updatedEvents = response.data.map((event) => ({
          ...event,
          backgroundColor: event.color || "#007bff",
          borderColor: event.color || "#007bff",
          textColor: "#fff",
        }));
        setEvents(updatedEvents);
      })
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  const handleSelect = (selectionInfo) => {
    setNewEvent({
      title: "",
      start: selectionInfo.startStr,
      end: selectionInfo.endStr,
      description: "",
      color: "#007bff",
    });
    setIsAddingEvent(true);
    setModalIsOpen(true);
  };

  const handleEventClick = (clickInfo) => {
    setSelectedEvent({
      title: clickInfo.event.title,
      start: new Date(clickInfo.event.start).toLocaleString(),
      end: new Date(clickInfo.event.end).toLocaleString(),
      description: clickInfo.event.extendedProps?.description || "No description available",
      color: clickInfo.event.backgroundColor || "#007bff",
    });
    setIsAddingEvent(false);
    setModalIsOpen(true);
  };

  const handleSaveEvent = () => {
    if (!newEvent.title || !newEvent.start || !newEvent.end) {
      alert("Please fill in all fields!");
      return;
    }

    const eventToAdd = {
      title: newEvent.title,
      start: newEvent.start,
      end: newEvent.end,
      description: newEvent.description,
      color: newEvent.color,
      backgroundColor: newEvent.color,
      borderColor: newEvent.color,
      textColor: "#fff",
    };

    axios.post("http://localhost:5000/events", eventToAdd)
      .then((response) => {
        setEvents([...events, response.data]);
        closeModal();
      })
      .catch((error) => console.error("Error saving event:", error));
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedEvent(null);
    setIsAddingEvent(false);
  };

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        selectMirror={true}
        select={handleSelect}
        events={events}
        eventClick={handleEventClick}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridDay",
        }}
      />

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal" overlayClassName="modal-overlay">
        {isAddingEvent ? (
          <div className="modal-content">
            <h5>Add New Event</h5>
            <input
              type="text"
              placeholder="Event Title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            />
            <div className="date-container">
              <input
                type="datetime-local"
                value={newEvent.start}
                onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
              />
              <input
                type="datetime-local"
                value={newEvent.end}
                onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
              />
            </div>
            <textarea
              placeholder="Description"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            />
            <input
              type="color"
              value={newEvent.color}
              onChange={(e) => setNewEvent({ ...newEvent, color: e.target.value })}
            />
            <button className="save-btn" onClick={handleSaveEvent}>Save Event</button>
          </div>
        ) : selectedEvent ? (
          <div className="modal-content" style={{ backgroundColor: selectedEvent.color }}>
            <h2>{selectedEvent.title}</h2>
            <p><strong>Start:</strong> {selectedEvent.start}</p>
            <p><strong>End:</strong> {selectedEvent.end}</p>
            <p><strong>Description:</strong> {selectedEvent.description}</p>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default MyCalendar;
