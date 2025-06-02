"use client"

import { useState, useRef, useEffect } from "react"
import axios from "axios"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import { RiFileTextLine, RiMedicineBottleLine } from "react-icons/ri"
import "./prescription.css"

const MedicalSystem = () => {
  // State for active document type (prescription or certificate)
  const [activeDocument, setActiveDocument] = useState("prescription")

  // Refs for PDF generation
  const prescriptionRef = useRef()
  const certificateRef = useRef()

  // Common states
  const [hospital, setHospital] = useState("")
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("info@hospital.com")
  const [doctor, setDoctor] = useState("Loading...")
  const [specialization, setSpecialization] = useState("")
  const [patient, setPatient] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])

  // Prescription specific states
  const [medications, setMedications] = useState([])
  const [allDrugs, setAllDrugs] = useState([])
  const [drugSuggestions, setDrugSuggestions] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Certificate specific states
  const [certificateDetails, setCertificateDetails] = useState("")
  const [certificateConclusion, setCertificateConclusion] = useState("")

  const doctorToken = localStorage.getItem("doctorToken")

  useEffect(() => {
    if (!doctorToken) {
      console.log("Waiting for doctorToken...")
      return
    }

    const fetchDoctorData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/User/doctors/prescriptions", {
          headers: { Authorization: `Bearer ${doctorToken}` },
        })

        if (response.data?.success && response.data?.doctor) {
          const { fullName, specialization, Hospital, phone, location } = response.data.doctor

          setDoctor(fullName || "Unknown")
          setSpecialization(specialization || "Not specified")
          setHospital(Hospital || "No hospital info")
          setPhone(phone || "No phone available")
          setAddress(location || "No address available")
        } else {
          console.log("Doctor data not found!")
          setDoctor("Doctor not found")
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error)
        setDoctor("Error loading doctor")
      }
    }

    fetchDoctorData()
  }, [doctorToken])

  useEffect(() => {
    if (!doctorToken) return

    axios
      .get("http://localhost:3000/api/v1/User/doctors/Medicines", {
        headers: { Authorization: `Bearer ${doctorToken}` },
      })
      .then((response) => {
        if (response.data.prescrption) {
          setAllDrugs(response.data.prescrption)
        } else {
          console.log("⚠️ No medicines found!")
        }
      })
      .catch((err) => console.error("❌ Error fetching medicines:", err))
  }, [doctorToken])

  // Prescription functions
  const addMedication = () => {
    setMedications([...medications, { id: Date.now(), name: "", dosage: "" }])
  }

  const removeLastMedication = () => {
    setMedications((prev) => prev.slice(0, -1))
  }

  const updateMedication = (id, field, value) => {
    setMedications((meds) => meds.map((med) => (med.id === id ? { ...med, [field]: value } : med)))

    if (field === "name" && value.trim() !== "") {
      const cleanValue = value.trim().toLowerCase()
      const filteredDrugs = allDrugs.filter((drug) => drug.medicineName?.trim().toLowerCase().includes(cleanValue))

      setDrugSuggestions(filteredDrugs)

      // Check for exact match
      const exactMatch = allDrugs.find((drug) => drug.medicineName?.trim().toLowerCase() === cleanValue)

      if (exactMatch) {
        setMedications((meds) => meds.map((med) => (med.id === id ? { ...med, dosage: exactMatch.dosage } : med)))
      }
    } else {
      setDrugSuggestions([])
    }
  }

  // إضافة دواء جديد للقاعدة
  const addNewMedicine = async (medicineName, dosage) => {
    if (!doctorToken || !patient.trim() || !medicineName.trim()) {
      console.log("❌ Missing required data:", { doctorToken: !!doctorToken, patient, medicineName })
      return false
    }

    try {
      setIsSubmitting(true)
      console.log("🚀 Adding new medicine:", {
        patientName: patient,
        medicineName,
        dosage: dosage || "Not specified",
        dateIssued: new Date().toISOString(),
      })

      const response = await axios.post(
        "http://localhost:3000/api/v1/User/doctors/addMedecine",
        {
          patientName: patient.trim(),
          medicineName: medicineName.trim(),
          dosage: dosage?.trim() || "Not specified",
          dateIssued: new Date().toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${doctorToken}`,
            "Content-Type": "application/json",
          },
        },
      )

      console.log("✅ Medicine added successfully:", response.data)

      // Update local drug list
      const newDrug = {
        medicineName: medicineName.trim(),
        dosage: dosage?.trim() || "Not specified",
      }
      setAllDrugs((prev) => [...prev, newDrug])

      return true
    } catch (error) {
      console.error("❌ Error adding medicine:", error.response?.data || error.message)
      alert(`Error adding medicine: ${error.response?.data?.message || error.message}`)
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleMedicationBlur = async (id, name, dosage) => {
    if (!name.trim()) return // If name is empty, do nothing

    // التحقق من وجود اسم المريض
    if (!patient.trim()) {
      alert("Please enter patient name first!")
      return
    }

    console.log("🔍 Checking if medicine exists:", name)

    const existingDrug = allDrugs.find((drug) => drug.medicineName?.toLowerCase().trim() === name.toLowerCase().trim())

    if (!existingDrug) {
      const success = await addNewMedicine(name, dosage)
      if (success) {
        // Update the medication with the new dosage
        setMedications((meds) =>
          meds.map((med) => (med.id === id ? { ...med, dosage: dosage || "Not specified" } : med)),
        )
      }
    } else {
      console.log("🔹 Drug already exists:", existingDrug)
      setMedications((meds) => meds.map((med) => (med.id === id ? { ...med, dosage: existingDrug.dosage } : med)))
    }

    setTimeout(() => setDrugSuggestions([]), 200)
  }

  // حفظ الوصفة الطبية كاملة
  const savePrescription = async () => {
    if (!patient.trim()) {
      alert("Please enter patient name!")
      return
    }

    if (medications.length === 0) {
      alert("Please add at least one medication!")
      return
    }

    const incompleteMeds = medications.filter((med) => !med.name.trim())
    if (incompleteMeds.length > 0) {
      alert("Please fill in all medication names!")
      return
    }

    try {
      setIsSubmitting(true)

      // إرسال كل دواء على حدة
      for (const med of medications) {
        if (med.name.trim()) {
          await addNewMedicine(med.name, med.dosage)
        }
      }

      alert("Prescription saved successfully!")
    } catch (error) {
      console.error("Error saving prescription:", error)
      alert("Error saving prescription. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Certificate functions
  const handleCertificateSubmit = async () => {
    if (!doctorToken) {
      alert("No doctor token found")
      return
    }

    if (!patient.trim()) {
      alert("Please enter patient name!")
      return
    }

    if (!certificateDetails.trim()) {
      alert("Please enter certificate details!")
      return
    }

    try {
      setIsSubmitting(true)
      const response = await axios.post(
        "http://localhost:3000/api/v1/User/doctors/addMedical_Certificate",
        {
          patientName: patient.trim(),
          text: certificateDetails.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${doctorToken}`,
            "Content-Type": "application/json",
          },
        },
      )

      console.log("Certificate submitted successfully:", response.data)
      alert("Medical Certificate submitted successfully!")

      // Clear form after successful submission
      setCertificateDetails("")
    } catch (error) {
      console.error("Error submitting certificate:", error.response?.data || error.message)
      alert(`Error submitting Medical Certificate: ${error.response?.data?.message || error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // PDF generation
  const generatePDF = () => {
    const input = activeDocument === "prescription" ? prescriptionRef.current : certificateRef.current
    html2canvas(input, { scale: window.devicePixelRatio }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")
      pdf.addImage(imgData, "PNG", 10, 10, 190, (canvas.height * 190) / canvas.width)
      pdf.save(`${doctor}_${patient}_${activeDocument === "prescription" ? "prescription" : "certificate"}.pdf`)
    })
  }

  return (
    <div className="containerr">
      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeDocument === "prescription" ? "active" : ""}`}
          onClick={() => setActiveDocument("prescription")}
        >
          <RiMedicineBottleLine className="tab-icon" /> Medical Prescription
        </button>
        <button
          className={`tab-button ${activeDocument === "certificate" ? "active" : ""}`}
          onClick={() => setActiveDocument("certificate")}
        >
          <RiFileTextLine className="tab-icon" /> Medical Certificate
        </button>
      </div>

      {/* Prescription View */}
      {activeDocument === "prescription" && (
        <>
          <div ref={prescriptionRef} className="prescription-paper">
            <p className="titelrescription">الجمهورية الجزائرية الديمقراطية الشعبية</p>
            <p className="titelrescription-en">People's Democratic Republic of Algeria</p>
            <h2 className="hospital-name">Medical Prescription</h2>
            <div className="hospital-info">
              <div>
                <p>
                  <strong>Hospital:</strong> {hospital}
                </p>
                <p>
                  <strong>Address:</strong> {address}
                </p>
                <p>
                  <strong>Doctor:</strong> {doctor}
                </p>
              </div>
              <div>
                <p>
                  <strong>Phone:</strong> {phone}
                </p>
                <p>
                  <strong>Email:</strong> {email}
                </p>
                <p>
                  <strong>Specialization:</strong> {specialization}
                </p>
              </div>
            </div>
            <hr />
            <div className="details">
              <label>Patient:</label>
              <input
                type="text"
                value={patient}
                onChange={(e) => setPatient(e.target.value)}
                placeholder="Patient name (required)"
                required
              />
              <label>Date:</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <hr />
            <h3 className="medications-title">Medications:</h3>
            {medications.map((med) => (
              <div key={med.id} className="medication">
                <input
                  type="text"
                  placeholder="Medicine Name"
                  value={med.name}
                  onChange={(e) => updateMedication(med.id, "name", e.target.value)}
                  onBlur={() => handleMedicationBlur(med.id, med.name, med.dosage)}
                  disabled={isSubmitting}
                />

                {/* Suggestions list */}
                {drugSuggestions.length > 0 && (
                  <ul className="suggestions">
                    {drugSuggestions.map((drug, index) => (
                      <li
                        key={index}
                        onClick={() => {
                          updateMedication(med.id, "name", drug.medicineName)
                          updateMedication(med.id, "dosage", drug.dosage)
                          setDrugSuggestions([])
                        }}
                      >
                        {drug.medicineName} - {drug.dosage}
                      </li>
                    ))}
                  </ul>
                )}

                <input
                  type="text"
                  placeholder="Dosage"
                  value={med.dosage}
                  onChange={(e) => updateMedication(med.id, "dosage", e.target.value)}
                  disabled={isSubmitting}
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
            <button onClick={addMedication} disabled={isSubmitting}>
              Add Medication
            </button>
            <button onClick={removeLastMedication} disabled={isSubmitting}>
              Remove Last
            </button>
            <button onClick={savePrescription} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Prescription"}
            </button>
            <button onClick={generatePDF} disabled={isSubmitting}>
              Download PDF
            </button>
          </div>
        </>
      )}

      {/* Certificate View */}
      {activeDocument === "certificate" && (
        <>
          <div ref={certificateRef} className="prescription-paper">
            <p className="titelrescription">الجمهورية الجزائرية الديمقراطية الشعبية</p>
            <p className="titelrescription-en">People's Democratic Republic of Algeria</p>
            <h2 className="hospital-name">Medical Certificate</h2>
            <div className="hospital-info">
              <div>
                <p>
                  <strong>Hospital:</strong> {hospital}
                </p>
                <p>
                  <strong>Address:</strong> {address}
                </p>
                <p>
                  <strong>Doctor:</strong> {doctor}
                </p>
              </div>
              <div>
                <p>
                  <strong>Phone:</strong> {phone}
                </p>
                <p>
                  <strong>Email:</strong> {email}
                </p>
                <p>
                  <strong>Specialization:</strong> {specialization}
                </p>
              </div>
            </div>
            <hr />
            <div className="details">
              <label>Patient:</label>
              <input
                type="text"
                value={patient}
                onChange={(e) => setPatient(e.target.value)}
                placeholder="Patient name (required)"
                required
              />
              <label>Date:</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <hr />
            <h3 className="medications-title">Medical Details:</h3>
            <div className="certificate-textarea-container">
              <textarea
                rows="6"
                placeholder="Enter detailed medical examination findings..."
                value={certificateDetails}
                onChange={(e) => setCertificateDetails(e.target.value)}
                className="certificate-textarea"
                disabled={isSubmitting}
              ></textarea>
            </div>

            <hr />
            <div className="signature">
              <p>________________________</p>
              <p>Doctor's Signature</p>
            </div>
          </div>

          <div className="actions">
            <button onClick={handleCertificateSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Certificate"}
            </button>
            <button onClick={generatePDF} disabled={isSubmitting}>
              Download PDF
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default MedicalSystem
