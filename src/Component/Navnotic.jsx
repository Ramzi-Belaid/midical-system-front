import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function NavNotic() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    axios.get("http://localhost:5000/notifications")
      .then(response => {
        const notifs = response.data;

        // ترتيب الإشعارات بالأحدث أولاً
        notifs.sort((a, b) => new Date(b.date) - new Date(a.date));

        setNotifications(notifs.slice(0, 3)); // عرض آخر 3 إشعارات فقط
        setUnreadCount(notifs.length); // العدد الإجمالي للإشعارات غير المقروءة
      })
      .catch(error => console.error("Error fetching notifications:", error));
  }, []);

  return (
    <li className="nav-item dropdown">
      <a className="nav-link nav-icon" href="/" data-bs-toggle="dropdown">
        <i className="bi bi-bell" style={{ fontSize: "20px" }}></i>
        {unreadCount > 0 && (
          <div className="badge bg-success badge-number" style={{ display:"flex"}}>{unreadCount}</div>
        )}
      </a>
      <div className="dropdown-menu notifications-menu dropdown-menu-end">
        <li className="dropdown-header">
          <h6>You have {unreadCount} new notifications</h6>
        </li>

        {/* صندوق قابل للتمرير يحتوي على الإشعارات فقط */}
        <div style={{ maxHeight: "250px", overflowY: "auto" }}>
          {notifications.length === 0 ? (
            <li className="notification-item">
              <p>No new notifications</p>
            </li>
          ) : (
            notifications.map(notif => (
              <li key={notif.id} className="notification-item">
                <i className="bi bi-bell-fill text-primary"></i>
                <div>
                  <h4>{notif.title}</h4>
                  <p>{notif.message}</p>
                  <p className="time">{new Date(notif.date).toLocaleTimeString()}</p>
                </div>
              </li>
            ))
          )}
        </div>

        {/* "Show all notifications" تبقى ثابتة في الأسفل */}
        <li className="dropdown-footer">
          <Link to="/Notifications" className="button">Show all notifications</Link>
        </li>
      </div>
    </li>
  );
}

export default NavNotic;

