import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Modal from "react-modal";
import axios from "axios";
import "./myCalendar.css";

Modal.setAppElement("#root");

const SecretaryShedule = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);

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
          specialization: event.specialization, // ✅ إضافة التخصص هنا
        }));
        setEvents(updatedEvents);
      })
      .catch((error) => console.error("Error fetching events:", error));
  }, [doctorToken]);

  const handleEventClick = (clickInfo) => {
    setSelectedEvent({
      title: clickInfo.event.title,
      start: new Date(clickInfo.event.start).toLocaleString(),
      end: new Date(clickInfo.event.end).toLocaleString(),
      description: clickInfo.event.extendedProps?.description || "No description available",
      color: clickInfo.event.backgroundColor || "#007bff",
        specialization: clickInfo.event.extendedProps?.specialization || "Not specified", // ✅
    });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="calendar-container">
      {/* 🔒 إلغاء تحديد التاريخ */}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={false}
        events={events}
        eventClick={handleEventClick}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridDay",
          
        }}
      />

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal" overlayClassName="modal-overlay">
        {selectedEvent && (
          <div className="modal-content" style={{ backgroundColor: selectedEvent.color }}>
            <h2 style={{ backgroundColor: selectedEvent.color, color: "#fff", padding: "10px" }}>{selectedEvent.title}</h2>
            <p><strong style={{color: "beige"}}>Start:</strong> {selectedEvent.start}</p>
            <p><strong style={{color: "beige"}}>End:</strong> {selectedEvent.end}</p>
            <p><strong style={{color: "beige"}}>Description:</strong> {selectedEvent.description}</p>
            <p><strong style={{color: "beige"}}>Specialization:</strong> {selectedEvent.specialization}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SecretaryShedule;
