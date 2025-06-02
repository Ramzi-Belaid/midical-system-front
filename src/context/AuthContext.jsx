import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsAdmin(user?.role === "admin");
  }, [user]);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    navigate(userData.role === "admin" ? "/Admin-Doctor" : "/menu", { replace: true });
  };

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
