import React from "react";
import "./secretaryDashboard.css"; // يمكنك تصميم الصفحة هنا

const SecretaryDashboard = () => {
  return (
    <div className="secretary-container">
      <h2>Welcome, Secretary!</h2>
      <p>This is your dedicated dashboard where you can manage appointments and patient records.</p>
      <button className="manage-btn">Manage Appointments</button>
      <button className="manage-btn">View Patients</button>
    </div>
  );
};

export default SecretaryDashboard;
