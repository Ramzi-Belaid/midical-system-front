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
import NavigationBar from "./Component/NavigationBar";
import Secretarypatients from "./Component/Secretarypatients";
import Secretaryappointments from "./Component/Secretary-appointments";

// ✅ مكون لحماية المسارات بناءً على الدور
const ProtectedRoute = ({ element, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user?.role)) return <Navigate to="/" replace />;

  return element;
};

function App() {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation(); // ✅ الحصول على المسار الحالي

  // ✅ إخفاء Navbar و Sidebar إذا كان المستخدم في صفحة /login
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {/* ✅ عرض Navbar و Sidebar فقط إذا لم يكن المستخدم في صفحة /login */}
      {!isLoginPage && isAuthenticated && user?.role === "doctor" && <Header />}
      {!isLoginPage && isAuthenticated && user?.role === "secretary" && <SecretaryHeader />}
      {!isLoginPage && isAuthenticated && user?.role === "doctor" && <Sidebar />}
      {!isLoginPage && isAuthenticated && user?.role === "secretary" && <SecretarySidebar />}

      <div className="main-container">
        <Routes>
          {/* ✅ التوجيه التلقائي إلى /login إذا لم يكن المستخدم مسجلاً */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* ✅ صفحة تسجيل الدخول */}
          <Route path="/login" element={<NavigationBar />} />

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
        </Routes>
      </div>
    </>
  );
}

export default App;
