"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import "./adminDoctor.css"

function AdminDoctor() {
  const [doctors, setDoctors] = useState([])
  const [newDoctor, setNewDoctor] = useState({
    fullName: "",
    specialization: "",
    location: "",
    Hospital: "",
    Short_Bio: "",
    email: "",
    phone: "",
    yearsOfExperience: "",
    password: "",
    services: [{ service: "", price: "" }],
    Online: "",
  })
  const [editingDoctor, setEditingDoctor] = useState(null)
  const [isOverlayOpen, setIsOverlayOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [popupMenu, setPopupMenu] = useState({ visible: false, x: 0, y: 0, doctorId: null })

  const adminToken = localStorage.getItem("adminToken")

  useEffect(() => {
    if (!adminToken) {
      console.error("No admin token found!")
      return
    }

    axios
      .get("http://localhost:3000/api/v1/Admin/doctors", {
        headers: { Authorization: `Bearer ${adminToken}` },
      })
      .then((response) => {
        setDoctors(response.data.allDr || [])
      })
      .catch((error) => console.error("Error fetching doctors:", error))
  }, [adminToken])

  // Handle row click to show popup menu
  const handleRowClick = (e, doctorId) => {
    e.preventDefault()

    // Close menu if clicking the same row
    if (popupMenu.visible && popupMenu.doctorId === doctorId) {
      setPopupMenu({ visible: false, x: 0, y: 0, doctorId: null })
      return
    }

    // Calculate position for popup menu - centered below the row
    const rect = e.currentTarget.getBoundingClientRect()
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    setPopupMenu({
      visible: true,
      x: rect.left + rect.width / 2, // Center horizontally on the row
      y: rect.bottom + scrollTop + 10, // Position below the row with 10px spacing
      doctorId: doctorId,
    })
  }

  // Close popup menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupMenu.visible) {
        const popupElement = document.getElementById("popup-menu")
        if (popupElement && !popupElement.contains(e.target)) {
          setPopupMenu({ visible: false, x: 0, y: 0, doctorId: null })
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [popupMenu])

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      axios
        .delete(`http://localhost:3000/api/v1/Admin/doctors/${id}`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        })
        .then(() => {
          setDoctors(doctors.filter((doctor) => doctor._id !== id))
          setPopupMenu({ visible: false, x: 0, y: 0, doctorId: null })
        })
        .catch((error) => console.error("Error deleting doctor:", error))
    }
  }

  const handleAddDoctor = (e) => {
    e.preventDefault()

    axios
      .post("http://localhost:3000/api/v1/Admin/doctors/addDr", newDoctor, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setDoctors([...doctors, response.data])
        setNewDoctor({
          fullName: "",
          specialization: "",
          location: "",
          Hospital: "",
          Short_Bio: "",
          email: "",
          phone: "",
          yearsOfExperience: "",
          password: "",
          services: [{ service: "", price: "" }],
          Online: "",
        })
        setIsOverlayOpen(false)
      })
      .catch((error) => console.error("Error adding doctor:", error))
  }

  // Function to handle editing
  const handleEditDoctor = (e) => {
    e.preventDefault()

    axios
      .patch(`http://localhost:3000/api/v1/Admin/doctors/${editingDoctor._id}`, editingDoctor, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        // Update the doctor in the list
        setDoctors(doctors.map((doc) => (doc._id === editingDoctor._id ? response.data : doc)))
        setEditingDoctor(null)
        setIsOverlayOpen(false)
        setIsEditMode(false)
      })
      .catch((error) => console.error("Error updating doctor:", error))
  }

  // Function to open edit mode
  const openEditMode = (doctor) => {
    setEditingDoctor({ ...doctor })
    setIsEditMode(true)
    setIsOverlayOpen(true)
    setPopupMenu({ visible: false, x: 0, y: 0, doctorId: null })
  }

  // Function to open add mode
  const openAddMode = () => {
    setNewDoctor({
      fullName: "",
      specialization: "",
      location: "",
      Hospital: "",
      Short_Bio: "",
      email: "",
      phone: "",
      yearsOfExperience: "",
      password: "",
      services: [{ service: "", price: "" }],
      Online: "",
    })
    setIsEditMode(false)
    setIsOverlayOpen(true)
  }

  // Function to close overlay
  const closeOverlay = () => {
    setIsOverlayOpen(false)
    setIsEditMode(false)
    setEditingDoctor(null)
    setNewDoctor({
      fullName: "",
      specialization: "",
      location: "",
      Hospital: "",
      Short_Bio: "",
      email: "",
      phone: "",
      yearsOfExperience: "",
      password: "",
      services: [{ service: "", price: "" }],
      Online: "",
    })
  }

  const handleServiceChange = (index, key, value) => {
    if (isEditMode) {
      const updatedServices = [...editingDoctor.services]
      updatedServices[index][key] = value
      setEditingDoctor({ ...editingDoctor, services: updatedServices })
    } else {
      const updatedServices = [...newDoctor.services]
      updatedServices[index][key] = value
      setNewDoctor({ ...newDoctor, services: updatedServices })
    }
  }

  const addService = () => {
    if (isEditMode) {
      setEditingDoctor({
        ...editingDoctor,
        services: [...editingDoctor.services, { service: "", price: "" }],
      })
    } else {
      setNewDoctor({
        ...newDoctor,
        services: [...newDoctor.services, { service: "", price: "" }],
      })
    }
  }

  const currentDoctor = isEditMode ? editingDoctor : newDoctor
  const currentServices = currentDoctor?.services || [{ service: "", price: "" }]

  return (
    <div className="admin-doctor-container">
      <div className="add-btn-container">
        <h5>Doctors Management</h5>
        <button className="add-btnN" onClick={openAddMode}>
          Add Doctor
        </button>
      </div>

      <table className="doctors-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Specialization</th>
            <th>Email</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => (
            <tr
              key={doctor._id}
              onClick={(e) => handleRowClick(e, doctor._id)}
              className={popupMenu.doctorId === doctor._id ? "selected-row" : ""}
            >
              <td>{doctor.fullName}</td>
              <td>{doctor.specialization}</td>
              <td>{doctor.email}</td>
              <td>{doctor.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Popup Menu */}
      {popupMenu.visible && (
        <div
          id="popup-menu"
          className="popup-menu"
          style={{
            position: "absolute",
            top: `${popupMenu.y}px`,
            left: `${popupMenu.x}px`,
          }}
        >
          <div
            className="popup-menu-item edit"
            onClick={() => {
              const doctor = doctors.find((doc) => doc._id === popupMenu.doctorId)
              if (doctor) openEditMode(doctor)
            }}
          >
            <span className="popup-icon"></span> Edit Doctor
          </div>
          <div className="popup-menu-item delete" onClick={() => handleDelete(popupMenu.doctorId)}>
            <span className="popup-icon"></span> Delete Doctor
          </div>
        </div>
      )}

      {isOverlayOpen && (
        <div className="overlay-container" onClick={closeOverlay}>
          <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
            <h2>{isEditMode ? "Edit Doctor" : "Add New Doctor"}</h2>
            <form onSubmit={isEditMode ? handleEditDoctor : handleAddDoctor} className="overlay-form">
              <input
                type="text"
                placeholder="Full Name"
                value={currentDoctor.fullName}
                onChange={(e) => {
                  if (isEditMode) {
                    setEditingDoctor({ ...editingDoctor, fullName: e.target.value })
                  } else {
                    setNewDoctor({ ...newDoctor, fullName: e.target.value })
                  }
                }}
                required
              />
              <input
                type="text"
                placeholder="Specialization"
                value={currentDoctor.specialization}
                onChange={(e) => {
                  if (isEditMode) {
                    setEditingDoctor({ ...editingDoctor, specialization: e.target.value })
                  } else {
                    setNewDoctor({ ...newDoctor, specialization: e.target.value })
                  }
                }}
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={currentDoctor.location}
                onChange={(e) => {
                  if (isEditMode) {
                    setEditingDoctor({ ...editingDoctor, location: e.target.value })
                  } else {
                    setNewDoctor({ ...newDoctor, location: e.target.value })
                  }
                }}
                required
              />
              <input
                type="text"
                placeholder="Hospital"
                value={currentDoctor.Hospital}
                onChange={(e) => {
                  if (isEditMode) {
                    setEditingDoctor({ ...editingDoctor, Hospital: e.target.value })
                  } else {
                    setNewDoctor({ ...newDoctor, Hospital: e.target.value })
                  }
                }}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={currentDoctor.email}
                onChange={(e) => {
                  if (isEditMode) {
                    setEditingDoctor({ ...editingDoctor, email: e.target.value })
                  } else {
                    setNewDoctor({ ...newDoctor, email: e.target.value })
                  }
                }}
                required
              />
              <input
                type="text"
                placeholder="Phone"
                value={currentDoctor.phone}
                onChange={(e) => {
                  if (isEditMode) {
                    setEditingDoctor({ ...editingDoctor, phone: e.target.value })
                  } else {
                    setNewDoctor({ ...newDoctor, phone: e.target.value })
                  }
                }}
                required
              />
              <input
                type="number"
                placeholder="Experience (years)"
                value={currentDoctor.yearsOfExperience}
                onChange={(e) => {
                  if (isEditMode) {
                    setEditingDoctor({ ...editingDoctor, yearsOfExperience: e.target.value })
                  } else {
                    setNewDoctor({ ...newDoctor, yearsOfExperience: e.target.value })
                  }
                }}
                required
              />
              {!isEditMode && (
                <input
                  type="password"
                  placeholder="Password"
                  value={newDoctor.password}
                  onChange={(e) => setNewDoctor({ ...newDoctor, password: e.target.value })}
                  required
                />
              )}
              <input
                type="text"
                placeholder="Short Bio"
                value={currentDoctor.Short_Bio}
                onChange={(e) => {
                  if (isEditMode) {
                    setEditingDoctor({ ...editingDoctor, Short_Bio: e.target.value })
                  } else {
                    setNewDoctor({ ...newDoctor, Short_Bio: e.target.value })
                  }
                }}
                required
              />
              <input
                type="text"
                placeholder="Online Time (e.g., 8/24)"
                value={currentDoctor.Online}
                onChange={(e) => {
                  if (isEditMode) {
                    setEditingDoctor({ ...editingDoctor, Online: e.target.value })
                  } else {
                    setNewDoctor({ ...newDoctor, Online: e.target.value })
                  }
                }}
                required
              />

              <div className="services-section">
                <h5>Services:</h5>
                {currentServices.map((service, index) => (
                  <div key={index} className="service-row">
                    <input
                      type="text"
                      placeholder="Service"
                      value={service.service}
                      onChange={(e) => handleServiceChange(index, "service", e.target.value)}
                      required
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={service.price}
                      onChange={(e) => handleServiceChange(index, "price", e.target.value)}
                      required
                    />
                  </div>
                ))}
                <button type="button" className="add-service-btn" onClick={addService}>
                  Add Service
                </button>
              </div>

              <div className="form-buttons">
                <button type="button" className="cancel-button" onClick={closeOverlay}>
                  Cancel
                </button>
                <button type="submit" className="overlay-button">
                  {isEditMode ? "Update Doctor" : "Add Doctor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDoctor
