import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlineSchedule } from "react-icons/ai";
import { BiCalendarCheck } from "react-icons/bi";
import { IoPeopleOutline } from "react-icons/io5";
import { BsPrescription2 } from "react-icons/bs";
import { GiMedicinePills } from "react-icons/gi";


import "./sidbar.css";
import Searchbar from "./Searchbar";
import Logo from "./Logo";

function Sidebar() {
  const location = useLocation(); // الحصول على المسار الحالي
  const [activePath, setActivePath] = useState(location.pathname);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]); // تغيير التحديد عند الانتقال لصفحة أخرى

  return (
    <div className="sidebar">
      <Logo />
      <Searchbar />

      <p className="sidebar-title">MAIN:</p>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/menu" className={activePath === "/" ? "active" : ""}>
              <LuLayoutDashboard className="icon" />Dashboard
            </Link>
          </li>
          <li>
            <Link to="/patients" className={activePath === "/patients" ? "active" : ""}>
              <IoPeopleOutline className="icon" />Patients
            </Link>
          </li>
          <li>
            <Link to="/appointments" className={activePath === "/appointments" ? "active" : ""}>
              <BiCalendarCheck className="icon" />Appointment
            </Link>
          </li>
          <li>
            <Link to="/Schedule" className={activePath === "/Schedule" ? "active" : ""}>
              <AiOutlineSchedule className="icon" />Schedule
            </Link>
          </li>
          <li>
            <Link to="/Prescription" className={activePath === "/Prescription" ? "active" : ""}>
              <GiMedicinePills className="icon" />Prescription
            </Link>
          </li>
          <li>
            <Link to="/prescription-search" className={activePath === "/prescription-search" ? "active" : ""}>
              <BsPrescription2 className="icon" />PrescriptionSearch
            </Link>
          </li>
        </ul>
      </nav>

      <p className="sidebar-title">Other Menu:</p>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/Notifications" className={activePath === "/Notifications" ? "active" : ""}>
              <IoMdNotificationsOutline className="icon" />Notifications
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
