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

  useEffect(() => {
    axios.get('http://localhost:5000/patients')
      .then(response => {
        setPatients(response.data || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // إزالة التوقيت لضمان المطابقة الصحيحة

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // بداية الأسبوع
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // نهاية الأسبوع

    const filteredByTime = patients.filter(patient => {
      const allAppointments = [];

      // 1. إذا كان المريض لديه listVisit نضيف كل المواعيد منها
      if (patient.listVisit) {
        allAppointments.push(...patient.listVisit.map(visit => new Date(visit.appointmentDate)));
      }

      // 2. إذا كان المريض لديه appointmentDate مباشر، نضيفه أيضًا
      if (patient.appointmentDate) {
        allAppointments.push(new Date(patient.appointmentDate));
      }

      // 3. الفلترة بناءً على الإطار الزمني المختار
      return allAppointments.some(visitDate => {
        visitDate.setHours(0, 0, 0, 0); // تصفير الوقت لضمان دقة المقارنة
        switch (timeFrame) {
          case "Day":
            return visitDate.getTime() === today.getTime();
          case "Week":
            return visitDate >= startOfWeek && visitDate <= endOfWeek;
          case "Year":
            return visitDate.getFullYear() === today.getFullYear();
          default:
            return true;
        }
      });
    });

    setFilteredPatients(filteredByTime);
  }, [timeFrame, patients]);

  return (
    <div className="patients-main">
      <div className='title-pat'>
        <h5>List Patients</h5>
        <div className="time-selector">
          <h5 className="time-selector-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
            {timeFrame} <FaChevronDown />
          </h5>
        </div>
        {dropdownOpen && (
          <div className="time-dropDown">
            {["Day", "Week", "Year"].map((frame) => (
              <button key={frame} className={`time-optionn ${timeFrame === frame ? "active" : ""}`} onClick={() => {
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
                </tr>
              </thead>
              <tbody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient, index) => (
                    patient.listVisit && patient.listVisit.length > 0 ? (
                      patient.listVisit.map((visit, visitIndex) => (
                        <tr key={`${index}-${visitIndex}`}>
                          <td>{patient.id}</td>
                          <td>{patient.patientName}</td>
                          <td>{patient.age}</td>
                          <td>{patient.email}<br />{patient.contactInfo}</td>
                          <td>{visit.appointmentDate}</td>
                          <td>{visit.amount}</td>
                        </tr>
                      ))
                    ) : (
                      <tr key={index}>
                        <td>{patient.id}</td>
                        <td>{patient.patientName}</td>
                        <td>{patient.age}</td>
                        <td>{patient.email}<br />{patient.contactInfo}</td>
                        <td>{patient.appointmentDate}</td>
                        <td>{patient.amount}</td>
                      </tr>
                    )
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No patient data available</td>
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
