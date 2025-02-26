import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./navigationBar.css";
import image1 from '../images/rrr.png'
import image2 from '../images/do.png'
import image3 from '../images/images2.png'
import image4 from '../images/RR.png'

const NavigationBar = () => {
  const { isAuthenticated, login } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="navbar-container">
      <img src={image4} alt="" className="logo-home"/>
      <div className="navbar-buttons">
          {isAuthenticated ? (
            <p className="welcome-text">Welcome, User!</p> 
          ) : (
            <>
              <button onClick={() => setIsOpen(true)} className="navbar-button">Login</button>
              <button onClick={() => setIsOpen(true)} className="navbar-button">Sign Up</button>
            </>
          )}
        </div>
      </nav>

      {isOpen && !isAuthenticated && (
        <div className="overlay-container" onClick={() => setIsOpen(false)}>
          <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
            <h2>Login</h2>
            <button className="overlay-button" onClick={login}>Enter Without Sign Up</button>
          </div>
        </div>
      )}

      <div className="container-home">
        {/* Left Section */}
        <div className="hero-left">
          <p className="subtitle">WE ARE HERE FOR YOU</p>
          <h1 className="title">Welcome to <br /> Medical Clinic</h1>
          <p className="description">
          Get the best health experience. We follow the development path, and we regularly work on expanding the scope of our services.
          </p>
          <button className="appointment-button">hello hello hello</button>

          
        </div>

        {/* Right Section (Doctor Images) */}
        <div className="hero-right">
          <div className="hero-large-image">
            <img src={image1} alt="Doctor 1" />
          </div>
          <div className="hero-small-images">
            <div className="hero-small-image">
              <img src={image2} alt="Doctor 2" />
            </div>
            <div className="hero-small-image">
              <img src={image3} alt="Doctor 3" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavigationBar;
