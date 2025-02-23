import React, { useEffect, useState } from "react";
import axios from "axios";
import { GoStarFill } from "react-icons/go";
import image from "../images/RR.png"
import "./notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/notifications")
      .then(response => {
        setNotifications(response.data);
      })
      .catch(error => console.error("Error fetching notifications:", error));
  }, []);

  const handleNotificationClick = (profile) => {
    setSelectedProfile(profile);
  };

  return (
    <div className="notifications-container">
      <div className="notifications-list">
        {notifications.length === 0 ? (
          <p className="no-notifications">No new notifications.</p>
        ) : (
          notifications.map(notif => (
            <div 
              key={notif.id} 
              className="notification-card"
              onClick={() => handleNotificationClick(notif.profile)}
            >
              <img src={notif.profile.image} alt={notif.profile.name} className="profile-pic" />
              <div className="notification-content">
                <h4>{notif.title}</h4>
                <p className="date">{new Date(notif.date).toLocaleString()}</p>
                <p className="message">{notif.message}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedProfile && (
        <div className="profile-details">
          <img src={selectedProfile.image} alt={selectedProfile.name} className="profile-large" />
          <h3><strong>Full name:</strong>{selectedProfile.name}</h3>
          <p><strong>Email:</strong> {selectedProfile.email}</p>
          <p><strong>Phone:</strong> {selectedProfile.phone}</p>
          <p><strong>role:</strong> {selectedProfile.specialization}</p>
          <p><strong>Clinic:</strong> {selectedProfile.clinic}</p>
          <p><strong>Rating:</strong> <GoStarFill/> {selectedProfile.rating}</p>
          <button className="close-btn" onClick={() => setSelectedProfile(null)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default Notifications;
