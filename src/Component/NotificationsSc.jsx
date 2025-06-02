"use client"

import { useEffect, useState, useCallback } from "react"
import axios from "axios"
import "./notifications.css"

function NotificationsSc() {
  const [profiles, setProfiles] = useState({ doctors: [], secretaries: [] })
  const [recipientName, setRecipientName] = useState("")
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [successMsg, setSuccessMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetchingProfiles, setFetchingProfiles] = useState(true)

  const secretaryToken = localStorage.getItem("secretaryToken")

  // Clear messages after timeout
  const clearMessages = useCallback(() => {
    setTimeout(() => {
      setSuccessMsg("")
      setErrorMsg("")
    }, 5000)
  }, [])

  // Fetch profiles function
  const fetchProfiles = useCallback(async () => {
    if (!secretaryToken) {
      setErrorMsg("No authentication token found. Please log in again.")
      setFetchingProfiles(false)
      return
    }

    try {
      setFetchingProfiles(true)
      setErrorMsg("")

      const response = await axios.get("http://localhost:3000/api/v1/User/Secratry/getRoleSc", {
        headers: {
          Authorization: `Bearer ${secretaryToken}`,
          "Content-Type": "application/json",
        },
      })

      if (response.data) {
        const { doctors = [], secretaries = [] } = response.data

        if (doctors.length === 0 && secretaries.length === 0) {
          setErrorMsg("No doctors or secretaries found in the system.")
        } else {
          setProfiles({ doctors, secretaries })
        }
      } else {
        throw new Error("Invalid response format")
      }
    } catch (error) {
      console.error("Error fetching profiles:", error)

      if (error.response) {
        // Server responded with error status
        const status = error.response.status
        const message = error.response.data?.message || error.response.statusText

        if (status === 401) {
          setErrorMsg("Authentication failed. Please log in again.")
        } else if (status === 403) {
          setErrorMsg("You don't have permission to access this resource.")
        } else if (status === 404) {
          setErrorMsg("Profiles endpoint not found.")
        } else {
          setErrorMsg(`Server error: ${message}`)
        }
      } else if (error.request) {
        // Network error
        setErrorMsg("Network error. Please check your connection and try again.")
      } else {
        // Other error
        setErrorMsg(error.message || "Failed to fetch profiles. Please try again.")
      }
    } finally {
      setFetchingProfiles(false)
    }
  }, [secretaryToken])

  useEffect(() => {
    fetchProfiles()
  }, [fetchProfiles])

  // Form validation
  const validateForm = () => {
    if (!title.trim()) {
      setErrorMsg("Please enter a notification title.")
      return false
    }

    if (title.trim().length < 3) {
      setErrorMsg("Title must be at least 3 characters long.")
      return false
    }

    if (!message.trim()) {
      setErrorMsg("Please enter a message.")
      return false
    }

    if (message.trim().length < 10) {
      setErrorMsg("Message must be at least 10 characters long.")
      return false
    }

    if (!recipientName) {
      setErrorMsg("Please select a recipient.")
      return false
    }

    return true
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Clear previous messages
    setSuccessMsg("")
    setErrorMsg("")

    // Validate form
    if (!validateForm()) {
      clearMessages()
      return
    }

    if (!secretaryToken) {
      setErrorMsg("Authentication token not found. Please log in again.")
      clearMessages()
      return
    }

    try {
      setLoading(true)

      const newNotification = {
        notificationTitle: title.trim(),
        notificationMessage: message.trim(),
        recipientName: recipientName,
        status: "unread",
      }

      const response = await axios.post(
        "http://localhost:3000/api/v1/User/Secratry/addNotificationSc",
        newNotification,
        {
          headers: {
            Authorization: `Bearer ${secretaryToken}`,
            "Content-Type": "application/json",
          },
        },
      )

      if (response.data) {
        setSuccessMsg("✅ Notification sent successfully!")
        // Reset form
        setTitle("")
        setMessage("")
        setRecipientName("")
        clearMessages()
      } else {
        throw new Error("Failed to send notification")
      }
    } catch (error) {
      console.error("Error sending notification:", error)

      if (error.response) {
        const status = error.response.status
        const message = error.response.data?.message || error.response.statusText

        if (status === 401) {
          setErrorMsg("Authentication failed. Please log in again.")
        } else if (status === 403) {
          setErrorMsg("You don't have permission to send notifications.")
        } else if (status === 400) {
          setErrorMsg(`Invalid data: ${message}`)
        } else {
          setErrorMsg(`❌ Server error: ${message}`)
        }
      } else if (error.request) {
        setErrorMsg("❌ Network error. Please check your connection and try again.")
      } else {
        setErrorMsg(error.message || "❌ Failed to send notification. Please try again.")
      }

      clearMessages()
    } finally {
      setLoading(false)
    }
  }

  // Handle retry for fetching profiles
  const handleRetry = () => {
    fetchProfiles()
  }

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h2>Send Notification</h2>
        <p className="notifications-subtitle">Send notifications to doctors and secretaries</p>
      </div>

      {fetchingProfiles ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading profiles...</p>
        </div>
      ) : (
        <form className="notification-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Notification Title *</label>
            <input
              id="title"
              type="text"
              placeholder="Enter notification title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              disabled={loading}
              required
            />
            <small className="char-count">{title.length}/100 characters</small>
          </div>

          <div className="form-group">
            <label htmlFor="message">Message *</label>
            <textarea
              id="message"
              placeholder="Enter your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={500}
              rows={5}
              disabled={loading}
              required
            />
            <small className="char-count">{message.length}/500 characters</small>
          </div>

          <div className="form-group">
            <label htmlFor="recipient">Select Recipient *</label>
            <select
              id="recipient"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              disabled={loading}
              required
            >
              <option value="">Choose a recipient</option>

              {profiles.doctors.length > 0 && (
                <optgroup label="Doctors">
                  {profiles.doctors.map((profile) => (
                    <option key={`doctor-${profile._id}`} value={profile.fullName}>
                      Dr. {profile.fullName}
                    </option>
                  ))}
                </optgroup>
              )}

              {profiles.secretaries.length > 0 && (
                <optgroup label="Secretaries">
                  {profiles.secretaries.map((profile) => (
                    <option key={`secretary-${profile._id}`} value={profile.fullName}>
                      {profile.fullName}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? (
              <>
                <span className="button-spinner"></span>
                Sending...
              </>
            ) : (
              "Send Notification"
            )}
          </button>

          {/* Messages */}
          {successMsg && (
            <div className="message success" role="alert">
              <span className="message-icon">✅</span>
              {successMsg}
            </div>
          )}

          {errorMsg && (
            <div className="message error" role="alert">
              <span className="message-icon">❌</span>
              {errorMsg}
              {errorMsg.includes("fetch profiles") && (
                <button type="button" className="retry-button" onClick={handleRetry}>
                  Retry
                </button>
              )}
            </div>
          )}
        </form>
      )}
    </div>
  )
}

export default NotificationsSc
