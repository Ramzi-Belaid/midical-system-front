import React, { useState, useEffect } from 'react'
import "./dossier_Midcal_File.css"

// You can import components from your UI library
// If you don't use a UI library, you can create these components yourself or use basic HTML components

// Import icons (you can use any icon library you prefer)
// Example: import { FaEye, FaChevronDown, FaChevronUp, FaSearch } from 'react-icons/fa';

function Dossier_Midcal_File() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedPatients, setExpandedPatients] = useState({});
  const [activeTab, setActiveTab] = useState({});

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
  const doctorToken = localStorage.getItem("doctorToken");

  try {
    const response = await fetch("http://localhost:3000/api/v1/User/doctors/getmidicalfils", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${doctorToken}`  // ← إضافة التوكن هنا
      }
    });

    const data = await response.json();

    if (data.success) {
      setPatients(data.allPatient);

      // تعيين التبويب النشط الافتراضي لكل مريض
      const initialTabs = {};
      data.allPatient.forEach(patient => {
        initialTabs[patient._id] = "overview";
      });
      setActiveTab(initialTabs);
    } else {
      console.error("Failed to fetch patient data");
    }
  } catch (error) {
    console.error("Error fetching patient data:", error);
  } finally {
    setLoading(false);
  }
};

    fetchData();
  }, []);

  const toggleExpand = (patientId) => {
    setExpandedPatients(prev => ({
      ...prev,
      [patientId]: !prev[patientId]
    }));
  };

  const changeTab = (patientId, tab) => {
    setActiveTab(prev => ({
      ...prev,
      [patientId]: tab
    }));
  };

  const filteredPatients = patients.filter(patient => {
    // Filter based on search term
    const searchLower = searchTerm.toLowerCase();
    return (
      patient._id.toLowerCase().includes(searchLower) ||
      (patient.diag && patient.diag.toLowerCase().includes(searchLower)) ||
      (patient.eyeRight.notes && patient.eyeRight.notes.toLowerCase().includes(searchLower)) ||
      (patient.eyeLeft.notes && patient.eyeLeft.notes.toLowerCase().includes(searchLower))
    );
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper function to check if eye data exists
  const hasEyeData = (eyeData) => {
    if (!eyeData) return false;
    return Object.values(eyeData).some(value => 
      value !== null && 
      value !== "" && 
      (Array.isArray(value) ? value.some(v => v !== "") : true)
    );
  };

  // Component to display eye data
  const EyeDataDisplay = ({ eyeData, title }) => {
    if (!hasEyeData(eyeData)) {
      return <p className="no-data">No data available</p>;
    }

    return (
      <div className="eye-data">
        <h3 className="eye-title">{title}</h3>
        <div className="eye-details">
          {eyeData.SC && <div className="data-row"><span className="label">SC:</span> <span className="value">{eyeData.SC}</span></div>}
          {eyeData.Pa && <div className="data-row"><span className="label">Pa:</span> <span className="value">{eyeData.Pa}</span></div>}
          {eyeData.AV && <div className="data-row"><span className="label">AV:</span> <span className="value">{eyeData.AV}</span></div>}
          {eyeData.Auto && eyeData.Auto.length > 0 && eyeData.Auto.some(a => a !== "") && (
            <div className="data-row">
              <span className="label">Auto:</span> 
              <span className="value">{eyeData.Auto.filter(a => a !== "").join(", ")}</span>
            </div>
          )}
          {eyeData.VL && <div className="data-row"><span className="label">VL:</span> <span className="value">{eyeData.VL}</span></div>}
          {eyeData.ADD && <div className="data-row"><span className="label">ADD:</span> <span className="value">{eyeData.ADD}</span></div>}
          {eyeData.K1 !== null && <div className="data-row"><span className="label">K1:</span> <span className="value">{eyeData.K1}</span></div>}
          {eyeData.K2 !== null && <div className="data-row"><span className="label">K2:</span> <span className="value">{eyeData.K2}</span></div>}
          {eyeData.R1 !== null && <div className="data-row"><span className="label">R1:</span> <span className="value">{eyeData.R1}</span></div>}
          {eyeData.R2 !== null && <div className="data-row"><span className="label">R2:</span> <span className="value">{eyeData.R2}</span></div>}
          {eyeData.R0 !== null && <div className="data-row"><span className="label">R0:</span> <span className="value">{eyeData.R0}</span></div>}
          {eyeData.Pachy && <div className="data-row"><span className="label">Pachy:</span> <span className="value">{eyeData.Pachy}</span></div>}
          {eyeData.TOC && <div className="data-row"><span className="label">TOC:</span> <span className="value">{eyeData.TOC}</span></div>}
          {eyeData.Cycloplege && <div className="data-row"><span className="label">Cycloplege:</span> <span className="value">{eyeData.Cycloplege}</span></div>}
          {eyeData.notes && <div className="data-row"><span className="label">Notes:</span> <span className="value">{eyeData.notes}</span></div>}
          {eyeData.cornea && <div className="data-row"><span className="label">Cornea:</span> <span className="value">{eyeData.cornea}</span></div>}
          {eyeData.conjunctiva && <div className="data-row"><span className="label">Conjunctiva:</span> <span className="value">{eyeData.conjunctiva}</span></div>}
          {eyeData.gonio && <div className="data-row"><span className="label">Gonio:</span> <span className="value">{eyeData.gonio}</span></div>}
          {eyeData.TO && <div className="data-row"><span className="label">TO:</span> <span className="value">{eyeData.TO}</span></div>}
          {eyeData.LAF && <div className="data-row"><span className="label">LAF:</span> <span className="value">{eyeData.LAF}</span></div>}
          {eyeData.FO && <div className="data-row"><span className="label">FO:</span> <span className="value">{eyeData.FO}</span></div>}
          {eyeData.papille && <div className="data-row"><span className="label">Papille:</span> <span className="value">{eyeData.papille}</span></div>}
          {eyeData.text && <div className="data-row"><span className="label">Text:</span> <span className="value">{eyeData.text}</span></div>}
        </div>
      </div>
    );
  };

  return (
    <div className='dossier_Midcal_File'>
      <div className="headerrr">
        <h5>Patient Eye Examination Files</h5>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-inputt"
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading data...</p>
        </div>
      ) : (
        <div className="patients-grid">
          {filteredPatients.length === 0 ? (
            <div className="no-results">No matching results found</div>
          ) : (
            filteredPatients.map((patient) => (
              <div key={patient._id} className="patient-card">
                <div className="patient-header">
                  <div className="patient-info">
                    <h2 className="patient-id">Patient ID: {patient._id.substring(0, 8)}...</h2>
                  </div>
                  {patient.diag && (
                    <div className="diagnosis-badge">{patient.diag}</div>
                  )}
                </div>

                <div className="patient-content">
                  <div className="tabs">
                    <button 
                      className={`tab ${activeTab[patient._id] === "overview" ? "active" : ""}`}
                      onClick={() => changeTab(patient._id, "overview")}
                    >
                      Overview
                    </button>
                    <button 
                      className={`tab ${activeTab[patient._id] === "right" ? "active" : ""}`}
                      onClick={() => changeTab(patient._id, "right")}
                    >
                      Right Eye
                    </button>
                    <button 
                      className={`tab ${activeTab[patient._id] === "left" ? "active" : ""}`}
                      onClick={() => changeTab(patient._id, "left")}
                    >
                      Left Eye
                    </button>
                  </div>

                  <div className="tab-content">
                    {activeTab[patient._id] === "overview" && (
                      <div className="overview-tab">
                        <div className="eyes-grid">
                          <div className="eye-summary">
                            <h3>Right Eye</h3>
                            {hasEyeData(patient.eyeRight) ? (
                              <div className="summary-data">
                                {patient.eyeRight.SC && <div className="data-row"><span className="label">SC:</span> <span className="value">{patient.eyeRight.SC}</span></div>}
                                {patient.eyeRight.AV && <div className="data-row"><span className="label">AV:</span> <span className="value">{patient.eyeRight.AV}</span></div>}
                                {patient.eyeRight.VL && <div className="data-row"><span className="label">VL:</span> <span className="value">{patient.eyeRight.VL}</span></div>}
                                {patient.eyeRight.notes && <div className="data-row"><span className="label">Notes:</span> <span className="value">{patient.eyeRight.notes}</span></div>}
                              </div>
                            ) : (
                              <p className="no-data">No data available</p>
                            )}
                          </div>
                          
                          <div className="eye-summary">
                            <h3>Left Eye</h3>
                            {hasEyeData(patient.eyeLeft) ? (
                              <div className="summary-data">
                                {patient.eyeLeft.SC && <div className="data-row"><span className="label">SC:</span> <span className="value">{patient.eyeLeft.SC}</span></div>}
                                {patient.eyeLeft.AV && <div className="data-row"><span className="label">AV:</span> <span className="value">{patient.eyeLeft.AV}</span></div>}
                                {patient.eyeLeft.VL && <div className="data-row"><span className="label">VL:</span> <span className="value">{patient.eyeLeft.VL}</span></div>}
                                {patient.eyeLeft.notes && <div className="data-row"><span className="label">Notes:</span> <span className="value">{patient.eyeLeft.notes}</span></div>}
                              </div>
                            ) : (
                              <p className="no-data">No data available</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab[patient._id] === "right" && (
                      <div className="right-eye-tab">
                        <div className="scrollable-content">
                          <EyeDataDisplay eyeData={patient.eyeRight} title="Right Eye Data" />
                        </div>
                      </div>
                    )}

                    {activeTab[patient._id] === "left" && (
                      <div className="left-eye-tab">
                        <div className="scrollable-content">
                          <EyeDataDisplay eyeData={patient.eyeLeft} title="Left Eye Data" />
                        </div>
                      </div>
                    )}
                  </div>

                  {expandedPatients[patient._id] && (
                    <div className="additional-info">
                      <div className="info-grid">
                        <div className="info-column">
                          <h4>Additional Right Eye Information</h4>
                          {patient.eyeRight.cornea && <div className="data-row"><span className="label">Cornea:</span> <span className="value">{patient.eyeRight.cornea}</span></div>}
                          {patient.eyeRight.conjunctiva && <div className="data-row"><span className="label">Conjunctiva:</span> <span className="value">{patient.eyeRight.conjunctiva}</span></div>}
                          {patient.eyeRight.TOC && <div className="data-row"><span className="label">TOC:</span> <span className="value">{patient.eyeRight.TOC}</span></div>}
                        </div>
                        <div className="info-column">
                          <h4>Additional Left Eye Information</h4>
                          {patient.eyeLeft.cornea && <div className="data-row"><span className="label">Cornea:</span> <span className="value">{patient.eyeLeft.cornea}</span></div>}
                          {patient.eyeLeft.conjunctiva && <div className="data-row"><span className="label">Conjunctiva:</span> <span className="value">{patient.eyeLeft.conjunctiva}</span></div>}
                          {patient.eyeLeft.TOC && <div className="data-row"><span className="label">TOC:</span> <span className="value">{patient.eyeLeft.TOC}</span></div>}
                        </div>
                      </div>
                    </div>
                  )}

                  <button 
                    className="toggle-button"
                    onClick={() => toggleExpand(patient._id)}
                  >
                    {expandedPatients[patient._id] ? "Show Less" : "Show More"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default Dossier_Midcal_File