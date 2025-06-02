"use client"

import { useState, useEffect } from "react"
import axios from "axios"

function NavNotic() {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  const doctorToken = localStorage.getItem("doctorToken")
  const fullName = localStorage.getItem("fullName") // الاسم الكامل للمستخدم

  const fetchNotifications = async () => {
    // التأكد من وجود fullName و doctorToken قبل المتابعة
    if (!fullName) {
      console.warn("No fullName found in localStorage")
      setNotifications([])
      setUnreadCount(0)
      return
    }

    if (!doctorToken) {
      console.warn("No doctorToken found in localStorage")
      setNotifications([])
      setUnreadCount(0)
      return
    }

    try {
      // جلب الإشعارات من الأطباء باستخدام نفس URL
      const doctorResponse = await axios.get("http://localhost:3000/api/v1/User/doctors/getAllNotificationss", {
        headers: { Authorization: `Bearer ${doctorToken}` },
      })

      // فلترة صارمة للإشعارات - فقط التي recipientName يساوي fullName تماماً
      const doctorNotifs = doctorResponse.data.notifications.filter(
        (notif) => notif.recipientName && notif.recipientName.trim() === fullName.trim(),
      )

      // ترتيب الإشعارات حسب التاريخ
      doctorNotifs.sort((a, b) => new Date(b.dateIssued) - new Date(a.dateIssued))

      setNotifications(doctorNotifs)
      setUnreadCount(doctorNotifs.length)
    } catch (error) {
      console.error("Error fetching doctor notifications:", error)
      setNotifications([])
      setUnreadCount(0)
    }
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <li className="nav-item dropdown">
      <a className="nav-link nav-icon" href="/" data-bs-toggle="dropdown">
        <i className="bi bi-bell" style={{ fontSize: "20px" }}></i>
        {unreadCount > 0 && (
          <div className="badge bg-success badge-number" style={{ display: "flex" }}>
            {unreadCount}
          </div>
        )}
      </a>
      <div className="dropdown-menu notifications-menu dropdown-menu-end">
        <li className="dropdown-header">
          <h6>You have {unreadCount} new notifications</h6>
        </li>

        <div style={{ maxHeight: "250px", overflowY: "auto" }}>
          {notifications.length === 0 ? (
            <li className="notification-item">
              <p>No new notifications</p>
            </li>
          ) : (
            notifications.map((notif) => (
              <li key={notif._id} className="notification-item">
                <i className="bi bi-bell-fill text-primary"></i>
                <div>
                  <h4>{notif.notificationTitle}</h4>
                  <p>{notif.notificationMessage}</p>
                  <p className="time">{new Date(notif.dateIssued).toLocaleString()}</p>
                </div>
              </li>
            ))
          )}
        </div>
      </div>
    </li>
  )
}

export default NavNotic
