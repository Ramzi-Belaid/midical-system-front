import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // ✅ حالة جديدة للمسؤول
  const navigate = useNavigate();

  // ✅ تسجيل الدخول
  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setIsAdmin(userData.role === "admin"); // ✅ تحديد ما إذا كان المستخدم مسؤولًا

    // ✅ توجيه المستخدم حسب الدور
    if (userData.role === "doctor" || userData.role === "secretary") {
      navigate("/menu", { replace: true });
    } else if (userData.role === "admin") {
      navigate("/admin-dashboard", { replace: true }); // ✅ توجيه المشرف إلى لوحة التحكم
    }
  };

  // ✅ تسجيل الخروج
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    navigate("/", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
