import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "./prescription.css";

const MedicalPrescription = ({ loggedInDoctorId }) => {
  const prescriptionRef = useRef();
  const [hospital] = useState("City General Hospital");
  const [address] = useState("123 Main St, City, Country");
  const [phone] = useState("(123) 456-7890");
  const [email] = useState("info@hospital.com");

  const [doctor, setDoctor] = useState("Loading...");
  const [specialization, setSpecialization] = useState("");
  const [workingHours, setWorkingHours] = useState("");
  const [patient, setPatient] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [medications, setMedications] = useState([]);
  const [allDrugs, setAllDrugs] = useState([]); // قائمة الأدوية المخزنة
  const [drugSuggestions, setDrugSuggestions] = useState([]);
  const [activeInputId, setActiveInputId] = useState(null);

  // تحميل بيانات الطبيب عند تسجيل الدخول
  useEffect(() => {
    if (loggedInDoctorId) {
      axios.get("http://localhost:5000/doctors")
        .then((response) => {
          const doctorData = response.data.find(doc => doc.id === loggedInDoctorId);
          if (doctorData) {
            setDoctor(doctorData.full_name);
            setSpecialization(doctorData.specialization);
            setWorkingHours(doctorData.working_hours);
          } else {
            setDoctor("Doctor not found");
          }
        })
        .catch(() => setDoctor("Error loading doctor"));
    }
  }, [loggedInDoctorId]);

  // تحميل جميع الأدوية المخزنة عند تحميل الصفحة
  useEffect(() => {
    axios.get("http://localhost:5000/drugs")
      .then((response) => setAllDrugs(response.data))
      .catch(() => console.error("Error loading saved medications"));
  }, []);

  // حفظ بيانات الوصفة تلقائيًا عند تغيير القيم
  useEffect(() => {
    const timer = setTimeout(() => {
      axios.post("http://localhost:5000/prescriptions", { patient, medications, date })
        .catch(() => console.error("Error saving data"));
    }, 1000);
    return () => clearTimeout(timer);
  }, [patient, medications, date]);

  // إضافة دواء جديد
  const addMedication = () => {
    setMedications([...medications, { id: Date.now(), name: "", dosage: "" }]);
  };

  // حذف آخر دواء مضاف
  const removeLastMedication = () => {
    setMedications(medications.slice(0, -1));
  };

  // تحديث بيانات الأدوية
  const updateMedication = (id, field, value) => {
    setMedications(medications.map(med => (med.id === id ? { ...med, [field]: value } : med)));

    if (field === "name" && value.trim() !== "") {
      const filteredDrugs = allDrugs.filter(drug =>
        drug.name.toLowerCase().startsWith(value.toLowerCase())
      );
      setDrugSuggestions(filteredDrugs);
    } else {
      setDrugSuggestions([]);
    }
  };

  // عند فقدان التركيز، إذا لم يكن الدواء موجودًا في القائمة، يتم حفظه تلقائيًا
  const handleMedicationBlur = (id, name) => {
    if (!allDrugs.some(drug => drug.name.toLowerCase() === name.toLowerCase()) && name.trim() !== "") {
      axios.post("http://localhost:5000/drugs", { name })
        .then(() => {
          setAllDrugs([...allDrugs, { name }]);
          console.log("New drug added:", name);
        })
        .catch(() => console.error("Error adding drug"));
    }
    setDrugSuggestions([]);
  };

  // توليد ملف PDF للوصفة الطبية
  const generatePDF = () => {
    const input = prescriptionRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 10, 10, 190, (canvas.height * 190) / canvas.width);
      pdf.save(`${doctor}_${patient}_prescription.pdf`);
    });
  };

  return (
    <div className="containerr">
      <div ref={prescriptionRef} className="prescription-paper">
        <h2 className="hospital-name">Medical Prescription</h2>
        <div className="hospital-info">
          <div>
            <p><strong>Hospital:</strong> {hospital}</p>
            <p><strong>Address:</strong> {address}</p>
            <p><strong>Doctor:</strong> {doctor}</p>
          </div>
          <div>
            <p><strong>Phone:</strong> {phone}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Specialization:</strong> {specialization}</p>
          </div>
        </div>
        <hr />
        <div className="details">
          <label>Patient:</label>
          <input type="text" value={patient} onChange={(e) => setPatient(e.target.value)} placeholder="Patient name" />
          <label>Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <hr />
        <h3>Medications:</h3>
        {medications.map((med) => (
          <div key={med.id} className="medication">
            <input
              type="text"
              placeholder="Medicine Name"
              value={med.name}
              onChange={(e) => updateMedication(med.id, "name", e.target.value)}
              onBlur={() => handleMedicationBlur(med.id, med.name)}
              onFocus={() => setActiveInputId(med.id)}
            />
            {activeInputId === med.id && drugSuggestions.length > 0 && (
              <ul className="suggestions">
                {drugSuggestions.map((suggestion, index) => (
                  <li key={index} onClick={() => updateMedication(med.id, "name", suggestion.name)}>
                    {suggestion.name}
                  </li>
                ))}
              </ul>
            )}
            <input
              type="text"
              placeholder="Dosage"
              value={med.dosage}
              onChange={(e) => updateMedication(med.id, "dosage", e.target.value)}
            />
          </div>
        ))}
        <hr />
        <div className="signature">
          <p>________________________</p>
          <p>Doctor's Signature</p>
        </div>
      </div>
      <div className="actions">
        <button onClick={addMedication} className="add-btn">➕ Add Medication</button>
        <button onClick={removeLastMedication} className="remove-btn">❌ Remove Last Medication</button>
        <button onClick={generatePDF} className="download-btn">📄 Download PDF</button>
      </div>
    </div>
  );
};

export default MedicalPrescription;
