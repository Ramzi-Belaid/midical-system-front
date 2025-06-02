"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import "./medicalLanding.css"
import { LuChartColumnIncreasing } from "react-icons/lu"
import { GiRodOfAsclepius } from "react-icons/gi"
import { FaHeartbeat } from "react-icons/fa"
import { GiMedicines } from "react-icons/gi"
import { FaPlus } from "react-icons/fa6"
import { FcElectricity } from "react-icons/fc"
import { useAuth } from "../context/AuthContext"
import Logo from "./Logo"

const MedicalLanding = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isAdminLogin, setIsAdminLogin] = useState(false)
  const [selectedRole, setSelectedRole] = useState("doctor")
  const [credentials, setCredentials] = useState({ fullName: "", password: "" })
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  // Create animated medical background elements
  useEffect(() => {
    const createMedicalBackground = () => {
      const container = document.querySelector(".medical-background")
      if (!container) return

      container.innerHTML = ""

      // Create floating medical particles
      for (let i = 0; i < 30; i++) {
        const particle = document.createElement("div")
        particle.className = "medical-particle"
        particle.style.top = `${Math.random() * 100}%`
        particle.style.left = `${Math.random() * 100}%`
        particle.style.animationDuration = `${Math.random() * 15 + 10}s`
        particle.style.animationDelay = `${Math.random() * 5}s`

        // Random medical symbols
        const symbols = ["♥", "⚕", "+", "◯", "◈", "✚", "⊕"]
        particle.textContent = symbols[Math.floor(Math.random() * symbols.length)]
        particle.style.color = `rgba(59, 130, 246, ${Math.random() * 0.3 + 0.1})`
        particle.style.fontSize = `${Math.random() * 20 + 10}px`

        container.appendChild(particle)
      }

      // Create pulse waves
      for (let i = 0; i < 5; i++) {
        const wave = document.createElement("div")
        wave.className = "pulse-wave"
        wave.style.top = `${Math.random() * 100}%`
        wave.style.left = `${Math.random() * 100}%`
        wave.style.animationDelay = `${i * 2}s`
        container.appendChild(wave)
      }

      // Create DNA helix effect
      for (let i = 0; i < 3; i++) {
        const helix = document.createElement("div")
        helix.className = "dna-helix"
        helix.style.left = `${20 + i * 30}%`
        helix.style.animationDelay = `${i * 1}s`
        container.appendChild(helix)
      }
    }

    createMedicalBackground()
    const interval = setInterval(createMedicalBackground, 30000)

    return () => clearInterval(interval)
  }, [])

  // ✅ تسجيل الدخول للمشرفين + الأطباء + السكرتارية
  const handleLogin = async () => {
    if (!credentials.fullName.trim() || !credentials.password.trim()) {
      setErrorMessage("Please fill in all fields.")
      return
    }

    setIsLoading(true)
    setErrorMessage("")

    try {
      const endpoint = isAdminLogin
        ? "http://localhost:3000/api/v1/Admin/login"
        : "http://localhost:3000/api/v1/User/login"

      const role = isAdminLogin ? "admin" : selectedRole

      const response = await axios.post(endpoint, {
        fullName: credentials.fullName,
        password: credentials.password,
        role,
      })

      if (response.data.token) {
        localStorage.setItem(`${role}Token`, response.data.token)
        localStorage.setItem("fullName", response.data.fullName)
        login({ fullName: credentials.fullName, role })
        setIsLoginOpen(false)

        // استخدام React Router للتنقل
        if (role === "admin") navigate("/Admin-Doctor")
        else if (role === "doctor") navigate("/Doctor-Dashboard")
        else if (role === "secretary") navigate("/Secretary-Dashboard")
      } else {
        setErrorMessage("Login failed. No token received.")
      }
    } catch (error) {
      console.error("Login error:", error)
      setErrorMessage("Login failed. Check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdminAccess = () => {
    setIsAdminLogin(true)
    setIsLoginOpen(true)
    setErrorMessage("")
    setCredentials({ fullName: "", password: "" })
  }

  const handleNormalLogin = () => {
    setIsAdminLogin(false)
    setIsLoginOpen(true)
    setErrorMessage("")
    setCredentials({ fullName: "", password: "" })
  }

  const handleModalClose = () => {
    setIsLoginOpen(false)
    setErrorMessage("")
    setCredentials({ fullName: "", password: "" })
    setIsLoading(false)
  }

  return (
    <div className="medical-landing-container">
      {/* Medical Animated Background */}
      <div className="medical-background"></div>

      {/* Static Medical Icons */}
      <div className="static-medical-icons">
        <div className="medical-icon heart-icon">
          <GiRodOfAsclepius />
        </div>
        <div className="medical-icon stethoscope-icon">
          <FaHeartbeat />
        </div>
        <div className="medical-icon activity-icon">
          <LuChartColumnIncreasing />
        </div>
        <div className="medical-icon pill-icon">
          <GiMedicines />
        </div>
        <div className="medical-icon cross-icon">
          <FaPlus />
        </div>
        <div className="medical-icon zap-icon">
          <FcElectricity />
        </div>
      </div>

      {/* Navigation */}
      <nav className="medical-navbar">
        <div className="navbar-brand">
          <div className="logo-circle">
            <Logo />
          </div>
        </div>
        <button onClick={handleNormalLogin} className="login-btn">
          Login
        </button>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-grid">
          {/* Left Section */}
          <div className="left-section">
            <div className="content-text">
              <p className="subtitle">WE ARE HERE FOR YOU</p>
              <h1 className="main-title">
                Welcome to <br />
                <span className="gradient-text">Medical Clinic</span>
              </h1>
              <p className="description">Get the best healthcare experience.</p>
            </div>

            <div className="action-buttonss">
              <button onClick={handleAdminAccess} className="admin-btn">
                Administrator Access
              </button>
              <Link to="/admin-signup" className="login-btnn">
                Administrator Sign Up →
              </Link>
            </div>
          </div>

          {/* Right Section */}
          <div className="right-section">
            <div className="image-grid">
              <div className="large-card">
                <div className="card-content">
                  <div className="activity-icon-large">
                    <LuChartColumnIncreasing />
                  </div>
                </div>
              </div>
              <div className="small-card heart-card">
                <div className="card-content">
                  <div className="heart-icon-large">
                    <FaHeartbeat />
                  </div>
                </div>
              </div>
              <div className="small-card stethoscope-card">
                <div className="card-content">
                  <div className="stethoscope-icon-large">
                    <GiRodOfAsclepius />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="modal-overlay" onClick={handleModalClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">{isAdminLogin ? "Administrator Login" : "Login"}</h2>

            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <div className="form-group">
              <input
                type="text"
                placeholder="Full Name"
                value={credentials.fullName}
                onChange={(e) => setCredentials({ ...credentials, fullName: e.target.value })}
                className="form-input"
                disabled={isLoading}
              />
              <input
                type="password"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="form-input"
                disabled={isLoading}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleLogin()
                  }
                }}
              />

              {!isAdminLogin && (
                <div className="role-selection">
                  <p className="role-label">Select Role:</p>
                  <div className="role-options">
                    <label className="role-option">
                      <input
                        type="radio"
                        name="role"
                        value="doctor"
                        checked={selectedRole === "doctor"}
                        onChange={() => setSelectedRole("doctor")}
                        disabled={isLoading}
                      />
                      <span>Doctor</span>
                    </label>
                    <label className="role-option">
                      <input
                        type="radio"
                        name="role"
                        value="secretary"
                        checked={selectedRole === "secretary"}
                        onChange={() => setSelectedRole("secretary")}
                        disabled={isLoading}
                      />
                      <span>Secretary</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="modal-buttons">
                <button onClick={handleLogin} className="login-submit-btn" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </button>
                <button onClick={handleModalClose} className="cancel-btn" disabled={isLoading}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MedicalLanding
