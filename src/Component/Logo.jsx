import React from "react";
import { Link } from "react-router-dom";
import logo from "../images/RR.png";

function Logo() {
    return (
        <div className="logo-container">
            <Link to="/" className="logo">
                <img 
                    alt="Medical System Logo" 
                    src={logo || "/placeholder.svg"} 
                    className="logo-img"
                    onError={(e) => {
                        e.target.style.display = "none";
                        console.log("Logo image failed to load");
                    }}
                /> 
            </Link>
        </div>
    );
}

export default Logo;