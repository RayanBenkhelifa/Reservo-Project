import React from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaServicestack,
  FaEnvelope,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa"; // Import icons

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-links">
          <Link to="/">
            <FaHome /> Home
          </Link>
          <Link to="/services">
            <FaServicestack /> Services
          </Link>
          <Link to="/contact">
            <FaEnvelope /> Contact
          </Link>
        </div>
        <div className="footer-social">
          <a
            href="https://github.com/RayanBenkhelifa/Reservo-Project"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub />
          </a>
          <a
            href="https://linkedin.com/in/Rayanbenkhelifa"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin />
          </a>
        </div>
        <p>© {new Date().getFullYear()} Reservo. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
