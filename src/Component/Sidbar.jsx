import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { CiFileOn } from "react-icons/ci";
import { LuLayoutDashboard } from "react-icons/lu";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlineSchedule } from "react-icons/ai";
import { BiCalendarCheck } from "react-icons/bi";
import { IoPeopleOutline } from "react-icons/io5";
import { BsPrescription2 } from "react-icons/bs";
import { GiMedicinePills } from "react-icons/gi";
import { FiSearch, FiX } from "react-icons/fi";
import "./sidbar.css";
import Logo from "./Logo";

function Sidebar() {
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);
  const [specialization, setSpecialization] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setActivePath(location.pathname);
    fetchRoleDr();
  }, [location.pathname]);

  const fetchRoleDr = async () => {
    try {
      const doctorToken = localStorage.getItem("doctorToken");
      const response = await fetch('http://localhost:3000/api/v1/User/doctors/getRoleDr', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${doctorToken}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setSpecialization(data.doctor.specialization);
      }
    } catch (error) {
      console.error('Error fetching doctor role:', error);
    }
  };

  // Define all menu items with search keywords
  const menuItems = {
    main: [
      {
        path: "/menu",
        icon: LuLayoutDashboard,
        label: "Dashboard",
        keywords: ["dashboard", "main", "home", "d", "dash"],
      },
      {
        path: "/patients",
        icon: IoPeopleOutline,
        label: "Patients",
        keywords: ["patients", "patient", "p", "people"],
      },
      {
        path: "/appointments",
        icon: BiCalendarCheck,
        label: "Appointment",
        keywords: ["appointment", "appointments", "a", "appoint", "calendar"],
      },
      {
        path: "/Schedule",
        icon: AiOutlineSchedule,
        label: "Schedule",
        keywords: ["schedule", "s", "sched", "time"],
      },
    ],
    medical: [
      {
        path: "/Prescription",
        icon: GiMedicinePills,
        label: "Prescription",
        keywords: ["prescription", "medicine", "drug", "p", "presc"],
      },
      {
        path: "/prescription-search",
        icon: BsPrescription2,
        label: "Prescription Search",
        keywords: ["prescription", "search", "find", "p", "presc"],
      },
      ...(specialization === "Ophthalmology"
        ? [
            {
              path: "/Medical_File",
              icon: CiFileOn,
              label: "Medical File Ophthalmology",
              keywords: ["medical", "file", "orl", "m", "med"],
            },
            {
              path: "/Dossier_Midcal_File",
              icon: CiFileOn,
              label: "Folder of Medical File Ophthalmology",
              keywords: ["folder", "medical", "file", "orl", "f", "dossier"],
            },
          ]
        : []),
    ],
    other: [
      {
        path: "/Notifications",
        icon: IoMdNotificationsOutline,
        label: "Notifications",
        keywords: ["notifications", "alerts", "n", "notif"],
      },
    ],
  };

  // Filter items based on search term
  const filterItems = (items) => {
    if (!searchTerm.trim()) return items;

    return items.filter(
      (item) =>
        item.keywords.some((keyword) => keyword.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredMainItems = filterItems(menuItems.main);
  const filteredMedicalItems = filterItems(menuItems.medical);
  const filteredOtherItems = filterItems(menuItems.other);

  // Check if there are any results
  const hasResults = filteredMainItems.length > 0 || filteredMedicalItems.length > 0 || filteredOtherItems.length > 0;

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
      {/* استخدام مكون Logo */}
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
            title="Medical Menu:"
            items={filteredMedicalItems}
            show={!searchTerm || filteredMedicalItems.length > 0}
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
            Found {filteredMainItems.length + filteredMedicalItems.length + filteredOtherItems.length} result(s)
          </p>
        </div>
      )}
    </div>
  );
}

export default Sidebar;