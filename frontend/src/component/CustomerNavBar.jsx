import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext"; // Adjust the path based on your project structure
import { FaUserCircle, FaUser, FaHeadset, FaSignOutAlt } from "react-icons/fa"; // Import icons
import "../styles.css"; // Ensure this path is correct

const CustomerNavBar = () => {
  const { authState, loading, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const profileRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) {
    return null; // Return null while loading to avoid rendering the nav content
  }

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="header-business-logo">
          <img src="/logo.png" alt="Reservo Logo" className="logo-image" />
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/services" className="nav-link">
            Services
          </Link>
          <Link to="/contact" className="nav-link">
            Contact
          </Link>
          {authState.isAuthenticated ? (
            <>
              <Link to="/customer-bookings" className="nav-link">
                Manage Bookings
              </Link>
              <div className="profile-menu" ref={profileRef}>
                <button onClick={toggleDropdown} className="profile-button">
                  <FaUserCircle className="profile-icon" />
                </button>
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <FaUserCircle className="dropdown-avatar" />
                      <div className="user-info">
                        <p className="user-name">{authState.user?.username}</p>
                        <p className="user-email">{authState.user?.email}</p>
                      </div>
                    </div>
                    <Link to="/profile" className="dropdown-item">
                      <FaUser className="dropdown-icon" />
                      View Profile
                    </Link>
                    <Link to="/support" className="dropdown-item">
                      <FaHeadset className="dropdown-icon" />
                      Customer Support
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="dropdown-item logout-item"
                    >
                      <FaSignOutAlt className="dropdown-icon" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link to="/user-type" className="btn nav-link">
              Get Started
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default CustomerNavBar;
