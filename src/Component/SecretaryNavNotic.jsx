"use client"

import { useState, useEffect } from "react"
import axios from "axios"

function SecretaryNavNotic() {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  const secretaryToken = localStorage.getItem("secretaryToken")
  const fullName = localStorage.getItem("fullName") // الاسم الكامل للمستخدم

  const fetchNotifications = async () => {
    // التأكد من وجود fullName و secretaryToken قبل المتابعة
    if (!fullName) {
      console.warn("No fullName found in localStorage")
      setNotifications([])
      setUnreadCount(0)
      return
    }

    if (!secretaryToken) {
      console.warn("No secretaryToken found in localStorage")
      setNotifications([])
      setUnreadCount(0)
      return
    }

    try {
      // جلب الإشعارات من السكرتير باستخدام نفس URL
      const secResponse = await axios.get("http://localhost:3000/api/v1/User/Secratry/getAllnotificationss", {
        headers: { Authorization: `Bearer ${secretaryToken}` },
      })

      // فلترة صارمة للإشعارات - فقط التي recipientName يساوي fullName تماماً
      const secNotifs = secResponse.data.notifications.filter(
        (notif) => notif.recipientName && notif.recipientName.trim() === fullName.trim(),
      )

      // ترتيب الإشعارات حسب التاريخ
      secNotifs.sort((a, b) => new Date(b.dateIssued) - new Date(a.dateIssued))

      setNotifications(secNotifs)
      setUnreadCount(secNotifs.length)
    } catch (error) {
      console.error("Error fetching secretary notifications:", error)
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
      <div className="dropdown-menu notifications-menu dropdown-menu-end" style={{ zIndex: 9999 }}>
        <ul className="list-unstyled mb-0">
          <li className="dropdown-header">
            <h6>
              You have {unreadCount} new notification
              {unreadCount !== 1 ? "s" : ""}
            </h6>
          </li>

          <div style={{ maxHeight: "250px", overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <li className="notification-item">
                <p>No new notifications</p>
              </li>
            ) : (
              notifications.map((notif) => (
                <li key={notif._id} className="notification-item d-flex gap-2">
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
        </ul>
      </div>
    </li>
  )
}

export default SecretaryNavNotic
