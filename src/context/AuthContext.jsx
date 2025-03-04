import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ✅ تسجيل الدخول
  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    
    // ✅ توجيه المستخدم حسب الدور
    if (userData.role === "doctor") {
      navigate("/menu", { replace: true });
    } else if (userData.role === "secretary") {
      navigate("/menu", { replace: true });
    }
  };

  // ✅ تسجيل الخروج
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
