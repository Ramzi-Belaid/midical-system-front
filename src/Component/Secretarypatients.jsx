import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './secretarypatients.css';
import { FaUserFriends, FaChevronDown, FaPlus } from "react-icons/fa";

function Secretarypatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState("Day");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPatient, setNewPatient] = useState({
    patientName: "",
    age: "",
    email: "",
    contactInfo: "",
    appointmentDate: "",
    amount: "",
    doctorType: "orl"
  });

  useEffect(() => {
    fetchPatients();
  }, [timeFrame]);

  useEffect(() => {
    if (showAddForm) {
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      setNewPatient((prev) => ({ ...prev, appointmentDate: today }));
    }
  }, [showAddForm]);

  const fetchPatients = () => {
    setLoading(true);
    axios.get('http://localhost:5000/patients')
      .then(response => {
        let filteredPatients = response.data.filter(patient => {
          const appointmentDate = new Date(patient.appointmentDate || "1970-01-01");
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

        filteredPatients.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
        setPatients(filteredPatients);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  const handleAddPatient = () => {
    if (!newPatient.patientName || !newPatient.age || !newPatient.email) {
      alert("Please fill in all required fields.");
      return;
    }

    axios.post('http://localhost:5000/patients', newPatient)
      .then(response => {
        fetchPatients();
        setNewPatient({ patientName: "", age: "", email: "", contactInfo: "", appointmentDate: "", amount: "", doctorType: "orl" });
        setShowAddForm(false);
      })
      .catch(error => {
        console.error("Error adding patient:", error);
      });
  };

  const filteredPatients = patients.filter(patient =>
    patient.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="patients-main">
      <div className='title-pat'>
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

      {showAddForm && (
        <div className="overlay" onClick={() => setShowAddForm(false)}>
          <div className="overla-content" onClick={(e) => e.stopPropagation()}>

            <select className="select-field" value={newPatient.doctorType} onChange={(e) => setNewPatient({ ...newPatient, doctorType: e.target.value })}>
              <option value="orl">ORL</option>
              <option value="opherlna">OPHERLNA</option>
            </select>

            <input type="text" className="input-field" placeholder="Name" value={newPatient.patientName} onChange={(e) => setNewPatient({ ...newPatient, patientName: e.target.value })} />
            <input type="number" className="input-field" placeholder="Age" value={newPatient.age} onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })} />
            <input type="email" className="input-field" placeholder="Email" value={newPatient.email} onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })} />
            <input type="text" className="input-field" placeholder="Contact Info" value={newPatient.contactInfo} onChange={(e) => setNewPatient({ ...newPatient, contactInfo: e.target.value })} />
            
            {/* حقل التاريخ مع اسم جديد وتعبئة تلقائية */}
            <input type="date" className="input-field" value={newPatient.appointmentDate} disabled />

            <input type="number" className="input-field" placeholder="Amount" value={newPatient.amount} onChange={(e) => setNewPatient({ ...newPatient, amount: e.target.value })} />
            <button className="submit-btn" onClick={handleAddPatient}>Submit</button>
          </div>
        </div>
      )}

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          <div className="top-section">
            <h5> <FaUserFriends /> Total Patients: {filteredPatients.length}</h5>
            <input type="text" className="search-bar" placeholder="Search patients..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>

          <div className="tab">
            <table className="patient-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Contact Info</th>
                  <th>Today's Date</th>
                  <th>Amount</th>
                  <th>Doctor</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{patient.patientName}</td>
                    <td>{patient.age}</td>
                    <td>{patient.email} <br /> {patient.contactInfo}</td>
                    <td>{patient.appointmentDate || '-'}</td>
                    <td>{patient.amount || '-'}</td>
                    <td>{patient.doctorType === "orl" ? "ORL" : "Other Specialist"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default Secretarypatients;
