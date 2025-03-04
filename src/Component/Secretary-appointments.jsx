import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './secretaryappointments.css';
import { FaUserFriends, FaChevronDown, FaPlus } from "react-icons/fa";

function Secretaryappointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState("Day");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    patientName: "",
    patientId: "",
    type: "",
    time: "",
    mobileNumber: "",
    dayOfAppointment: "",
    doctorType: "" // ✅ إضافة نوع الطبيب
  });

  useEffect(() => {
    fetchAppointments();
  }, [timeFrame]);

  const fetchAppointments = () => {
    setLoading(true);
    axios.get('http://localhost:5000/appointments')
      .then(response => {
        let filteredAppointments = response.data.filter(appointment => {
          const appointmentDate = new Date(appointment.dayOfAppointment || "1970-01-01");
          const today = new Date();

          if (timeFrame === "Day") {
            return appointmentDate.toDateString() === today.toDateString();
          } else if (timeFrame === "Week") {
            const weekAgo = new Date();
            weekAgo.setDate(today.getDate() - 7);
            return appointmentDate >= weekAgo;
          } else if (timeFrame === "Year") {
            return appointmentDate.getFullYear() === today.getFullYear();
          }
          return true;
        });

        filteredAppointments.sort((a, b) => new Date(a.dayOfAppointment) - new Date(b.dayOfAppointment));
        setAppointments(filteredAppointments);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  const handleAddAppointment = () => {
    axios.post('http://localhost:5000/appointments', newAppointment)
      .then(response => {
        setAppointments([...appointments, response.data]);
        setShowModal(false);
        setNewAppointment({ patientName: "", patientId: "", type: "", time: "", mobileNumber: "", dayOfAppointment: "", doctorType: "" });
      })
      .catch(error => {
        console.error("Error adding appointment:", error);
      });
  };

  const filteredAppointments = appointments.filter(appointment =>
    appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="appointments-main">
      <div className='title-app'>
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
                  setTimeFrame(frame);
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
          <div className="top-section">
            <h5><FaUserFriends /> Total Appointments: {filteredAppointments.length}</h5>
            <input
              type="text"
              className="search-bar"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="tab">
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Patient ID</th>
                  <th>Type</th>
                  <th>Time</th>
                  <th>Contact</th>
                  <th>Appointment Date</th>
                  <th>Doctor Type</th> {/* ✅ إضافة عمود الطبيب */}
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appointment, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{appointment.patientName}</td>
                    <td>{appointment.patientId}</td>
                    <td>{appointment.type}</td>
                    <td>{appointment.time}</td>
                    <td>{appointment.mobileNumber}</td>
                    <td>{appointment.dayOfAppointment}</td>
                    <td>{appointment.doctorType}</td> {/* ✅ عرض الطبيب */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ✅ Overlay ونافذة إضافة الموعد */}
      {showModal && (
        <div className="overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
             {/* ✅ قائمة اختيار الطبيب */}
             <select
              className="select-field"
              value={newAppointment.doctorType}
              onChange={(e) => setNewAppointment({ ...newAppointment, doctorType: e.target.value })}
            >
              <option value="">Select Doctor</option>
              <option value="HL ORL">HL ORL</option>
              <option value="OPHERLNA">OPHERLNA</option>
            </select>

            

            <input type="text" placeholder="Patient Name" value={newAppointment.patientName}
              onChange={(e) => setNewAppointment({ ...newAppointment, patientName: e.target.value })} />

            <input type="text" placeholder="Patient ID" value={newAppointment.patientId}
              onChange={(e) => setNewAppointment({ ...newAppointment, patientId: e.target.value })} />

            <input type="text" placeholder="Type" value={newAppointment.type}
              onChange={(e) => setNewAppointment({ ...newAppointment, type: e.target.value })} />

            <input type="text" placeholder="Time" value={newAppointment.time}
              onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })} />

            <input type="text" placeholder="Mobile Number" value={newAppointment.mobileNumber}
              onChange={(e) => setNewAppointment({ ...newAppointment, mobileNumber: e.target.value })} />
              
              <input type="date" value={newAppointment.dayOfAppointment}
              onChange={(e) => setNewAppointment({ ...newAppointment, dayOfAppointment: e.target.value })} />

           

            <button className="save-button" onClick={handleAddAppointment}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Secretaryappointments;
