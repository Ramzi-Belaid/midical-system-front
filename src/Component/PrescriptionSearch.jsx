import React, { useState, useEffect } from "react";
import axios from "axios";
import "./prescriptionSearch.css";

const PrescriptionSearch = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [searchPatient, setSearchPatient] = useState("");
  const [searchDate, setSearchDate] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/prescriptions")
      .then((response) => {
        setPrescriptions(response.data);
        setFilteredPrescriptions(response.data);
      })
      .catch(() => console.error("Error loading prescriptions"));
  }, []);

  useEffect(() => {
    const filtered = prescriptions.filter((prescription) =>
      (prescription.patientName?.toLowerCase() || "").includes(searchPatient.toLowerCase()) &&
      (prescription.date || "").includes(searchDate)
    );
    setFilteredPrescriptions(filtered);
  }, [searchPatient, searchDate, prescriptions]);

  return (
    <div className="prescription-container">
        
      <div className="search-fields">
        <input
          type="text"
          placeholder="Search by patient name..."
          value={searchPatient}
          onChange={(e) => setSearchPatient(e.target.value)}
        />
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
      </div>

      <table className="prescription-table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Date</th>
            <th>Medications</th>
          </tr>
        </thead>
        <tbody>
          {filteredPrescriptions.length > 0 ? (
            filteredPrescriptions.map((prescription) => (
              <tr key={prescription.id}>
                <td>{prescription.patientName || "Unknown"}</td>
                <td>{prescription.doctorName || "Unknown"}</td>
                <td>{prescription.date || "N/A"}</td>
                <td>
                  <ul className="med">
                    {prescription.medications?.map((med, index) => (
                      <li key={index} className="med">{med}</li>
                    )) || "No Medications"}
                  </ul>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>No prescriptions found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PrescriptionSearch;
