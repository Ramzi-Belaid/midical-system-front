import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
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
          backgroundColor: event.backgroundColor || event.color,
          borderColor: event.borderColor || event.color,
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

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedEvent(null);
    setIsAddingEvent(false);
  };

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
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
            <button className="save-btn">Save Event</button>
          </div>
        ) : selectedEvent ? (
          <div className="modal-content">
            <button className="close-btn" onClick={closeModal}>&times;</button>
            <h2>{selectedEvent.title}</h2>
            <p><strong>Start:</strong> {selectedEvent.start}</p>
            <p><strong>End:</strong> {selectedEvent.end}</p>
            <p><strong>Description:</strong> {selectedEvent.description}</p>
            <button className="save-btn" onClick={closeModal}>Close</button>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default MyCalendar;
