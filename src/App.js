import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "remixicon/fonts/remixicon.css";

import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import "./App.css";
import Header from "./Component/Header";
import Sidebar from "./Component/Sidbar";
import SecretarySidebar from "./Component/SecretarySidebar";
import SecretaryHeader from "./Component/SecretaryHeader";
import Menu from "./Component/Menu";
import Patient from "./Component/Patient";
import Appointments from "./Component/Appointments";
import MyCalendar from "./Component/MyCalendar";
import Notifications from "./Component/Notifications";
import Prescription from "./Component/Prescription";
import PrescriptionSearch from "./Component/PrescriptionSearch";
import Secretarypatients from "./Component/Secretarypatients";
import Secretaryappointments from "./Component/Secretary-appointments";
import MedicalLanding from "./Component/MedicalLanding";
import AdminSignUp from "./Component/AdminSignUp";
import AdminDoctor from "./Component/AdminDoctor"; // ✅ لوحة تحكم المسؤول
import AdminHeader from './Component/AdminHeader'
import AdminSidbar from './Component/AdminSidbar'
import AdminSecretary from './Component/AdminSecretary'
// ✅ مكون لحماية المسارات بناءً على الدور
const ProtectedRoute = ({ element, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (!allowedRoles.includes(user?.role)) return <Navigate to="/menu" replace />;

  return element;
};

function App() {
  const { isAuthenticated, user, isAdmin } = useAuth();
  const location = useLocation();

  const isLoginPage = location.pathname === "/";
  const isDoctor = user?.role === "doctor";
  const isSecretary = user?.role === "secretary";

  return (
    <>
      {/* ✅ عرض Navbar و Sidebar فقط إذا لم يكن المستخدم في صفحة /login */}
      {!isLoginPage && isAuthenticated && (
        <>
          {isDoctor && <Header />}
          {isSecretary && <SecretaryHeader />}
          {isDoctor && <Sidebar />}
          {isSecretary && <SecretarySidebar />}
          {isAdmin && <AdminHeader />} {/* ✅ عرض Navbar خاص بالمشرف */}
          {isAdmin && <AdminSidbar />} {/* ✅ عرض Navbar خاص بالمشرف */}

        </>
      )}

      <div className="main-container">
        <Routes>
          {/* ✅ إعادة توجيه المستخدم المصادق عليه بعيدًا عن /login */}
          <Route path="/" element={isAuthenticated ? <Navigate to="/menu" replace /> : <MedicalLanding />} />
          <Route path="/admin-signup" element={<AdminSignUp />} />

          {/* ✅ المسارات المحمية للطبيب والسكرتير */}
          <Route path="/menu" element={<ProtectedRoute element={<Menu />} allowedRoles={["doctor", "secretary"]} />} />
          <Route path="/patients" element={<ProtectedRoute element={<Patient />} allowedRoles={["doctor"]} />} />
          <Route path="/appointments" element={<ProtectedRoute element={<Appointments />} allowedRoles={["doctor"]} />} />
          <Route path="/schedule" element={<ProtectedRoute element={<MyCalendar />} allowedRoles={["doctor"]} />} />
          <Route path="/notifications" element={<ProtectedRoute element={<Notifications />} allowedRoles={["doctor"]} />} />
          <Route path="/prescription" element={<ProtectedRoute element={<Prescription />} allowedRoles={["doctor"]} />} />
          <Route path="/prescription-search" element={<ProtectedRoute element={<PrescriptionSearch />} allowedRoles={["doctor"]} />} />

          {/* ✅ المسارات المحمية للسكرتير */}
          <Route path="/secretary-patients" element={<ProtectedRoute element={<Secretarypatients />} allowedRoles={["secretary"]} />} />
          <Route path="/secretary-appointments" element={<ProtectedRoute element={<Secretaryappointments />} allowedRoles={["secretary"]} />} />

          {/* ✅ المسارات المحمية للمشرف */}
          <Route path="/Admin-Doctor" element={<ProtectedRoute element={<AdminDoctor />} allowedRoles={["admin"]} />} />
          <Route path="/Admin-Secretary" element={<ProtectedRoute element={<AdminSecretary />} allowedRoles={["admin"]} />} />

          
        </Routes>
      </div>
    </>
  );
}

export default App;
