import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "../styles.css";

function Home() {
  return (
    <>
      <header className="header">
        <div className="container">
          <Link to="/index" className="header-business-logo">
            <img src="/logo.png" alt="Reservo Logo" className="logo-image" />
          </Link>
          <nav className="nav">
            <Link to="/index" className="active">
              Home
            </Link>
           <Link to="/customer-bookings">Manage Bookings</Link>
            <Link to="/services">Services</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/user-type" className="btn">
              Get Started
            </Link>
          </nav>
        </div>
      </header>
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <h1>Scheduling that puts time in your hands</h1>
          <p>Manage your appointments with ease and convenience.</p>
          <a href="/user-type" className="btn">
            Get Started
          </a>
          <a href="/contact" className="btn-secondary">
            Contact Sales
          </a>
        </div>
      </section>
      <section className="features">
        <div className="container">
          <h2>The all-in-one solution for your business</h2>
          <p>We handle the admin while you do more of what you love.</p>
          <div className="feature-grid">
            <div className="feature-card">
              <h3>Booking</h3>
              <p>
                Efficiently manage appointments and schedules for your
                customers.
              </p>
            </div>
            <div className="feature-card">
              <h3>Payments</h3>
              <p>
                Secure and easy-to-use payment processing for your business.
              </p>
            </div>
            <div className="feature-card">
              <h3>Customer Management</h3>
              <p>Keep track of your customers and their preferences.</p>
            </div>
          </div>
        </div>
      </section>
      <footer className="footer">
        <div className="container">
          <p>Â© 2024 Reservo. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default Home;
