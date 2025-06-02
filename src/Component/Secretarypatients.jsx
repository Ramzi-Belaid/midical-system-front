"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import "./secretarypatients.css"
import { FaUserFriends, FaChevronDown, FaPlus, FaEdit, FaTrash } from "react-icons/fa"

function Secretarypatients() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [timeFrame, setTimeFrame] = useState("Day")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingPatient, setEditingPatient] = useState(null)
  const [sallesBySpec, setSallesBySpec] = useState({})
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 })

  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    email: "",
    gender: "Male",
    contactInfo: "",
    dateofDay: "",
    amount: "",
    specialization: "ORL",
    salle: "",
  })

  const [editPatient, setEditPatient] = useState({
    name: "",
    age: "",
    email: "",
    gender: "Male",
    contactInfo: "",
    dateofDay: "",
    amount: "",
    specialization: "ORL",
    salle: "",
  })

  useEffect(() => {
    fetchPatients()
    fetchSalles()
  }, [timeFrame])

  useEffect(() => {
    if (showAddForm) {
      const today = new Date().toISOString().split("T")[0]
      setNewPatient((prev) => ({ ...prev, dateofDay: today }))
    }
  }, [showAddForm])

  useEffect(() => {
    const handleClickOutside = () => {
      setSelectedPatient(null)
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  const fetchPatients = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("secretaryToken")
      const response = await axios.get("http://localhost:3000/api/v1/User/Secratry/Patient", {
        headers: { Authorization: `Bearer ${token}` },
      })

      const allPatients = response.data.allPatient || []
      const now = new Date()
      const startDate = new Date()

      if (timeFrame === "Day") {
        startDate.setHours(0, 0, 0, 0)
      } else if (timeFrame === "Week") {
        startDate.setDate(now.getDate() - 7)
      } else if (timeFrame === "Year") {
        startDate.setFullYear(now.getFullYear() - 1)
      }

      const filteredByDate = allPatients.filter((patient) => {
        const patientDate = new Date(patient.createdAt)
        return patientDate >= startDate
      })

      setPatients(filteredByDate)
    } catch (error) {
      console.error("Error fetching data:", error)
      setPatients([])
    } finally {
      setLoading(false)
    }
  }

  const fetchSalles = async () => {
    const token = localStorage.getItem("secretaryToken")
    try {
      const response = await axios.get("http://localhost:3000/api/v1/User/Secratry/getAllSale", {
        headers: { Authorization: `Bearer ${token}` },
      })

      const grouped = {}
      response.data.allSale.forEach((salle) => {
        if (!grouped[salle.specialization]) {
          grouped[salle.specialization] = []
        }
        grouped[salle.specialization].push(salle)
      })

      setSallesBySpec(grouped)
    } catch (error) {
      console.error("Error fetching salles:", error)
    }
  }

  const handleAddPatient = async () => {
    if (!newPatient.name || !newPatient.age || !newPatient.email || !newPatient.salle) {
      alert("Please fill in all required fields, including salle.")
      return
    }

    const token = localStorage.getItem("secretaryToken")
    if (!token) {
      alert("Token not found")
      return
    }

    // Validate token format
    console.log("Token being used:", token)
    
    // Prepare patient data with proper formatting
    const patientData = {
      ...newPatient,
      age: parseInt(newPatient.age), // Convert age to number
      amount: newPatient.amount ? parseFloat(newPatient.amount) : 0, // Convert amount to number
    }

    console.log("Sending patient data:", patientData)

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/User/Secratry/addPatient", 
        patientData, 
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      )
      
      console.log("Success response:", response.data)
      fetchPatients()
      setNewPatient({
        name: "",
        age: "",
        email: "",
        gender: "Male",
        contactInfo: "",
        dateofDay: "",
        amount: "",
        specialization: "ORL",
        salle: "",
      })
      setShowAddForm(false)
      alert("Patient added successfully!")
      
    } catch (error) {
      console.error("Full error object:", error)
      console.error("Error response:", error.response)
      console.error("Error status:", error.response?.status)
      console.error("Error data:", error.response?.data)
      
      if (error.response?.status === 401) {
        alert("Authentication failed. Please login again.")
        // Optionally redirect to login
      } else if (error.response?.status === 400) {
        alert(`Bad request: ${error.response?.data?.msg || 'Invalid data provided'}`)
      } else if (error.response?.status === 500) {
        alert(`Server error: ${error.response?.data?.msg || 'Internal server error'}`)
      } else {
        alert(`Error adding patient: ${error.response?.data?.msg || error.message}`)
      }
    }
  }

  const handleDeletePatient = async (patientId) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) {
      return
    }

    const token = localStorage.getItem("secretaryToken")
    if (!token) {
      alert("Token not found")
      return
    }

    try {
      await axios.delete(`http://localhost:3000/api/v1/User/Secratry/Patient/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      alert("Patient deleted successfully")
      fetchPatients() // Refresh the list
      setSelectedPatient(null)
    } catch (error) {
      console.error("Error deleting patient:", error)
      alert("Error deleting patient")
    }
  }

  const handleEditPatient = (patient) => {
    setEditingPatient(patient)
    setEditPatient({
      name: patient.name,
      age: patient.age,
      email: patient.email,
      gender: patient.gender,
      contactInfo: patient.contactInfo,
      dateofDay: patient.dateofDay || new Date().toISOString().split("T")[0],
      amount: patient.amount,
      specialization: patient.specialization,
      salle: patient.salle,
    })
    setShowEditForm(true)
    setSelectedPatient(null)
  }

  const handleUpdatePatient = async () => {
    if (!editPatient.name || !editPatient.age || !editPatient.email || !editPatient.salle) {
      alert("Please fill in all required fields, including salle.")
      return
    }

    const token = localStorage.getItem("secretaryToken")
    if (!token) {
      alert("Token not found")
      return
    }

    try {
      await axios.patch(`http://localhost:3000/api/v1/User/Secratry/Patient/${editingPatient._id}`, editPatient, {
        headers: { Authorization: `Bearer ${token}` },
      })

      alert("Patient updated successfully")
      fetchPatients() // Refresh the list
      setShowEditForm(false)
      setEditingPatient(null)
    } catch (error) {
      console.error("Error updating patient:", error)
      alert("Error updating patient")
    }
  }

  const handleRowClick = (event, patient) => {
    event.stopPropagation()
    const rect = event.currentTarget.getBoundingClientRect()
    setDropdownPosition({
      x: event.clientX,
      y: rect.bottom + window.scrollY,
    })
    setSelectedPatient(selectedPatient === patient._id ? null : patient._id)
  }

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="secretary-patients">
      <div className="title-pat">
        <h5>List Patients</h5>
        <button className="add-btn" onClick={() => setShowAddForm(true)}>
          <FaPlus /> Add Patient
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

      {/* Add Patient Form */}
      {showAddForm && (
        <div className="overlay" onClick={() => setShowAddForm(false)}>
          <div className="overla-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add New Patient</h3>

            <select
              className="select-field"
              value={newPatient.specialization}
              onChange={(e) => {
                const selectedSpec = e.target.value
                setNewPatient((prev) => ({
                  ...prev,
                  specialization: selectedSpec,
                  salle: "",
                }))
              }}
            >
              {Object.keys(sallesBySpec).map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>

            {newPatient.specialization && sallesBySpec[newPatient.specialization] && (
              <select
                className="select-field"
                value={newPatient.salle}
                onChange={(e) => setNewPatient({ ...newPatient, salle: e.target.value })}
              >
                <option value="">Select Salle</option>
                {sallesBySpec[newPatient.specialization].map((salle) => (
                  <option key={salle._id} value={salle.namesale}>
                    {salle.namesale}
                  </option>
                ))}
              </select>
            )}

            <input
              type="text"
              className="input-field"
              placeholder="Name"
              value={newPatient.name}
              onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
            />
            <input
              type="number"
              className="input-field"
              placeholder="Age"
              value={newPatient.age}
              onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
            />
            <input
              type="email"
              className="input-field"
              placeholder="Email"
              value={newPatient.email}
              onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
            />

            <select
              className="select-field"
              value={newPatient.gender}
              onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <input
              type="text"
              className="input-field"
              placeholder="Contact Info"
              value={newPatient.contactInfo}
              onChange={(e) => setNewPatient({ ...newPatient, contactInfo: e.target.value })}
            />
            <input type="date" className="input-field" value={newPatient.dateofDay} disabled />
            <input
              type="number"
              className="input-field"
              placeholder="Amount"
              value={newPatient.amount}
              onChange={(e) => setNewPatient({ ...newPatient, amount: e.target.value })}
            />

            <button className="submit-btn" onClick={handleAddPatient}>
              Submit
            </button>
          </div>
        </div>
      )}

      {/* Edit Patient Form */}
      {showEditForm && (
        <div className="overlay" onClick={() => setShowEditForm(false)}>
          <div className="overla-content" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Patient</h3>

            <select
              className="select-field"
              value={editPatient.specialization}
              onChange={(e) => {
                const selectedSpec = e.target.value
                setEditPatient((prev) => ({
                  ...prev,
                  specialization: selectedSpec,
                  salle: "",
                }))
              }}
            >
              {Object.keys(sallesBySpec).map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>

            {editPatient.specialization && sallesBySpec[editPatient.specialization] && (
              <select
                className="select-field"
                value={editPatient.salle}
                onChange={(e) => setEditPatient({ ...editPatient, salle: e.target.value })}
              >
                <option value="">Select Salle</option>
                {sallesBySpec[editPatient.specialization].map((salle) => (
                  <option key={salle._id} value={salle.namesale}>
                    {salle.namesale}
                  </option>
                ))}
              </select>
            )}

            <input
              type="text"
              className="input-field"
              placeholder="Name"
              value={editPatient.name}
              onChange={(e) => setEditPatient({ ...editPatient, name: e.target.value })}
            />
            <input
              type="number"
              className="input-field"
              placeholder="Age"
              value={editPatient.age}
              onChange={(e) => setEditPatient({ ...editPatient, age: e.target.value })}
            />
            <input
              type="email"
              className="input-field"
              placeholder="Email"
              value={editPatient.email}
              onChange={(e) => setEditPatient({ ...editPatient, email: e.target.value })}
            />

            <select
              className="select-field"
              value={editPatient.gender}
              onChange={(e) => setEditPatient({ ...editPatient, gender: e.target.value })}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <input
              type="text"
              className="input-field"
              placeholder="Contact Info"
              value={editPatient.contactInfo}
              onChange={(e) => setEditPatient({ ...editPatient, contactInfo: e.target.value })}
            />
            <input
              type="date"
              className="input-field"
              value={editPatient.dateofDay}
              onChange={(e) => setEditPatient({ ...editPatient, dateofDay: e.target.value })}
            />
            <input
              type="number"
              className="input-field"
              placeholder="Amount"
              value={editPatient.amount}
              onChange={(e) => setEditPatient({ ...editPatient, amount: e.target.value })}
            />

            <button className="submit-btn" onClick={handleUpdatePatient}>
              Update Patient
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          <div className="top-section">
            <h5>
              <FaUserFriends /> Total Patients: {filteredPatients.length}
            </h5>
            <input
              type="text"
              className="search-bar"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="taab">
            <table className="patient-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Contact Info</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Specialization</th>
                  <th>Salle</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient, index) => (
                  <tr
                    key={index}
                    className={`patient-row ${selectedPatient === patient._id ? "selected" : ""}`}
                    onClick={(e) => handleRowClick(e, patient)}
                  >
                    <td>{index + 1}</td>
                    <td>{patient.name}</td>
                    <td>{patient.age}</td>
                    <td>{patient.gender}</td>
                    <td>
                      {patient.email} <br /> {patient.contactInfo}
                    </td>
                    <td>{new Date(patient.createdAt).toLocaleDateString() || "-"}</td>
                    <td>{patient.amount || "-"}</td>
                    <td>{patient.specialization}</td>
                    <td>{patient.salle || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Patient Action Dropdown */}
          {selectedPatient && (
            <div
              className="patient-action-dropdown"
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
                  const patient = patients.find((p) => p._id === selectedPatient)
                  handleEditPatient(patient)
                }}
              >
                <FaEdit /> Edit Patient
              </button>
              <button
                className="dropdown-action-item delete-action"
                onClick={() => handleDeletePatient(selectedPatient)}
              >
                <FaTrash /> Delete Patient
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Secretarypatients
