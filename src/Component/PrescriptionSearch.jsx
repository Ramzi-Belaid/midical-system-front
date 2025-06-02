"use client"

import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import "./prescriptionSearch.css"

const PrescriptionSearch = () => {
  const [prescriptions, setPrescriptions] = useState([])
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([])
  const [searchPatient, setSearchPatient] = useState("")
  const [searchDate, setSearchDate] = useState("")
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [patientMedications, setPatientMedications] = useState([])
  const [showDetails, setShowDetails] = useState(false)
  const [loading, setLoading] = useState(false)

  // احصل على التوكن من localStorage
  const doctorToken = localStorage.getItem("doctorToken")

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/User/doctors/Allprescriptions", {
        headers: {
          Authorization: `Bearer ${doctorToken}`,
        },
      })
      .then((response) => {
        const transformedData = response.data.prescriptions.map((prescription) => ({
          id: prescription._id,
          patientName: prescription.patientName || "Unknown",
          date: prescription.dateIssued ? new Date(prescription.dateIssued).toLocaleDateString() : "N/A",
          rawDate: prescription.dateIssued,
          medications: prescription.medicineName
            ? [{ name: prescription.medicineName, dosage: prescription.dosage || "N/A" }]
            : [],
        }))

        setPrescriptions(transformedData)
        setFilteredPrescriptions(transformedData)
      })
      .catch(() => console.error("Error loading prescriptions"))
  }, [doctorToken])

  const filterPrescriptions = useCallback(() => {
    const filtered = prescriptions.filter(
      (prescription) =>
        (prescription.patientName?.toLowerCase() || "").includes(searchPatient.toLowerCase()) &&
        (prescription.date || "").includes(searchDate),
    )
    setFilteredPrescriptions(filtered)
  }, [searchPatient, searchDate, prescriptions])

  useEffect(() => {
    filterPrescriptions()
  }, [searchPatient, searchDate, filterPrescriptions])

  const handlePatientClick = async (patientName) => {
    setLoading(true)
    setSelectedPatient(patientName)

    // فلترة جميع الوصفات للمريض المحدد
    const patientPrescriptions = prescriptions.filter((prescription) => prescription.patientName === patientName)

    // تجميع الأدوية حسب التاريخ
    const medicationsByDate = {}

    patientPrescriptions.forEach((prescription) => {
      const date = prescription.date
      if (!medicationsByDate[date]) {
        medicationsByDate[date] = {
          date: date,
          rawDate: prescription.rawDate,
          medications: [],
        }
      }

      if (prescription.medications.length > 0) {
        medicationsByDate[date].medications.push(...prescription.medications)
      }
    })

    // تحويل إلى مصفوفة وترتيب حسب التاريخ
    const sortedMedications = Object.values(medicationsByDate)
      .filter((dateGroup) => dateGroup.medications.length > 0)
      .sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate))

    setPatientMedications(sortedMedications)
    setShowDetails(true)
    setLoading(false)
  }

  const closeDetails = () => {
    setShowDetails(false)
    setSelectedPatient(null)
    setPatientMedications([])
  }

  return (
    <div className="prescription-container">
      <div className="search-fields">
        <input
          type="text"
          placeholder="Search by patient name..."
          value={searchPatient}
          onChange={(e) => setSearchPatient(e.target.value)}
        />
      </div>

      <div className="content-wrapper">
        <div className={`table-section ${showDetails ? "with-details" : ""}`}>
          <table className="prescription-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Medications</th>
              </tr>
            </thead>
            <tbody>
              {filteredPrescriptions.length > 0 ? (
                filteredPrescriptions.map((prescription) => (
                  <tr
                    key={prescription.id}
                    className={selectedPatient === prescription.patientName ? "selected-row" : ""}
                  >
                    <td>
                      <button
                        className="patient-name-button"
                        onClick={() => handlePatientClick(prescription.patientName)}
                      >
                        <span className="patient-icon"></span>
                        {prescription.patientName}
                      </button>
                    </td>
                    <td>
                      <div className="date-cell">
                        <span className="date-icon"></span>
                        {prescription.date}
                      </div>
                    </td>
                    <td>
                      <ul className="med">
                        {prescription.medications.length > 0 ? (
                          prescription.medications.map((med, index) => (
                            <li key={index} className="med">
                              <span className="med-icon"></span>
                              <span>
                                {med.name} - {med.dosage}
                              </span>
                            </li>
                          ))
                        ) : (
                          <li className="no-medications">No medications listed</li>
                        )}
                      </ul>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>
                    No prescriptions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* منطقة عرض تفاصيل الأدوية */}
        {showDetails && (
          <div className="details-section">
            <div className="details-header">
              <h2>
                <span className="details-user-icon"></span>
                Medications for {selectedPatient}
              </h2>
              <button className="close-details-button" onClick={closeDetails}>
                ✕
              </button>
            </div>

            <div className="details-body">
              {loading ? (
                <div className="loading">
                  <div className="spinner"></div>
                  <p>Loading medications...</p>
                </div>
              ) : patientMedications.length > 0 ? (
                <div className="medications-timeline">
                  {patientMedications.map((dateGroup, index) => (
                    <div key={index} className="date-group">
                      <div className="date-header">
                        <span className="calendar-icon"></span>
                        <h3>{dateGroup.date}</h3>
                        <div className="medications-count">
                          {dateGroup.medications.length} medication{dateGroup.medications.length !== 1 ? "s" : ""}
                        </div>
                      </div>

                      <div className="medications-grid">
                        {dateGroup.medications.map((med, medIndex) => (
                          <div key={medIndex} className="medication-card">
                            <div className="medication-header">
                              <span className="pill-icon">💊</span>
                              <h4>{med.name}</h4>
                            </div>
                            <div className="medication-dosage">
                              <span className="dosage-icon">⏰</span>
                              <span>Dosage: {med.dosage}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data">
                  <span className="no-data-icon">💊</span>
                  <h3>No medications found</h3>
                  <p>This patient has no recorded medications.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PrescriptionSearch
