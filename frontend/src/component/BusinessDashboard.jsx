import React from "react";
import "../styles.css";

function BusinessDashboard() {
  return (
    <div className="dashboard-container">
      <nav className="sidebar">
        <div className="logo">
          <h2>Reservo</h2>
        </div>
        <ul className="nav-links">
          <li>
            <a href="/business-dashboard">Calendar</a>
          </li>
          <li>
            <a href="/business-services">Services</a>
          </li>
          <li>
            <a href="/business-add-provider">Providers</a>
          </li>
        </ul>
      </nav>

      <div className="main-content">
        <header className="main-header">
          <h1>Welcome Back, [Business Owner Name]</h1>
          <p>Manage your services, appointments, and providers from here.</p>
        </header>

        <section id="calendar" className="card">
          <h2>Calendar</h2>
          <p>Here is where you manage your appointments.</p>
        </section>
      </div>
    </div>
  );
}

export default BusinessDashboard;
