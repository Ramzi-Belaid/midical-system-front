import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./navigationBar.css";
import image4 from "../images/RR.png";
import videoFile from "../images/anmation.mp4"; // ✅ استيراد الفيديو
import { Link } from "react-router-dom";


const MedicalLanding = () => {
  const { isAuthenticated, login } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false); 
  const [isAdminLogin, setIsAdminLogin] = useState(false); // ✅ تحديد نوع تسجيل الدخول (Admin أو عادي)
  const [selectedRole, setSelectedRole] = useState("doctor");
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/menu", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = () => {
    if (credentials.username && credentials.password) {
      login({ username: credentials.username, role: isAdminLogin ? "admin" : selectedRole });
      setIsLoginOpen(false);
    } else {
      setErrorMessage("Please enter both username and password.");
    }
  };

  // ✅ عند الضغط على "Administrator Access"
  const handleAdminAccess = () => {
    setIsAdminLogin(true); // ✅ تسجيل الدخول كمسؤول
    setIsLoginOpen(true); 
  };

  // ✅ عند الضغط على "Login" العادي
  const handleNormalLogin = () => {
    setIsAdminLogin(false); // ✅ تسجيل الدخول كطبيب أو سكرتير
    setIsLoginOpen(true);
  };

  return (
    <div className="page-container">
      {/* ✅ Navbar ثابت */}
      <nav className="navbar-container">
        <img src={image4} alt="Logo" className="logo-home" />
        <div className="navbar-buttons">
          <button onClick={handleNormalLogin} className="navbar-button">
            Login
          </button>
        </div>
      </nav>

      {/* ✅ محتوى الصفحة الرئيسية */}
      <div className="container">
        <div className="content">
          {/* القسم الأيسر (النص) */}
          <div className="left-section">
            <p className="subtitle">WE ARE HERE FOR YOU</p>
            <h1 className="title">
              Welcome to <br /> Medical Clinic
            </h1>
            <p className="description">
              Get the best healthcare experience without having to leave home. We follow the path of development, regularly expanding the scope of our services.
            </p>
            <div className="buttons">
              <button className="appointment-button" onClick={handleAdminAccess}>
                Administrator Access
              </button>
              <Link to="/admin-signup" className="see-how">Administrator Sign Up →</Link>
              </div>
          </div>

          {/* ✅ القسم الأيمن (صور الأطباء والفيديو) */}
          <div className="right-section">
            <div className="large-image"></div>
            <div className="small-images">
              <div className="small-image">
                <video src={videoFile} className="background-video" autoPlay loop muted playsInline />
              </div>
              <div className="small-image"></div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ نافذة تسجيل الدخول */}
      {isLoginOpen && (
        <div className="overlay-container-login" onClick={() => setIsLoginOpen(false)}>
          <div className="overlay-content-login" onClick={(e) => e.stopPropagation()}>
            <h2>{isAdminLogin ? "Administrator Login" : "Login"}</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <input
              type="text"
              placeholder="Username"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />

            {/* ✅ فقط في تسجيل الدخول العادي يظهر خيار اختيار الدور */}
            {!isAdminLogin && (
              <div className="role-selection">
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="doctor"
                    checked={selectedRole === "doctor"}
                    onChange={() => setSelectedRole("doctor")}
                  />
                  Doctor
                </label>
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="secretary"
                    checked={selectedRole === "secretary"}
                    onChange={() => setSelectedRole("secretary")}
                  />
                  Secretary
                </label>
              </div>
            )}

            <button className="overlay-button" onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalLanding;
