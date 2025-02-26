import React, { useEffect, useState } from "react";
import { FaUserDoctor } from "react-icons/fa6";
import { MdPersonalInjury } from "react-icons/md";
import { BsPinAngleFill } from "react-icons/bs";
import axios from "axios"; // استيراد axios لجلب البيانات
import Overlay from "./Overlay";
import profileImg from "../images/profile_M.jpg"; // تأكد من وجود الصورة

const NavOverlay = ({ isOverlayOpen, clsoeOverlay }) => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOverlayOpen) return;

    const fetchDoctorData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/users/1"); 
        setDoctor(response.data);
      } catch (err) {
        setError("Failed to load doctor data");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [isOverlayOpen]);

  if (!isOverlayOpen) return null;

  return (
    <Overlay isOpen={isOverlayOpen} onClose={clsoeOverlay}>
      <div className="container-avatar">
        {loading ? (
          <p className="loading">Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            <div className="rr">
              {/* الصورة والمعلومات الأساسية */}
              <div className="inf-profile-left">
                <div className="profil">
                  <img src={profileImg} alt="Doctor" className="profile-image" />
                </div>
                <div className="profil-info">
                  <h4>{doctor.name}</h4>
                  <p>{doctor.specialty || "Specialist"}</p>
                  <p><i className="bi bi-shop"></i> {doctor.location || "Unknown"}</p>
                  <p><i className="bi bi-envelope"></i> {doctor.email}</p>
                  <p><i className="bi bi-telephone-fill"></i> {doctor.phone || "(Not Available)"}</p>
                  <p className="rating">
                    {[...Array(5)].map((_, index) => (
                      <i key={index} className="bi bi-star-fill"></i>
                    ))}
                  </p>
                </div>
              </div>

              {/* السيرة الذاتية */}
              <div className="section">
                <h3 className="section-title">Short Bio</h3>
                <p className="section-text">"{doctor.description || "No bio available"}"</p>
                <a href="/" className="read-more">Read more</a>
              </div>

              {/* قائمة الخدمات والأسعار */}
              <div className="section">
                <h3 className="section-title">Services and Price List</h3>
                <ul className="service-list">
                  {doctor.services?.map((service, index) => (
                    <li key={index} className="service-list-item">
                      {service.name} <span className="service-price">${service.price}</span>
                    </li>
                  ))}
                </ul>
                <a href="/" className="read-more">Read more</a>
              </div>
            </div>

            {/* معلومات إضافية عن الدكتور */}
            <div className="container-left">
              <div className="inf-profile-right">
                <h3 className="section-title">About the Doctor</h3>
                <ul className="section-text">
                  <li>
                    <div><BsPinAngleFill color="yellow" size={20} /> {doctor.experience || "N/A"} years</div>
                    <div><span>of experience</span></div>
                  </li>
                  <li>
                    <div><MdPersonalInjury color="yellow" size={20} /> {doctor.recommendation || "N/A"}% Recommend</div>
                    <div><span>({doctor.patients || 0} patients)</span></div>
                  </li>
                  <li>
                    <div><FaUserDoctor color="yellow" size={20} /> {doctor.availability || "Not Available"}</div>
                    <div><span>consultations available</span></div>
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </Overlay>
  );
};

export default NavOverlay;
