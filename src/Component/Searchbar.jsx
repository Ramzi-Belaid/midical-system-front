import React from "react";
import { IoSearch } from "react-icons/io5";

function Searchbar() {
    return (
        <div className="search-bar">
            <input type="text" placeholder="Search..." className="search-input" />
            <button className="search-button"><IoSearch /></button>
        </div>
    );
}

export default Searchbar;
