import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BiCalendarCheck } from "react-icons/bi";
import { IoPeopleOutline } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";

import "./sidbar.css";
import Searchbar from "./Searchbar";
import Logo from "./Logo";

const Sidebar = () => {
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
            <Link to="/" className={activePath === "/" ? "active" : ""}>
              <LuLayoutDashboard className="icon" /> Dashboard
            </Link>
          </li>

          {/* ✅ الطبيب فقط يرى صفحة المرضى الخاصة به */}
          {role === "doctor" && (
            <li>
              <Link to="/patients" className={activePath === "/patients" ? "active" : ""}>
                <IoPeopleOutline className="icon" /> Patients
              </Link>
            </li>
          )}

              <li>
                <Link to="/secretary-patients" className={activePath === "/secretary-patients" ? "active" : ""}>
                  <IoPeopleOutline className="icon" /> Secretary Patients
                </Link>
              </li>
              <li>
                <Link to="/Secretary-appointments" className={activePath === "/Secretary-appointments" ? "active" : ""}>
                  <BiCalendarCheck className="icon" /> Secretary Appointments
                </Link>
              </li>
        </ul>
      </nav>

      <p className="sidebar-title">Other Menu:</p>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/notifications" className={activePath === "/notifications" ? "active" : ""}>
              <IoMdNotificationsOutline className="icon" /> Notifications
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
