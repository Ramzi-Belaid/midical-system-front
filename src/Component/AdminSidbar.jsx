import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { BiCalendarCheck } from "react-icons/bi";
import { IoPeopleOutline } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";

import "./sidbar.css";
import Searchbar from "./Searchbar";
import Logo from "./Logo";

const AdminSidbar = () => {
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);
  const { role } = useAuth();

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  return (
    <div className="sidebar">
      <Logo />
      <Searchbar />

      <p className="sidebar-title">MAIN:</p>
      <nav className="sidebar-nav">
        <ul>
              <li>
                <Link to="/Admin-Doctor" className={activePath === "/Admin-Doctor" ? "active" : ""}>
                  <IoPeopleOutline className="icon" /> Add Doctor
                </Link>
              </li>
              <li>
                <Link to="/Admin-Secretary" className={activePath === "/Admin-Secretary" ? "active" : ""}>
                  <BiCalendarCheck className="icon" /> Add Secretary
                </Link>
              </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidbar;
