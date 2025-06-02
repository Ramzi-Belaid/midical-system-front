"use client"

import { useState, useEffect } from "react"
import "./medical_File.css"
import { LiaEyeSolid } from "react-icons/lia"
import { BsEyeglasses } from "react-icons/bs"
import { FiSave, FiPrinter } from "react-icons/fi"
import { MdOutlineRefresh } from "react-icons/md"
import Axios from "axios"

function Medical_File() {
  const [formData, setFormData] = useState({
    eyeRight: {
      SC: "",
      Pa: "",
      AV: "",
      Auto: ["", "", ""],
      VL: "",
      ADD: "",
      K1: "",
      K2: "",
      R1: "",
      R2: "",
      R0: "",
      Pachy: "",
      TOC: "",
      Cycloplege: "",
      notes: "",
      cornea: "",
      conjunctiva: "",
      gonio: "",
      TO: "",
      LAF: "",
      FO: "",
      papille: "",
      notesConclusion: "",
    },
    eyeLeft: {
      SC: "",
      Pa: "",
      AV: "",
      Auto: ["", "", ""],
      VL: "",
      ADD: "",
      K1: "",
      K2: "",
      R1: "",
      R2: "",
      R0: "",
      Pachy: "",
      TOC: "",
      Cycloplege: "",
      notes: "",
      cornea: "",
      conjunctiva: "",
      gonio: "",
      TO: "",
      LAF: "",
      FO: "",
      papille: "",
      text: "",
    },
  })

  // Active tab state
  const [activeTab, setActiveTab] = useState("right")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  // Handle change for most fields
  const handleChange = (e, eye) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [eye]: {
        ...prevState[eye],
        [name]: value,
      },
    }))
  }

  // Handle change for Auto fields which are arrays
  const handleAutoChange = (e, index, eye) => {
    const value = e.target.value
    setFormData((prev) => {
      const updatedAuto = [...prev[eye].Auto]
      updatedAuto[index] = value

      return {
        ...prev,
        [eye]: {
          ...prev[eye],
          Auto: updatedAuto,
        },
      }
    })
  }

  // Reset form data
  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the form?")) {
      setFormData({
        eyeRight: {
          SC: "",
          Pa: "",
          AV: "",
          Auto: ["", "", ""],
          VL: "",
          ADD: "",
          K1: "",
          K2: "",
          R1: "",
          R2: "",
          R0: "",
          Pachy: "",
          TOC: "",
          Cycloplege: "",
          notes: "",
          cornea: "",
          conjunctiva: "",
          gonio: "",
          TO: "",
          LAF: "",
          FO: "",
          papille: "",
          notesConclusion: "",
        },
        eyeLeft: {
          SC: "",
          Pa: "",
          AV: "",
          Auto: ["", "", ""],
          VL: "",
          ADD: "",
          K1: "",
          K2: "",
          R1: "",
          R2: "",
          R0: "",
          Pachy: "",
          TOC: "",
          Cycloplege: "",
          notes: "",
          cornea: "",
          conjunctiva: "",
          gonio: "",
          TO: "",
          LAF: "",
          FO: "",
          papille: "",
          text: "",
        },
      })
      setSubmitStatus(null)
    }
  }

  // Print form data
  const handlePrint = () => {
    window.print()
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    // Get doctor token from localStorage
    const doctorToken = localStorage.getItem("doctorToken")

    if (!doctorToken) {
      console.error("No doctor token found")
      setSubmitStatus({
        success: false,
        message: "No doctor token found. Please log in again.",
      })
      setIsSubmitting(false)
      return
    }

    try {
      const response = await Axios.post("http://localhost:3000/api/v1/User/doctors/addmidicalfils", formData, {
        headers: {
          Authorization: `Bearer ${doctorToken}`,
        },
      })
      console.log("Data sent successfully", response.data)
      setSubmitStatus({
        success: true,
        message: "Data sent successfully!",
      })
    } catch (error) {
      console.error("Error sending data", error)
      setSubmitStatus({
        success: false,
        message: "Error sending data. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Auto-hide status message after 5 seconds
  useEffect(() => {
    if (submitStatus) {
      const timer = setTimeout(() => {
        setSubmitStatus(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [submitStatus])

  // Visual acuity options
  const visualAcuityOptions = [
    { value: "", label: "SC" },
    { value: "Non ameliorable", label: "Non ameliorable" },
    { value: "Amblyopi", label: "Amblyopi" },
    { value: "Non cooperant", label: "Non cooperant" },
    { value: "PL douteuses", label: "PL douteuses" },
    { value: "PL abolies", label: "PL abolies" },
    { value: "PL bien ameliorables", label: "PL bien ameliorables" },
    { value: "PL S(+)T(+)I(+)N(+)", label: "PL S(+)T(+)I(+)N(+)" },
    { value: "CLD", label: "CLD" },
    { value: "VBLN", label: "VBLN" },
    { value: "1/20", label: "1/20" },
    { value: "1/10", label: "1/10" },
    { value: "1.6/10", label: "1.6/10" },
    { value: "2/10", label: "2/10" },
    { value: "3/10", label: "3/10" },
    { value: "4/10", label: "4/10" },
    { value: "5/10", label: "5/10" },
    { value: "6/10", label: "6/10" },
    { value: "7/10", label: "7/10" },
    { value: "8/10", label: "8/10" },
    { value: "9/10", label: "9/10" },
    { value: "10/10", label: "10/10" },
    { value: "12/10", label: "12/10" },
    { value: "15/10", label: "15/10" },
    { value: "20/10", label: "20/10" },
  ]

  // Generate diopter options from -15.00 to +15.00 in 0.25 steps
  const generateDiopterOptions = () => {
    const options = []
    options.push({ value: "", label: "Auto" })
    options.push({ value: "PLAN", label: "PLAN" })

    for (let i = -15; i <= 15; i += 0.25) {
      const value = i.toFixed(2)
      options.push({ value, label: value })
    }

    return options
  }

  const diopterOptions = generateDiopterOptions()

  // Generate axis options from 0 to 180 in 5 degree steps
  const generateAxisOptions = () => {
    const options = []
    options.push({ value: "", label: "Auto" })
    options.push({ value: "PLAN", label: "PLAN" })

    for (let i = 0; i <= 180; i += 5) {
      const value = i.toString()
      options.push({ value, label: value })
    }

    return options
  }

  const axisOptions = generateAxisOptions()

  // Render an eye examination form for either left or right eye
  const renderEyeForm = (eye) => {
    const eyeTitle = eye === "eyeRight" ? "Right Eye" : "Left Eye"

    return (
      <div className="eye-form">
        <div className="section">
          <h2>{eyeTitle} Examination</h2>
          <div className="row">
            <div className="SCPa">
              <div className="field">
                <label className="labell">SC:</label>
                <select className="SC" value={formData[eye].SC} onChange={(e) => handleChange(e, eye)} name="SC">
                  {visualAcuityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label className="labell">Pa:</label>
                <select className="SC" value={formData[eye].Pa} onChange={(e) => handleChange(e, eye)} name="Pa">
                  <option className="option" value="">
                    PA
                  </option>
                  <option value="Option 1">Option 1</option>
                  <option value="Option 2">Option 2</option>
                  <option value="Option 3">Option 3</option>
                </select>
              </div>

              <div className="field">
                <label className="labell">AV:</label>
                <select className="SC" value={formData[eye].AV} onChange={(e) => handleChange(e, eye)} name="AV">
                  <option className="option" value="">
                    AV
                  </option>
                  <option value="Option 1">Option 1</option>
                  <option value="Option 2">Option 2</option>
                  <option value="Option 3">Option 3</option>
                </select>
              </div>
            </div>

            <div className="Autotext">
              <div className="field">
                <label className="labell">Auto:</label>
                <div className="auto-selects">
                  {/* Auto 1 */}
                  <select className="SC" value={formData[eye].Auto[0]} onChange={(e) => handleAutoChange(e, 0, eye)}>
                    {axisOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  {/* Auto 2 */}
                  <select className="SC" value={formData[eye].Auto[1]} onChange={(e) => handleAutoChange(e, 1, eye)}>
                    {diopterOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  {/* Auto 3 */}
                  <select className="SC" value={formData[eye].Auto[2]} onChange={(e) => handleAutoChange(e, 2, eye)}>
                    {visualAcuityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="field">
                <label className="labell">V.L:</label>
                <select className="SC" value={formData[eye].VL} onChange={(e) => handleChange(e, eye)} name="VL">
                  <option className="option" value="">
                    V.L
                  </option>
                  {diopterOptions.slice(2).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label className="labell">ADD:</label>
                <select className="SC" value={formData[eye].ADD} onChange={(e) => handleChange(e, eye)} name="ADD">
                  <option className="option" value="">
                    ADD
                  </option>
                  <option value="NEUTRE">NEUTRE</option>
                  <option value="PLAN">PLAN</option>
                </select>
              </div>
            </div>
          </div>

          {/* K1, K2 Fields */}
          <div className="row">
            <div className="K1K2">
              <div className="field">
                <label className="labell">K1:</label>
                <input
                  type="number"
                  className="K1"
                  value={formData[eye].K1}
                  onChange={(e) => handleChange(e, eye)}
                  name="K1"
                />
              </div>
              <div className="field">
                <label className="labell">K2:</label>
                <input
                  type="number"
                  className="K2"
                  value={formData[eye].K2}
                  onChange={(e) => handleChange(e, eye)}
                  name="K2"
                />
              </div>
            </div>

            {/* R1, R2 Fields */}
            <div className="R1R2">
              <div className="field">
                <label className="labell">R1:</label>
                <input type="number" value={formData[eye].R1} onChange={(e) => handleChange(e, eye)} name="R1" />
              </div>
              <div className="field">
                <label className="labell">R2:</label>
                <input type="number" value={formData[eye].R2} onChange={(e) => handleChange(e, eye)} name="R2" />
              </div>
            </div>

            {/* R0, Pachy, T.O.C Fields */}
            <div className="R0">
              <div className="field">
                <label className="labell">R0:</label>
                <input type="number" value={formData[eye].R0} onChange={(e) => handleChange(e, eye)} name="R0" />
              </div>
              <div className="field">
                <label className="labell">Pachy:</label>
                <input type="text" value={formData[eye].Pachy} onChange={(e) => handleChange(e, eye)} name="Pachy" />
              </div>
              <div className="field">
                <label className="labell">T.O.C:</label>
                <input type="text" value={formData[eye].TOC} onChange={(e) => handleChange(e, eye)} name="TOC" />
              </div>
            </div>
          </div>

          {/* Cycloplege Field */}
          <div className="row">
            <div className="field">
              <label className="labell">Cycloplege:</label>
              <input
                type="text"
                value={formData[eye].Cycloplege}
                onChange={(e) => handleChange(e, eye)}
                name="Cycloplege"
              />
            </div>
          </div>
        </div>

        {/* Clinical Observations Section */}
        <div className="section">
          <h3>Clinical Observations</h3>
          <div className="row">
            <div className="textarea-container">
              <textarea
                rows="4"
                placeholder="Notes..."
                value={formData[eye].notes}
                onChange={(e) => handleChange(e, eye)}
                name="notes"
              ></textarea>
            </div>
            <div className="clinical-fields">
              <div className="field">
                <label className="labell">Cornea:</label>
                <input type="text" value={formData[eye].cornea} onChange={(e) => handleChange(e, eye)} name="cornea" />
              </div>
              <div className="field">
                <label className="labell">Conjunctiva:</label>
                <input
                  type="text"
                  value={formData[eye].conjunctiva}
                  onChange={(e) => handleChange(e, eye)}
                  name="conjunctiva"
                />
              </div>
              <div className="field">
                <label className="labell">Gonio:</label>
                <input type="text" value={formData[eye].gonio} onChange={(e) => handleChange(e, eye)} name="gonio" />
              </div>
              <div className="field">
                <label className="labell">T.O:</label>
                <input type="text" value={formData[eye].TO} onChange={(e) => handleChange(e, eye)} name="TO" />
              </div>
            </div>
          </div>
        </div>

        {/* Eye Details Section */}
        <div className="section">
          <h3>Eye Details</h3>
          <div className="row">
            <div className="field">
              <label className="labell">L.A.F:</label>
              <select name="LAF"  value={formData[eye].LAF} onChange={(e) => handleChange(e, eye)}>
                <option value="">L.A.F</option>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </select>
            </div>
            <div className="field">
              <label className="labell">F.O:</label>
              <select name="FO" value={formData[eye].FO} onChange={(e) => handleChange(e, eye)}>
                <option value="">F.O</option>
                <option value="optionA">Option A</option>
                <option value="optionB">Option B</option>
                <option value="optionC">Option C</option>
              </select>
            </div>
          </div>
        </div>

        <div className="conduite">
          <div className="field">
            <label htmlFor="papille" className="labell">
              Papille:
            </label>
            <input
              type="text"
              id="papille"
              name="papille"
              value={formData[eye].papille}
              onChange={(e) => handleChange(e, eye)}
              className="input-field"
            />
          </div>
        </div>

        <div className="textarea-container">
          <label className="labell">Conclusion Notes:</label>
          <textarea
            rows="4"
            placeholder="Conclusion notes..."
            name={eye === "eyeRight" ? "notesConclusion" : "text"}
            value={eye === "eyeRight" ? formData[eye].notesConclusion : formData[eye].text}
            onChange={(e) => handleChange(e, eye)}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="Medical_File">
      <h1 className="form-title">Medical Eye Examination</h1>

      {submitStatus && (
        <div className={`status-message ${submitStatus.success ? "success" : "error"}`}>{submitStatus.message}</div>
      )}

      <div className="tabs">
        <button className={`tab-button ${activeTab === "right" ? "active" : ""}`} onClick={() => setActiveTab("right")}>
          <LiaEyeSolid className="tab-icon" /> Right Eye
        </button>
        <button className={`tab-button ${activeTab === "left" ? "active" : ""}`} onClick={() => setActiveTab("left")}>
          <BsEyeglasses className="tab-icon" /> Left Eye
        </button>
      </div>

      <div className="Medical_File_content">
        {activeTab === "right" && renderEyeForm("eyeRight")}
        {activeTab === "left" && renderEyeForm("eyeLeft")}
      </div>

      <div className="action-buttons">
        <button className="action-button reset-button" onClick={handleReset} type="button">
          <MdOutlineRefresh className="button-icon" /> Reset
        </button>
        <button className="action-button submit-button" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            "Submitting..."
          ) : (
            <>
              <FiSave className="button-icon" /> Save
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default Medical_File
