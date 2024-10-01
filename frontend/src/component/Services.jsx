import React from 'react';
import '../styles.css';

function Services() {
  return (
    <>
      <header className="header">
        <div className="container">
          <a href="/index" className="logo">Reservo</a>
          <nav className="nav">
            <a href="/index" className="active">Home</a>
            <a href="/services">Services</a>
            <a href="/contact">Contact</a>
            <a href="/user-type" className="btn">Get Started</a>
          </nav>
        </div>
      </header>

      <section className="services">
        <div className="container">
          <h1>Our Services</h1>
          <p>At Reservo, we offer a variety of services to help you manage your business more effectively.</p>
          <div className="service-grid">
            <div className="service-card">
              <h3>Appointment Scheduling</h3>
              <p>Manage all your appointments with a simple, intuitive interface.</p>
            </div>
            <div className="service-card">
              <h3>Secure Payments</h3>
              <p>Accept payments securely from multiple sources, including credit cards and mobile payments.</p>
            </div>
            <div className="service-card">
              <h3>Customer Management</h3>
              <p>Keep track of your customers, their preferences, and history to provide a personalized service.</p>
            </div>
            <div className="service-card">
              <h3>Reports & Analytics</h3>
              <p>Get insights into your business performance with our powerful reporting tools.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>© 2024 Reservo. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default Services;
