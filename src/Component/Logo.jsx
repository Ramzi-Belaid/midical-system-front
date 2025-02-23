import React from "react";
import logo from "../images/RR.png"; // Correct import

function Logo() {
    return (
        <>
        <div className="logo-container">
            <a href="/" className="logo">
                <img alt="rr" src={logo} className="logo-img" /> {/* Use imported image */}
            </a>
            </div>
        </>

    );
}

export default Logo;
