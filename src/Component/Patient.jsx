import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './patient.css';
import { FaUserFriends, FaFilter, FaChevronDown } from "react-icons/fa";

function Patient() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [timeFrame, setTimeFrame] = useState("Day");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const doctorToken = localStorage.getItem('doctorToken');

  useEffect(() => {
    axios.get('http://localhost:3000/api/v1/User/doctors/Patient', {
      headers: { Authorization: `Bearer ${doctorToken}` }
    })
      .then(response => {
        setPatients(response.data.allPatient || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const filteredByTime = patients.filter(patient => {
      const appointmentDate = new Date(patient.createdAt);
      appointmentDate.setHours(0, 0, 0, 0);

      switch (timeFrame) {
        case "Day":
          return appointmentDate.getTime() === today.getTime();
        case "Week":
          return appointmentDate >= startOfWeek && appointmentDate <= endOfWeek;
        case "Year":
          return appointmentDate.getFullYear() === today.getFullYear();
        default:
          return true;
      }
    });

    const filteredBySearch = filteredByTime.filter(patient => 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredPatients(filteredBySearch);
  }, [timeFrame, patients, searchTerm]);

  return (
    <div className="patients-main">
      <div className='title-pat'>
        <h5>List Patients</h5>
        <div className="time-selector">
          <h5 className="time-dropdown-button" onClick={() => setDropdownOpen(!dropdownOpen)}>
            {timeFrame} <FaChevronDown />
          </h5>
        </div>
        {dropdownOpen && (
          <div className="time-dropDown">
            {["Day", "Week", "Year"].map((frame) => (
              <button key={frame} className={`time-option ${timeFrame === frame ? "active" : ""}`}  onClick={() => {
                setTimeFrame(frame);
                setDropdownOpen(false);
                
              }}>
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
            <h5><FaUserFriends /> Total Patients: {filteredPatients.length}</h5>
            <div className="search-filter">
              <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-bar" />
              <button className="filter-btn" onClick={() => setSearchTerm('')}>
                <FaFilter /> Filter
              </button>
            </div>
          </div>

          <div className="taab">
            <table className="patient-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Contact Info</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient, index) => (
                    <tr key={index}>
                      <td>{patient.name}</td>
                      <td>{patient.age}</td>
                      <td>{patient.email}<br />{patient.contactInfo}</td>
                      <td>{patient.amount}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No patient data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default Patient;