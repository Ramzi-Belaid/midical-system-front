import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BiCalendarCheck } from "react-icons/bi";
import { IoPeopleOutline } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import { AiOutlineSchedule } from "react-icons/ai";
import { FaRestroom } from "react-icons/fa";
import { FiSearch, FiX } from "react-icons/fi";

import "./sidbar.css";
import Logo from "./Logo";

const Sidebar = () => {
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const { role } = useAuth();

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  // Define all menu items with search keywords
  const menuItems = {
    main: [
      {
        path: "/secretary-menu",
        icon: LuLayoutDashboard,
        label: "Dashboard",
        keywords: ["dashboard", "main", "home", "d", "dash"],
        show: true,
      },
      {
        path: "/patients",
        icon: IoPeopleOutline,
        label: "Patients",
        keywords: ["patients", "patient", "p", "people"],
        show: role === "doctor",
      },
      {
        path: "/secretary-patients",
        icon: IoPeopleOutline,
        label: "Secretary Patients",
        keywords: ["secretary", "patients", "patient", "s", "sec"],
        show: true,
      },
      {
        path: "/Secretary-appointments",
        icon: BiCalendarCheck,
        label: "Secretary Appointments",
        keywords: ["secretary", "appointment", "appointments", "a", "appoint"],
        show: true,
      },
      {
        path: "/Secretary-shedule",
        icon: AiOutlineSchedule,
        label: "Secretary-Shedule",
        keywords: ["secretary", "schedule", "shedule", "s", "sched"],
        show: true,
      },
    ],
    other: [
      {
        path: "/secretary-notifications",
        icon: IoMdNotificationsOutline,
        label: "Notifications",
        keywords: ["notifications", "alerts", "n", "notif"],
        show: true,
      },
      {
        path: "/secretary-waiting_room",
        icon: FaRestroom,
        label: "Waiting Room",
        keywords: ["waiting", "room", "w", "wait", "restroom"],
        show: true,
      },
    ],
  };

  // Filter items based on search term
  const filterItems = (items) => {
    if (!searchTerm.trim()) return items.filter(item => item.show);

    return items.filter(
      (item) =>
        item.show &&
        (item.keywords.some((keyword) => keyword.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.label.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const filteredMainItems = filterItems(menuItems.main);
  const filteredOtherItems = filterItems(menuItems.other);

  // Check if there are any results
  const hasResults = filteredMainItems.length > 0 || filteredOtherItems.length > 0;

  // Search handlers
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    setSearchTerm(value);
  };

  const handleClear = () => {
    setSearchValue("");
    setSearchTerm("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(searchValue);
  };

  // Component to render menu item
  const MenuItem = ({ item }) => {
    const IconComponent = item.icon;
    return (
      <li className={searchTerm ? "search-result" : ""}>
        <Link to={item.path} className={activePath === item.path ? "active" : ""}>
          <IconComponent className="icon" />
          <span>{item.label}</span>
        </Link>
      </li>
    );
  };

  // Component to render menu section
  const MenuSection = ({ title, items, show = true }) => {
    if (!show || items.length === 0) return null;

    return (
      <>
        <p className="sidebar-title">{title}</p>
        <nav className="sidebar-nav">
          <ul>
            {items.map((item, index) => (
              <MenuItem key={index} item={item} />
            ))}
          </ul>
        </nav>
      </>
    );
  };

  return (
    <div className="sidebar">
      <Logo />
      
      {/* Search Bar */}
      <form className="search-bar" onSubmit={handleSubmit}>
        <input
          type="text"
          className="search-input"
          placeholder="Search menu..."
          value={searchValue}
          onChange={handleInputChange}
        />

        {searchValue && (
          <button type="button" className="clear-button" onClick={handleClear} title="Clear search">
            <FiX />
          </button>
        )}

        <button type="submit" className="search-button" title="Search">
          <FiSearch />
        </button>
      </form>

      {/* Show no results message */}
      {searchTerm && !hasResults && (
        <div className="no-results">
          <p>No results found for "{searchTerm}"</p>
          <button className="clear-search" onClick={() => setSearchTerm("")}>
            Clear Search
          </button>
        </div>
      )}

      {/* Show results or full menu */}
      {(!searchTerm || hasResults) && (
        <>
          <MenuSection 
            title="MAIN:" 
            items={filteredMainItems} 
            show={!searchTerm || filteredMainItems.length > 0} 
          />

          <MenuSection
            title="Other Menu:"
            items={filteredOtherItems}
            show={!searchTerm || filteredOtherItems.length > 0}
          />
        </>
      )}

      {/* Show search summary when searching */}
      {searchTerm && hasResults && (
        <div className="search-summary">
          <p className="search-info">
            Found {filteredMainItems.length + filteredOtherItems.length} result(s)
          </p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;