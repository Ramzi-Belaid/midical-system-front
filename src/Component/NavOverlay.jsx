import React, { useEffect, useState } from "react";
import { FaUserDoctor } from "react-icons/fa6";
import { MdPersonalInjury } from "react-icons/md";
import { BsPinAngleFill } from "react-icons/bs";
import axios from "axios";
import Overlay from "./Overlay";
import profileImg from "../images/profile_M.jpg"; // تأكد من وجود الصورة في المسار الصحيح

const NavOverlay = ({ isOverlayOpen, clsoeOverlay }) => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOverlayOpen) return;

    const doctorToken = localStorage.getItem("doctorToken");
    if (!doctorToken) {
      setError("Doctor token not found!");
      setLoading(false);
      return;
    }

    const fetchDoctorData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/User/doctors/Profil", {
          headers: { Authorization: `Bearer ${doctorToken}` },
        });
        setDoctor(response.data.doctor);
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
              {/* معلومات الطبيب */}
              <div className="inf-profile-left">
                <div className="profil">
                  <img
                    src={doctor?.profileImage ? `http://localhost:3000/${doctor.profileImage}` : profileImg}
                    alt="Doctor"
                    className="profile-image"
                  />
                </div>
                <div className="profil-info">
                  <h4>{doctor?.fullName || "Unknown Doctor"}</h4>
                  <div><strong>Specialization:</strong> {doctor?.specialization || "Specialist"}</div>
                  <div><strong>Hospital:</strong> {doctor?.Hospital || "Unknown Hospital"}</div>
                  <div><strong>Email:</strong> {doctor?.email || "No Email"}</div>
                  <div><strong>Phone:</strong> {doctor?.phone || "(Not Available)"}</div>
                  <div><strong>Location:</strong> {doctor?.location || "No location provided"}</div>
                  <div><strong>Online:</strong> {doctor?.Online || "Unknown"}</div>
                </div>
              </div>

              {/* السيرة الذاتية */}
              <div className="sectionn">
                <h3 className="section-titlee">Short Bio</h3>
                <p className="section-text">"{doctor?.Short_Bio || "No bio available"}"</p>
              </div>

              {/* قائمة الخدمات والأسعار */}
              <div className="sectionn">
                <h3 className="section-titlee">Services and Price</h3>
                <ul className="service-list">
                  {doctor?.services?.length > 0 ? (
                    doctor.services.map((item, index) => (
                      <li key={index} className="service-list-item">
                        {item.service}
                        <span className="service-price">${item.price}</span>
                      </li>
                    ))
                  ) : (
                    <li>No services available</li>
                  )}
                </ul>
              </div>
            </div>

            {/* معلومات إضافية */}
            <div className="container-left">
              <div className="inf-profile-right">
                <h3 className="section-titlee">About the Doctor</h3>
                <ul className="section-text">
                  <li>
                    <div><BsPinAngleFill color="yellow" size={20} /> {doctor?.yearsOfExperience || "N/A"} years</div>
                    <div><span>of experience</span></div>
                  </li>
                  <li>
                    <div><MdPersonalInjury color="yellow" size={20} /> Online {doctor?.Online || "Unknown"} consultations available</div>
                  </li>
                  <li>
                    <div><FaUserDoctor color="yellow" size={20} /> Doctor ID: {doctor?._id}</div>
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
