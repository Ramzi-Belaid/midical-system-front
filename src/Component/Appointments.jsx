import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './appointments.css';
import { FaFilter, FaChevronDown } from "react-icons/fa";


function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [timeFram, setTimeFram] = useState("Day");
  const [DropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    // Fetching appointments data
    axios.get('http://localhost:5000/appointments')
      .then(response => {
        setAppointments(response.data || []);
        setFilteredAppointments(response.data || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Filtering appointments based on search term
    setFilteredAppointments(
      appointments.filter(appointment => 
        appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.mobileNumber.includes(searchTerm)
      )
    );
  }, [searchTerm, appointments]);

  useEffect(() => {
    // Filtering by timeframe
    const filteredByTime = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.dayOfAppointment);
      const today = new Date();

      switch (timeFram) {
        case "Day":
          return appointmentDate.toDateString() === today.toDateString();
        case "Week":
          const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
          const endOfWeek = new Date(today.setDate(today.getDate() + 6));
          return appointmentDate >= startOfWeek && appointmentDate <= endOfWeek;
        case "Year":
          return appointmentDate.getFullYear() === today.getFullYear();
        default:
          return true;
      }
    });

    setFilteredAppointments(filteredByTime);
  }, [timeFram, appointments]);

  return (
    <div className='appointments-container'>
      <div className="appointments-header">
        <h5>Appointments</h5>
        <div className="time-dropdown-toggle">
          <h5
            className="time-dropdown-button"
            onClick={() => setDropdownOpen(!DropdownOpen)}
          >
            {timeFram} <FaChevronDown /> 
          </h5>
        </div>
        {DropdownOpen && (
          <div className="time-dropdowneee">
            
            {["Day", "Week", "Year"].map((frame) => (
              <button
                key={frame}
                className={`time-optione ${timeFram === frame ? "active" : ""}`}
                onClick={() => {
                  setTimeFram(frame);
                  setDropdownOpen(false);
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
          <div className="search-bar-container">
  <h5 className="search-title">Appointments User</h5>
  <div className="search-input-wrapper">
    <input
      type="text"
      placeholder="Search..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="search-inpute"
    />
    <button className="filter-btn"><FaFilter/> Filter</button>
  </div>
</div>


          <div className="appointments-table-container">
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Patient Name</th>
                  <th>Patient ID</th>
                  <th>Appointment Type</th>
                  <th>Time</th>
                  <th>Mobile Number</th>
                  <th>Appointment Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appointment, index) => (
                    <tr key={index}>
                      <td>{appointment.numberInList}</td>
                      <td>{appointment.patientName}</td>
                      <td>{appointment.patientId}</td>
                      <td>{appointment.type}</td>
                      <td>{appointment.time}</td>
                      <td>{appointment.mobileNumber}</td>
                      <td>{appointment.dayOfAppointment}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No appointment data available</td>
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

export default Appointments;
