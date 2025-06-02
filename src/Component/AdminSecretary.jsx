"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "./adminSecretary.css"

function AdminSecretary() {
  const [secretaries, setSecretaries] = useState([])
  const [newSecretary, setNewSecretary] = useState({
    fullName: "",
    email: "",
    phone: "",
    schedule: "",
    password: "",
  })
  const [editingSecretary, setEditingSecretary] = useState(null)
  const [isOverlayOpen, setIsOverlayOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [popupMenu, setPopupMenu] = useState({ visible: false, x: 0, y: 0, secretaryId: null })

  // Get the token from localStorage
  const adminToken = localStorage.getItem("adminToken")

  useEffect(() => {
    if (!adminToken) {
      console.error("No admin token found!")
      return
    }

    axios
      .get("http://localhost:3000/api/v1/Admin/Secrtary", {
        headers: { Authorization: `Bearer ${adminToken}` },
      })
      .then((response) => {
        console.log("Fetched secretaries:", response.data.allSC)
        setSecretaries(response.data.allSC)
      })
      .catch((error) => console.error("Error fetching secretaries:", error))
  }, [adminToken])

  // Handle row click to show popup menu
  const handleRowClick = (e, secretaryId) => {
    e.preventDefault()

    // Close menu if clicking the same row
    if (popupMenu.visible && popupMenu.secretaryId === secretaryId) {
      setPopupMenu({ visible: false, x: 0, y: 0, secretaryId: null })
      return
    }

    // Calculate position for popup menu - centered below the row
    const rect = e.currentTarget.getBoundingClientRect()
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    setPopupMenu({
      visible: true,
      x: rect.left + rect.width / 2, // Center horizontally on the row
      y: rect.bottom + scrollTop + 10, // Position below the row with 10px spacing
      secretaryId: secretaryId,
    })
  }

  // Close popup menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupMenu.visible) {
        const popupElement = document.getElementById("popup-menu")
        if (popupElement && !popupElement.contains(e.target)) {
          setPopupMenu({ visible: false, x: 0, y: 0, secretaryId: null })
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [popupMenu])

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this secretary?")) {
      axios
        .delete(`http://localhost:3000/api/v1/Admin/Secrtary/${id}`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        })
        .then(() => {
          setSecretaries(secretaries.filter((sec) => sec._id !== id))
          setPopupMenu({ visible: false, x: 0, y: 0, secretaryId: null })
        })
        .catch((error) => console.error("Error deleting secretary:", error))
    }
  }

  const handleAddSecretary = (e) => {
    e.preventDefault()

    axios
      .post("http://localhost:3000/api/v1/Admin/Secrtary/addSC", newSecretary, {
        headers: { Authorization: `Bearer ${adminToken}` },
      })
      .then((response) => {
        setSecretaries([...secretaries, response.data])
        setNewSecretary({ fullName: "", email: "", phone: "", schedule: "", password: "" })
        setIsOverlayOpen(false)
      })
      .catch((error) => console.error("Error adding secretary:", error))
  }

  // Function to handle editing
  const handleEditSecretary = (e) => {
    e.preventDefault()

    axios
      .patch(`http://localhost:3000/api/v1/Admin/Secrtary/${editingSecretary._id}`, editingSecretary, {
        headers: { Authorization: `Bearer ${adminToken}` },
      })
      .then((response) => {
        // Update the secretary in the list
        setSecretaries(secretaries.map((sec) => (sec._id === editingSecretary._id ? response.data : sec)))
        setEditingSecretary(null)
        setIsOverlayOpen(false)
        setIsEditMode(false)
      })
      .catch((error) => console.error("Error updating secretary:", error))
  }

  // Function to open edit mode
  const openEditMode = (secretary) => {
    setEditingSecretary({ ...secretary })
    setIsEditMode(true)
    setIsOverlayOpen(true)
    setPopupMenu({ visible: false, x: 0, y: 0, secretaryId: null })
  }

  // Function to open add mode
  const openAddMode = () => {
    setNewSecretary({ fullName: "", email: "", phone: "", schedule: "", password: "" })
    setIsEditMode(false)
    setIsOverlayOpen(true)
  }

  // Function to close overlay
  const closeOverlay = () => {
    setIsOverlayOpen(false)
    setIsEditMode(false)
    setEditingSecretary(null)
    setNewSecretary({ fullName: "", email: "", phone: "", schedule: "", password: "" })
  }

  return (
    <div className="admin-secretary">
      <div className="add-btn-container">
        <h5>Secretaries Management</h5>
        <button className="add-btnN" onClick={openAddMode}>
          Add Secretary
        </button>
      </div>

      <table className="secretary-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Schedule</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(secretaries) && secretaries.length > 0 ? (
            secretaries.map((sec) => (
              <tr
                key={sec._id}
                onClick={(e) => handleRowClick(e, sec._id)}
                className={popupMenu.secretaryId === sec._id ? "selected-row" : ""}
              >
                <td>{sec.fullName}</td>
                <td>{sec.email}</td>
                <td>{sec.phone}</td>
                <td>{sec.schedule}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No secretaries found</td>
            </tr>
          )}
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
              const secretary = secretaries.find((sec) => sec._id === popupMenu.secretaryId)
              if (secretary) openEditMode(secretary)
            }}
          >
            <span className="popup-icon"></span> Edit Secretary
          </div>
          <div className="popup-menu-item delete" onClick={() => handleDelete(popupMenu.secretaryId)}>
            <span className="popup-icon"></span> Delete Secretary
          </div>
        </div>
      )}

      {isOverlayOpen && (
        <div className="overlay-container" onClick={closeOverlay}>
          <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
            <h2>{isEditMode ? "Edit Secretary" : "Add New Secretary"}</h2>
            <form onSubmit={isEditMode ? handleEditSecretary : handleAddSecretary} className="overlay-form">
              <input
                type="text"
                placeholder="Full Name"
                value={isEditMode ? editingSecretary?.fullName || "" : newSecretary.fullName}
                onChange={(e) => {
                  if (isEditMode) {
                    setEditingSecretary({ ...editingSecretary, fullName: e.target.value })
                  } else {
                    setNewSecretary({ ...newSecretary, fullName: e.target.value })
                  }
                }}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={isEditMode ? editingSecretary?.email || "" : newSecretary.email}
                onChange={(e) => {
                  if (isEditMode) {
                    setEditingSecretary({ ...editingSecretary, email: e.target.value })
                  } else {
                    setNewSecretary({ ...newSecretary, email: e.target.value })
                  }
                }}
                required
              />
              <input
                type="text"
                placeholder="Phone"
                value={isEditMode ? editingSecretary?.phone || "" : newSecretary.phone}
                onChange={(e) => {
                  if (isEditMode) {
                    setEditingSecretary({ ...editingSecretary, phone: e.target.value })
                  } else {
                    setNewSecretary({ ...newSecretary, phone: e.target.value })
                  }
                }}
                required
              />
              <input
                type="text"
                placeholder="Schedule"
                value={isEditMode ? editingSecretary?.schedule || "" : newSecretary.schedule}
                onChange={(e) => {
                  if (isEditMode) {
                    setEditingSecretary({ ...editingSecretary, schedule: e.target.value })
                  } else {
                    setNewSecretary({ ...newSecretary, schedule: e.target.value })
                  }
                }}
                required
              />
              {!isEditMode && (
                <input
                  type="password"
                  placeholder="Password"
                  value={newSecretary.password}
                  onChange={(e) => setNewSecretary({ ...newSecretary, password: e.target.value })}
                  required
                />
              )}
              <div className="form-buttons">
                <button type="submit" className="add-btnN">
                  {isEditMode ? "Update Secretary" : "Add Secretary"}
                </button>
                <button type="button" className="cancel-button" onClick={closeOverlay}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminSecretary
