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
    startDate: "",
    endDate: "",
    description: "",
    backgroundColor: "#007bff",
    borderColor: "#007bff",
    color: "#fff",
    specialization: "", // أضف هذا السطر

  });

  const doctorToken = localStorage.getItem("doctorToken");
  
  useEffect(() => {
    axios.get("http://localhost:3000/api/v1/User/doctors/Shedule", {
      headers: { Authorization: `Bearer ${doctorToken}` },
    })
      .then((response) => {
        const updatedEvents = response.data.allshedule.map((event) => ({
          ...event,
          start: event.startDate,
          end: event.endDate,
          textColor: "#fff",
          display: "block",
        }));
        setEvents(updatedEvents);
      })
      .catch((error) => console.error("Error fetching events:", error));
  }, [doctorToken]);

  const handleSelect = (selectionInfo) => {
    const startOfDay = new Date(selectionInfo.startStr);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectionInfo.startStr);
    endOfDay.setHours(23, 59, 59, 999);

    setNewEvent({
      title: "",
      startDate: startOfDay.toISOString(),
      endDate: endOfDay.toISOString(),
      description: "",
      backgroundColor: "#007bff",
      borderColor: "#007bff",
      color: "#fff",
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
    if (!newEvent.title || !newEvent.startDate || !newEvent.endDate) {
      alert("Please fill in all fields!");
      return;
    }

    axios.post("http://localhost:3000/api/v1/User/doctors/addShedule", newEvent, {
      headers: { Authorization: `Bearer ${doctorToken}` },
    })
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
            <h5 style={{ backgroundColor: newEvent.backgroundColor, color: "#fff", padding: "10px" }}>Add New Event</h5>
            <input
              type="text"
              placeholder="Event Title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            />
            <select
            value={newEvent.specialization}
            onChange={(e) => setNewEvent({ ...newEvent, specialization: e.target.value })}
            className="specialization-select"
          >
          <option value="">-- Select Specialization --</option>
          <option value="ORL">ORL</option>
          <option value="Ophthalmology">Ophthalmology</option>
          </select>

            <div className="date-container">
              <input
                type="datetime-local"
                value={newEvent.startDate}
                onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
              />
              <input
                type="datetime-local"
                value={newEvent.endDate}
                onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
              />
            </div>
            <textarea
              placeholder="Description"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            />
            <input
              type="color"
              value={newEvent.backgroundColor}
              onChange={(e) => setNewEvent({ ...newEvent, backgroundColor: e.target.value, borderColor: e.target.value })}
            />
            <button className="save-btn" onClick={handleSaveEvent}>Save Event</button>
          </div>
        ) : selectedEvent ? (
          <div className="modal-content" style={{ backgroundColor: selectedEvent.color }}>
            <h2 style={{ backgroundColor: selectedEvent.color, color: "#fff", padding: "10px" }}>{selectedEvent.title}</h2>
            <p><strong style={{color: "beige"}}>Start:</strong> {selectedEvent.start}</p>
            <p><strong style={{color: "beige"}}>End:</strong> {selectedEvent.end}</p>
            <p><strong style={{color: "beige"}}>Description:</strong> {selectedEvent.description}</p>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default MyCalendar;
