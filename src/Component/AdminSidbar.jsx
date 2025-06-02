"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { BiCalendarCheck } from "react-icons/bi"
import { IoPeopleOutline } from "react-icons/io5"
import { FiSearch, FiX } from "react-icons/fi"
import { useAuth } from "../context/AuthContext"

import "./sidbar.css"
import Logo from "./Logo"

const AdminSidbar = () => {
  const location = useLocation()
  const [activePath, setActivePath] = useState(location.pathname)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchValue, setSearchValue] = useState("")
  const { role } = useAuth()

  useEffect(() => {
    setActivePath(location.pathname)
  }, [location.pathname])

  // Define all menu items with search keywords
  const menuItems = {
    main: [
      {
        path: "/Admin-Doctor",
        icon: IoPeopleOutline,
        label: "Add Doctor",
        keywords: ["add", "doctor", "physician", "d", "doc", "medical", "staff", "new doctor", "create doctor"],
      },
      {
        path: "/Admin-Secretary",
        icon: BiCalendarCheck,
        label: "Add Secretary",
        keywords: ["add", "secretary", "assistant", "s", "sec", "staff", "admin", "new secretary", "create secretary"],
      },
    ],
  }

  // Filter items based on search term
  const filterItems = (items) => {
    if (!searchTerm.trim()) return items

    return items.filter(
      (item) =>
        item.keywords.some((keyword) => keyword.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.label.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  const filteredMainItems = filterItems(menuItems.main)

  // Check if there are any results
  const hasResults = filteredMainItems.length > 0

  // Search handlers
  const handleInputChange = (e) => {
    const value = e.target.value
    setSearchValue(value)
    setSearchTerm(value)
  }

  const handleClear = () => {
    setSearchValue("")
    setSearchTerm("")
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSearchTerm(searchValue)
  }

  // Component to render menu item
  const MenuItem = ({ item }) => {
    const IconComponent = item.icon
    return (
      <li className={searchTerm ? "search-result" : ""}>
        <Link to={item.path} className={activePath === item.path ? "active" : ""}>
          <IconComponent className="icon" />
          <span>{item.label}</span>
        </Link>
      </li>
    )
  }

  // Component to render menu section
  const MenuSection = ({ title, items, show = true }) => {
    if (!show || items.length === 0) return null

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
    )
  }

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
          <MenuSection title="MAIN:" items={filteredMainItems} show={!searchTerm || filteredMainItems.length > 0} />
        </>
      )}

      {/* Show search summary when searching */}
      {searchTerm && hasResults && (
        <div className="search-summary">
          <p className="search-info">Found {filteredMainItems.length} result(s)</p>
        </div>
      )}
    </div>
  )
}

export default AdminSidbar
