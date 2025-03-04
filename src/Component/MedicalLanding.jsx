import React from "react";
import "./navigationBar.css";

const MedicalLanding = () => {
  return (
    <div className="container">
      
      <div className="content">
        {/* Left Section */}
        <div className="left-section">
          <p className="subtitle">WE ARE HERE FOR YOU</p>
          <h1 className="title">Welcome to <br /> Medical Clinic</h1>
          <p className="description">
            Get the best healthcare experience without having to leave home. We
            follow the path of development, regularly expanding the scope of our
            services.
          </p>
          <div className="buttons">
            <button className="appointment-button">Make An Appointment</button>
            <a href="/" className="see-how">See How We Work →</a>
          </div>
        </div>

        {/* Right Section (Doctor Images) */}
        <div className="right-section">
          <div className="large-image">
            <img src="https://via.placeholder.com/200x250" alt="Doctor 1" />
          </div>
          <div className="small-images">
            <div className="small-image">
              <img src="https://via.placeholder.com/120x120" alt="Doctor 2" />
            </div>
            <div className="small-image">
              <img src="https://via.placeholder.com/120x120" alt="Doctor 3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalLanding;
