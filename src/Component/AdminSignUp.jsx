import React, { useState } from "react";
import axios from "axios";
import "./adminSignUp.css";

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
  });

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (admin.password !== admin.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // حذف confirmPassword لأنه غير مطلوب في JSON Server
    const adminData = { ...admin };
    delete adminData.confirmPassword;

    try {
      await axios.post("http://localhost:5000/admins", adminData);
      alert("Admin Registered Successfully!");
      setAdmin({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        clinicName: "",
        clinicAddress: "",
        clinicPhone: "",
        workingHours: "",
      });
    } catch (error) {
      console.error("Error registering admin:", error);
      alert("Failed to register admin.");
    }
  };

  return (
    <div className="signup-container">
      <h2>Clinic Admin Sign Up</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <h3>Admin Information</h3>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={admin.fullName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={admin.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={admin.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={admin.confirmPassword}
          onChange={handleChange}
          required
        />

        <h3>Clinic Information</h3>
        <input
          type="text"
          name="clinicName"
          placeholder="Clinic Name"
          value={admin.clinicName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="clinicAddress"
          placeholder="Clinic Address"
          value={admin.clinicAddress}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="clinicPhone"
          placeholder="Clinic Phone"
          value={admin.clinicPhone}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="workingHours"
          placeholder="Working Hours (e.g., 9 AM - 5 PM)"
          value={admin.workingHours}
          onChange={handleChange}
          required
        />

        <button type="submit" className="signup-btn">Sign Up</button>
      </form>
    </div>
  );
}

export default AdminSignUp;
