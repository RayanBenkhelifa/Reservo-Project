import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

function BusinessDashboard() {
  const [businessOwner, setBusinessOwner] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("authToken");
      console.log("Token in BusinessDashboard: ", token); // <--- Log this

      if (!token) {
        console.log("Token missing, redirecting to login...");
        navigate("/login-business");
        return;
      }

      try {
        const response = await fetch("/business/business-dashboard", {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token to headers
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Dashboard data fetched: ", data); // Log the fetched data
          setBusinessOwner(data); // Store the returned business owner data
        } else {
          console.log(
            "Failed to fetch dashboard data, clearing token and redirecting to login."
          );
          localStorage.removeItem("authToken"); // Clear the token
          navigate("/login-business"); // Redirect to login
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        localStorage.removeItem("authToken"); // Clear the token
        navigate("/login-business"); // Redirect to login
      }
    };

    fetchDashboardData(); // Call the function to fetch dashboard data
  }, [navigate]);

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
          <h1>Welcome Back, {businessOwner?.name || "Business Owner"}</h1>
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
