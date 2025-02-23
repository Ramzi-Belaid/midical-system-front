import { useState } from "react";
import NavOverlay from "./NavOverlay";
import profileImg from "../images/profile_M.jpg"; // تأكد من وجود الصورة



function Navbar() {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const openOverlay = ()=> {
    setIsOverlayOpen(true)
  } 
  const clsoeOverlay = ()=> {
    setIsOverlayOpen(false)
  } 

  return (
    <>
      <div className="nav-ul">
          <img
            src={profileImg}
            alt="Profile"
            className="nav-avatar"
            onClick={openOverlay}
          />
        
      </div>

      {/* النافذة المنبثقة */}
      <NavOverlay isOverlayOpen={isOverlayOpen} clsoeOverlay={clsoeOverlay}/>
      </>
  );
}

export default Navbar;
