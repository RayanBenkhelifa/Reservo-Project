// Navbar.js
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext"; // Import AuthContext
import { FaSignOutAlt } from "react-icons/fa"; // Import logout icon

function Navbar() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext); // Access the logout function

  const handleLogoClick = () => {
    navigate("/home");
  };

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect to login page or home after logout
  };

  return (
    <nav className="sidebar">
      <div
        className="business_logo"
        onClick={handleLogoClick}
        style={{ cursor: "pointer" }}
      >
        <img src="/logo.png" alt="Reservo Logo" className="logo-image" />
      </div>
      <ul className="nav-links">
        <li>
          <a href="/business-dashboard">Up Next</a>
        </li>
        <li>
          <a href="/business-services">Services</a>
        </li>
        <li>
          <a href="/business-add-provider">Providers</a>
        </li>
        <li>
          <a href="/review-feedback">Review Feedback</a> {/* New Menu Item */}
        </li>
        <li>
          <a href="/edit-profile">Edit Profile</a>
        </li>
      </ul>

      {/* Logout Button */}
      <div className="logout-section">
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt className="logout-icon" /> Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
