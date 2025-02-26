import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "remixicon/fonts/remixicon.css";


import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext"; // ✅ تأكد من صحة المسار
import "./App.css";
import Header from "./Component/Header";
import Sidebar from "./Component/Sidbar";
import Menu from "./Component/Menu";
import Patient from "./Component/Patient";
import Appointments from "./Component/Appointments";
import MyCalendar from "./Component/MyCalendar";
import Notifications from "./Component/Notifications";
import Prescription from "./Component/Prescription";
import PrescriptionSearch from "./Component/PrescriptionSearch";
import NavigationBar from "./Component/NavigationBar";

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/NavigationBar" />;
};

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && <Sidebar />}
      {isAuthenticated && <Header />}
      <div className="main-container">
        <Routes>
          <Route path="/NavigationBar" element={<NavigationBar />} />
          <Route path="/" element={<ProtectedRoute element={<Menu />} />} />
          <Route path="/patients" element={<ProtectedRoute element={<Patient />} />} />
          <Route path="/appointments" element={<ProtectedRoute element={<Appointments />} />} />
          <Route path="/Schedule" element={<ProtectedRoute element={<MyCalendar />} />} />
          <Route path="/Notifications" element={<ProtectedRoute element={<Notifications />} />} />
          <Route path="/Prescription" element={<ProtectedRoute element={<Prescription />} />} />
          <Route path="/PrescriptionSearch" element={<ProtectedRoute element={<PrescriptionSearch />} />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
