import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./navigationBar.css";
import image4 from "../images/RR.png";

const NavigationBar = () => {
  const { isAuthenticated, login } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("doctor");
  const [credentials, setCredentials] = useState({ fullName: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // ✅ عند تسجيل الدخول، انتقل إلى "/menu" بشكل صحيح
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/menu", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // ✅ تسجيل الدخول بدون فحص البيانات (دخول مباشر)
  const handleLogin = () => {
    login({ fullName: credentials.fullName, role: selectedRole });
    setIsOpen(false);
  };

  return (
    <>
      <nav className="navbar-container">
        <img src={image4} alt="Logo" className="logo-home" />
        <div className="navbar-buttons">
          <button onClick={() => setIsOpen(true)} className="navbar-button">
            Login
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="overlay-container-login" onClick={() => setIsOpen(false)}>
          <div className="overlay-content-login" onClick={(e) => e.stopPropagation()}>
            <h2>Login</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <input
              type="text"
              placeholder="Full Name"
              value={credentials.fullName}
              onChange={(e) => setCredentials({ ...credentials, fullName: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />

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

            <button className="overlay-button" onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default NavigationBar;
