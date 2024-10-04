import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

function BusinessDashboard() {
  const [businessOwner, setBusinessOwner] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("authToken");
      console.log("Token in BusinessDashboard: ", token);

      if (!token) {
        console.log("Token missing, redirecting to login...");
        navigate("/login-business");
        return;
      }

      try {
        const response = await fetch("/business/business-dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Dashboard data fetched: ", data);
          setBusinessOwner(data);
        } else {
          console.log(
            "Failed to fetch dashboard data, clearing token and redirecting to login."
          );
          localStorage.removeItem("authToken");
          navigate("/login-business");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        localStorage.removeItem("authToken");
        navigate("/login-business");
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // Rename EmptyTable to UpNext and ensure proper capitalization
  function UpNext() {
    return (
      <table border="1">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Provider</th>
            <th>Service</th>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Duration (Minutes)</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{/* Table body is intentionally left empty */}</tbody>
        <tfoot>{/* Table footer is intentionally left empty */}</tfoot>
      </table>
    );
  }

  return (
    <div className="dashboard-container">
      <nav className="sidebar">
        <div
          className="business_logo"
          onClick={() => navigate("/home")}
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
        </ul>
      </nav>

      <div className="main-content">
        <header className="main-header">
          <h1>Welcome Back, {businessOwner?.name || "Business Owner"}</h1>
          <p>Manage your services, appointments, and providers from here.</p>
        </header>

        <section id="up-next" className="card">
          <h2>Up Next</h2>
          <p>Here is where you manage your upcoming appointments.</p>

          {/* Insert the UpNext component here */}
          <UpNext />
        </section>
      </div>
    </div>
  );
}

export default BusinessDashboard;
