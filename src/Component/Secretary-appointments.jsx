"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import "./secretaryappointments.css"
import { FaUserFriends, FaChevronDown, FaPlus, FaEdit, FaTrash } from "react-icons/fa"

function Secretaryappointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [timeFrame, setTimeFrame] = useState("Day")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState(null)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 })

  const [newAppointment, setNewAppointment] = useState({
    name: "",
    specialization: "",
    time: "",
    date: "",
  })

  const [editAppointment, setEditAppointment] = useState({
    name: "",
    specialization: "",
    time: "",
    date: "",
  })

  useEffect(() => {
    fetchAppointments()
  }, [])

  useEffect(() => {
    const handleClickOutside = () => {
      setSelectedAppointment(null)
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  const fetchAppointments = () => {
    setLoading(true)
    const token = localStorage.getItem("secretaryToken")

    axios
      .get("http://localhost:3000/api/v1/User/Secratry/Appointments", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Fetched Appointments:", response.data)
        setAppointments(Array.isArray(response.data.allAppointments) ? response.data.allAppointments : [])
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching appointments:", error)
        setAppointments([])
        setLoading(false)
      })
  }

  const filterAppointmentsByTimeFrame = () => {
    const today = new Date()
    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date)
      if (timeFrame === "Day") {
        return appointmentDate.toDateString() === today.toDateString()
      } else if (timeFrame === "Week") {
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay())
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6)
        return appointmentDate >= startOfWeek && appointmentDate <= endOfWeek
      } else if (timeFrame === "Year") {
        return appointmentDate.getFullYear() === today.getFullYear()
      }
      return true
    })
  }

  const handleAddAppointment = () => {
    if (!newAppointment.name || !newAppointment.specialization || !newAppointment.time || !newAppointment.date) {
      alert("Please fill in all required fields.")
      return
    }

    const token = localStorage.getItem("secretaryToken")

    axios
      .post("http://localhost:3000/api/v1/User/Secratry/addAppointments", newAppointment, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setShowModal(false)
        setNewAppointment({ name: "", specialization: "", time: "", date: "" })
        fetchAppointments() // Refresh the list
        alert("Appointment added successfully")
      })
      .catch((error) => {
        console.error("Error adding appointment:", error)
        alert("Error adding appointment")
      })
  }

  const handleDeleteAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) {
      return
    }

    const token = localStorage.getItem("secretaryToken")
    if (!token) {
      alert("Token not found")
      return
    }

    try {
      await axios.delete(`http://localhost:3000/api/v1/User/Secratry/Appointments/${appointmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      alert("Appointment deleted successfully")
      fetchAppointments() // Refresh the list
      setSelectedAppointment(null)
    } catch (error) {
      console.error("Error deleting appointment:", error)
      alert("Error deleting appointment")
    }
  }

  const handleEditAppointment = (appointment) => {
    setEditingAppointment(appointment)
    setEditAppointment({
      name: appointment.name,
      specialization: appointment.specialization,
      time: appointment.time,
      date: appointment.date,
    })
    setShowEditModal(true)
    setSelectedAppointment(null)
  }

  const handleUpdateAppointment = async () => {
    if (!editAppointment.name || !editAppointment.specialization || !editAppointment.time || !editAppointment.date) {
      alert("Please fill in all required fields.")
      return
    }

    const token = localStorage.getItem("secretaryToken")
    if (!token) {
      alert("Token not found")
      return
    }

    try {
      await axios.patch(
        `http://localhost:3000/api/v1/User/Secratry/Appointments/${editingAppointment._id}`,
        editAppointment,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      alert("Appointment updated successfully")
      fetchAppointments() // Refresh the list
      setShowEditModal(false)
      setEditingAppointment(null)
    } catch (error) {
      console.error("Error updating appointment:", error)
      alert("Error updating appointment")
    }
  }

  const handleRowClick = (event, appointment) => {
    event.stopPropagation()
    const rect = event.currentTarget.getBoundingClientRect()
    setDropdownPosition({
      x: event.clientX,
      y: rect.bottom + window.scrollY,
    })
    setSelectedAppointment(selectedAppointment === appointment._id ? null : appointment._id)
  }

  const filteredAppointments = filterAppointmentsByTimeFrame().filter((appointment) =>
    appointment.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="appointments-main">
      <div className="title-app">
        <h5>List of Appointments</h5>
        <button className="add-button" onClick={() => setShowModal(true)}>
          <FaPlus /> Add Appointment
        </button>

        <div className="time-selector">
          <h5 className="time-selector-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
            {timeFrame} <FaChevronDown />
          </h5>
        </div>

        {dropdownOpen && (
          <div className="time-dropDown">
            {["Day", "Week", "Year"].map((frame) => (
              <button
                key={frame}
                className={`time-optionn ${timeFrame === frame ? "active" : ""}`}
                onClick={() => {
                  setTimeFrame(frame)
                  setDropdownOpen(false)
                }}
              >
                {frame}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          <div className="top-section">
            <h5>
              <FaUserFriends /> Total Appointments: {filteredAppointments.length}
            </h5>
            <input
              type="text"
              className="search-bar"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="taab">
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Specialization</th>
                  <th>Time</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appointment, index) => (
                  <tr
                    key={index}
                    className={`appointment-row ${selectedAppointment === appointment._id ? "selected" : ""}`}
                    onClick={(e) => handleRowClick(e, appointment)}
                  >
                    <td>{index + 1}</td>
                    <td>{appointment.name}</td>
                    <td>{appointment.specialization}</td>
                    <td>{appointment.time}</td>
                    <td>{new Date(appointment.date).toLocaleDateString() || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Appointment Action Dropdown */}
          {selectedAppointment && (
            <div
              className="appointment-action-dropdown"
              style={{
                position: "fixed",
                left: dropdownPosition.x,
                top: dropdownPosition.y,
                zIndex: 1000,
              }}
            >
              <button
                className="dropdown-action-item edit-action"
                onClick={() => {
                  const appointment = appointments.find((a) => a._id === selectedAppointment)
                  handleEditAppointment(appointment)
                }}
              >
                <FaEdit /> Edit Appointment
              </button>
              <button
                className="dropdown-action-item delete-action"
                onClick={() => handleDeleteAppointment(selectedAppointment)}
              >
                <FaTrash /> Delete Appointment
              </button>
            </div>
          )}
        </>
      )}

      {/* Add Appointment Modal */}
      {showModal && (
        <div className="overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add New Appointment</h3>

            <select
              className="select-field"
              value={newAppointment.specialization}
              onChange={(e) => setNewAppointment({ ...newAppointment, specialization: e.target.value })}
            >
              <option value="">Select Specialization</option>
              <option value="ORL">ORL</option>
              <option value="Ophthalmology">Ophthalmology</option>
            </select>

            <input
              type="text"
              className="input-field"
              placeholder="Name"
              value={newAppointment.name}
              onChange={(e) => setNewAppointment({ ...newAppointment, name: e.target.value })}
            />

            <input
              type="time"
              className="input-field"
              placeholder="Time"
              value={newAppointment.time}
              onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
            />

            <input
              type="date"
              className="input-field"
              value={newAppointment.date}
              onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
            />

            <button className="save-button" onClick={handleAddAppointment}>
              Save
            </button>
          </div>
        </div>
      )}

      {/* Edit Appointment Modal */}
      {showEditModal && (
        <div className="overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Appointment</h3>

            <select
              className="select-field"
              value={editAppointment.specialization}
              onChange={(e) => setEditAppointment({ ...editAppointment, specialization: e.target.value })}
            >
              <option value="">Select Specialization</option>
              <option value="ORL">ORL</option>
              <option value="Ophthalmology">Ophthalmology</option>
            </select>

            <input
              type="text"
              className="input-field"
              placeholder="Name"
              value={editAppointment.name}
              onChange={(e) => setEditAppointment({ ...editAppointment, name: e.target.value })}
            />

            <input
              type="time"
              className="input-field"
              placeholder="Time"
              value={editAppointment.time}
              onChange={(e) => setEditAppointment({ ...editAppointment, time: e.target.value })}
            />

            <input
              type="date"
              className="input-field"
              value={editAppointment.date}
              onChange={(e) => setEditAppointment({ ...editAppointment, date: e.target.value })}
            />

            <button className="save-button" onClick={handleUpdateAppointment}>
              Update Appointment
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Secretaryappointments
