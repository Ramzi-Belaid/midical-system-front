"use client"

import { useState } from "react"
import axios from "axios"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./adminSignUp.css"
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaHospital,
  FaMapMarkerAlt,
  FaPhone,
  FaClock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa"
import { Link } from "react-router-dom"

function AdminSignUp() {
  const [admin, setAdmin] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    clinicName: "",
    clinicAddress: "",
    clinicPhone: "",
    workingHours: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setAdmin({ ...admin, [name]: value })

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!admin.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!admin.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(admin.email)) newErrors.email = "Email is invalid"

    if (!admin.password) newErrors.password = "Password is required"
    else if (admin.password.length < 6) newErrors.password = "Password must be at least 6 characters"

    if (!admin.confirmPassword) newErrors.confirmPassword = "Please confirm your password"
    else if (admin.password !== admin.confirmPassword) newErrors.confirmPassword = "Passwords do not match"

    if (!admin.clinicName.trim()) newErrors.clinicName = "Clinic name is required"
    if (!admin.clinicAddress.trim()) newErrors.clinicAddress = "Clinic address is required"
    if (!admin.clinicPhone.trim()) newErrors.clinicPhone = "Clinic phone is required"
    if (!admin.workingHours.trim()) newErrors.workingHours = "Working hours are required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("❌ Please fix the errors in the form!")
      return
    }

    setIsLoading(true)

    const adminData = {
      fullName: admin.fullName,
      email: admin.email,
      password: admin.password,
      clinic: {
        name: admin.clinicName,
        address: admin.clinicAddress,
        phone: admin.clinicPhone,
        workingHours: admin.workingHours,
      },
    }

    try {
      console.log("📢 Sending data to API:", adminData)

      const response = await axios.post("http://localhost:3000/api/v1/Admin/SingUp", adminData)

      console.log("✅ API Response:", response.data)

      if (response.data.token) {
        localStorage.setItem("token", response.data.token)
        toast.success("✅ Admin Registered Successfully!")

        // Reset form after successful registration
        setTimeout(() => {
          setAdmin({
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
            clinicName: "",
            clinicAddress: "",
            clinicPhone: "",
            workingHours: "",
          })
        }, 2000)
      }
    } catch (error) {
      console.error("❌ Error registering admin:", error.response?.data || error.message)
      toast.error(error.response?.data?.message || "Failed to register admin.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="signup-page">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Background Elements */}
      <div className="signup-background">
        <div className="medical-particles"></div>
      </div>

      <div className="signup-container">
        <div className="signup-header">
          <div className="header-icon">
            <FaHospital />
          </div>
          <h1>Admin Registration</h1>
          <p>Create your clinic administrator account</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          {/* Admin Information Section */}
          <div className="form-section">
            <h3 className="section-title">
              <FaUser className="section-icon" />
              Administrator Information
            </h3>

            <div className="input-row">
              <div className="input-group">
                <div className="input-wrapper">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={admin.fullName}
                    onChange={handleChange}
                    className={errors.fullName ? "error" : ""}
                    disabled={isLoading}
                  />
                </div>
                {errors.fullName && <span className="error-text">{errors.fullName}</span>}
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  <FaEnvelope className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={admin.email}
                    onChange={handleChange}
                    className={errors.email ? "error" : ""}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
            </div>

            <div className="input-row">
              <div className="input-group">
                <div className="input-wrapper">
                  <FaLock className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={admin.password}
                    onChange={handleChange}
                    className={errors.password ? "error" : ""}
                    disabled={isLoading}
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  <FaLock className="input-icon" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={admin.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? "error" : ""}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
              </div>
            </div>
          </div>

          {/* Clinic Information Section */}
          <div className="form-section">
            <h3 className="section-title">
              <FaHospital className="section-icon" />
              Clinic Information
            </h3>

            <div className="input-row">
              <div className="input-group">
                <div className="input-wrapper">
                  <FaHospital className="input-icon" />
                  <input
                    type="text"
                    name="clinicName"
                    placeholder="Clinic Name"
                    value={admin.clinicName}
                    onChange={handleChange}
                    className={errors.clinicName ? "error" : ""}
                    disabled={isLoading}
                  />
                </div>
                {errors.clinicName && <span className="error-text">{errors.clinicName}</span>}
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  <FaPhone className="input-icon" />
                  <input
                    type="tel"
                    name="clinicPhone"
                    placeholder="Clinic Phone"
                    value={admin.clinicPhone}
                    onChange={handleChange}
                    className={errors.clinicPhone ? "error" : ""}
                    disabled={isLoading}
                  />
                </div>
                {errors.clinicPhone && <span className="error-text">{errors.clinicPhone}</span>}
              </div>
            </div>

            <div className="input-row">
              <div className="input-group full-width">
                <div className="input-wrapper">
                  <FaMapMarkerAlt className="input-icon" />
                  <input
                    type="text"
                    name="clinicAddress"
                    placeholder="Clinic Address"
                    value={admin.clinicAddress}
                    onChange={handleChange}
                    className={errors.clinicAddress ? "error" : ""}
                    disabled={isLoading}
                  />
                </div>
                {errors.clinicAddress && <span className="error-text">{errors.clinicAddress}</span>}
              </div>
            </div>

            <div className="input-row">
              <div className="input-group full-width">
                <div className="input-wrapper">
                  <FaClock className="input-icon" />
                  <input
                    type="text"
                    name="workingHours"
                    placeholder="Working Hours (e.g., 9:00 AM - 5:00 PM)"
                    value={admin.workingHours}
                    onChange={handleChange}
                    className={errors.workingHours ? "error" : ""}
                    disabled={isLoading}
                  />
                </div>
                {errors.workingHours && <span className="error-text">{errors.workingHours}</span>}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="signup-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="loading-spinner"></div>
                  Creating Account...
                </>
              ) : (
                "Create Admin Account"
              )}
            </button>

            <div className="form-footer">
              <p>
                Already have an account?{" "}
                <Link to="/" className="login-link">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminSignUp
