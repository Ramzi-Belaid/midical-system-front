import React from "react";
import "./navbar.css"; // استيراد ملف التنسيق

function NavMessage() {
  return (

    <li className="nav-item dropdown">
      {/* Message Icon */}
      <a className="nav-link nav-icon" href="/" data-bs-toggle="dropdown">
        <i className="bi bi-chat-left-text" style={{ fontSize: "20px" }}></i>
        <div className="badge bg-success badge-number">
           <div className="div">3</div> 
        </div>
      </a>

      {/* Dropdown Messages Menu */}
      <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow messages">
        {/* Header */}
        <li className="dropdown-header">
          <h7>You have 3 new messages</h7>
        </li>

        <li>
          <hr className="dropdown-divider" />
        </li>

        {/* First Message */}
        <li className="message-item">
            <div>
              <h4>David Muldon</h4>
              <p>
                This is due to the pain and the loss of the right place and the
                labor officia is at home...
              </p>
              <p className="time">8 hrs ago</p>
            </div>
        </li>


        {/* Footer */}
        <li className="dropdown-footer">
        <a href="/" className="button">Show all messages</a>
        </li>

      </ul>
    </li>
  );
}

export default NavMessage;
