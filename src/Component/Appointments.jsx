import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './appointments.css';
import { FaFilter, FaChevronDown,FaUserFriends } from "react-icons/fa";


function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [timeFram, setTimeFram] = useState("Day");
  const [DropdownOpen, setDropdownOpen] = useState(false);
  
  const doctorToken = localStorage.getItem('doctorToken');

  useEffect(() => {
    axios.get('http://localhost:3000/api/v1/User/doctors/Appointments', {
      headers: { Authorization: `Bearer ${doctorToken}` }
    })
      .then(response => {
        setAppointments(response.data.allAppointments || []);
        setFilteredAppointments(response.data.allAppointments || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setFilteredAppointments(
      appointments.filter(appointment => 
        appointment.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, appointments]);

  useEffect(() => {
    const filteredByTime = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      const today = new Date();
      
      switch (timeFram) {
        case "Day":
          return appointmentDate.toDateString() === today.toDateString();
        case "Week":
          const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
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
            <h6 style={{fontWeight:"bold",fontSize:"15px"}}><FaUserFriends />Total Appointments User:{filteredAppointments.length}</h6>
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
                  <th>Specialization</th>
                  <th>Time</th>
                  <th>Appointment Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appointment, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{appointment.name}</td>
                      <td>{appointment.specialization}</td>
                      <td>{appointment.time}</td>
                      <td>{new Date(appointment.date).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No appointment data available</td>
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