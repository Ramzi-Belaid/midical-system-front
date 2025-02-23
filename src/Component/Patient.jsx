import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './patient.css';
import { FaUserFriends } from "react-icons/fa";
import { FaFilter, FaChevronDown } from "react-icons/fa";

function Patient() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [timeFram, setTimeFram] = useState("Day");
  const [DropdownOpen, setdropdownOpen] = useState(false);

  useEffect(() => {
    // Fetch patient data from the server using axios
    axios.get('http://localhost:5000/patients')
      .then(response => {
        console.log('Patients data:', response.data); // Log the data for inspection
        setPatients(response.data || []);
        setFilteredPatients(response.data || []);
        setLoading(false); // Stop loading once data is fetched
      })
      .catch(error => {
        console.error('Error fetching data:', error); // Log error if any
        setLoading(false); // Stop loading on error
      });
  }, []);

  useEffect(() => {
    // Filter patients based on the search term
    setFilteredPatients(
      patients.filter(patient =>
        patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, patients]);

  useEffect(() => {
    // Filter patients based on time frame
    const filteredByTime = patients.filter(patient => {
      return patient.listVisit && patient.listVisit.some(visit => {
        const visitDate = new Date(visit.appointmentDate);
        const today = new Date();

        switch (timeFram) {
          case "Day":
            return visitDate.toDateString() === today.toDateString(); // Filter by today
          case "Week":
            const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Get the start of the week (Sunday)
            const endOfWeek = new Date(today.setDate(today.getDate() + 6)); // Get the end of the week (Saturday)
            return visitDate >= startOfWeek && visitDate <= endOfWeek;
          case "Year":
            return visitDate.getFullYear() === today.getFullYear(); // Filter by current year
          default:
            return true;
        }
      });
    });

    setFilteredPatients(filteredByTime); // Update the filtered patients
  }, [timeFram, patients]);

  const getStatusButtonClass = (status) => {
    switch (status) {
      case 'paid':
        return 'paid-status';
      case 'unpaid':
        return 'unpaid-status';
      case 'pending':
        return 'pending-status';
      case 'overdue':
        return 'pending-overdue';
      default:
        return '';
    }
  };

  return (
    <div className="patients-main">
      <div className='title-pat'>
        <h5>List Patients</h5>
        <div className="time-selector">
          <h5
            className="time-selector-btn"
            onClick={() => setdropdownOpen(!DropdownOpen)}
          >
            {timeFram} <FaChevronDown />
          </h5>
        </div>
        {DropdownOpen && (
          <div className="time-dropDown">
            {["Day", "Week", "Year"].map((frame) => (
              <button
                key={frame}
                className={`time-optionn ${timeFram === frame ? "active" : ""}`}
                onClick={() => {
                  setTimeFram(frame);
                  setdropdownOpen(false);
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
            <h5> <FaUserFriends /> Total Patients: {filteredPatients.length}</h5>
            <div className="search-filter">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-bar"
              />
              <button className="filter-btn" onClick={() => setSearchTerm('')}>
                <FaFilter /> Filter
              </button>
            </div>
          </div>

          <div className="tab">
            <table className="patient-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Contact Info</th>
                  <th>Appointment Date</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    patient.listVisit && patient.listVisit.length > 0 ? (
                      patient.listVisit.map((visit, index) => (
                        <tr key={index}>
                          <td>{patient.id}</td>
                          <td>{patient.patientName}</td>
                          <td>{patient.age}</td>
                          <td className="contact-info">
                            {patient.email}<br />
                            <div>{patient.contactInfo}</div>
                          </td>
                          <td>{visit.appointmentDate}</td>
                          <td>{visit.amount}</td>
                          <td>{visit.dueDate}</td>
                          <td>
                            <button className={getStatusButtonClass(visit.dueStatus)}>
                              {visit.dueStatus}
                            </button>
                          </td>
                          <td>{visit.action}</td>
                        </tr>
                      ))
                    ) : (
                      <tr key={patient.id}>
                        <td colSpan="9">No visits for this patient</td>
                      </tr>
                    )
                  ))
                ) : (
                  <tr>
                    <td colSpan="9">No patient data available</td>
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
