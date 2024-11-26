import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";
import { AuthContext } from "./AuthContext";
import Navbar from "./BusinessNavBar";

function BusinessDashboard() {
  const [businessOwner, setBusinessOwner] = useState(null); // Business owner details
  const [upNextAppointments, setUpNextAppointments] = useState([]); // Upcoming appointments
  const [stats, setStats] = useState({
    totalAppointments: 0,
    totalRevenue: 0,
    improvement: 0,
  }); // Weekly stats
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext); // Auth context

  // Debugging: Log stats state whenever it updates
  useEffect(() => {
    console.log("DEBUG: Updated stats state:", stats);
  }, [stats]);

  useEffect(() => {
    // Redirect if not authenticated or wrong user type
    if (!authState.isAuthenticated || authState.userType !== "businessOwner") {
      navigate("/login-business");
      return;
    }

    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/business/business-dashboard", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setBusinessOwner(data);
        } else {
          console.log("Failed to fetch dashboard data.");
          navigate("/login-business");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        navigate("/login-business");
      }
    };

    // Fetch upcoming appointments
    const fetchUpNextAppointments = async () => {
      try {
        const response = await fetch("/business/up-next", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const appointmentsData = await response.json();
          console.log("DEBUG: Up Next Appointments:", appointmentsData);
          setUpNextAppointments(appointmentsData);
        } else {
          console.error("Failed to fetch upcoming appointments.");
        }
      } catch (error) {
        console.error("Error fetching upcoming appointments:", error);
      }
    };

    // Fetch weekly stats
    const fetchWeeklyStats = async () => {
      try {
        const response = await fetch("/business/weekly-stats", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const statsData = await response.json();
          console.log("DEBUG: Weekly Stats API Response:", statsData);
          setStats(statsData);
        } else {
          console.error("Failed to fetch weekly stats.");
        }
      } catch (error) {
        console.error("Error fetching weekly stats:", error);
      }
    };

    // Fetch data if authenticated
    if (authState.isAuthenticated) {
      fetchDashboardData();
      fetchUpNextAppointments();
      fetchWeeklyStats();
    }
  }, [authState.isAuthenticated, authState.userType, navigate]);

  // Component to render upcoming appointments
  function UpNext() {
    const statusStyles = {
      completed: { color: "green", fontWeight: "bold" },
      unpaid: { color: "red", fontWeight: "bold" },
      pending: { color: "orange", fontWeight: "bold" },
    };

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
            <th>Payment Status</th>
          </tr>
        </thead>
        <tbody>
          {upNextAppointments.length > 0 ? (
            upNextAppointments.map((appointment) => (
              <tr key={appointment._id}>
                <td>{appointment.customerName}</td>
                <td>{appointment.providerName}</td>
                <td>{appointment.serviceName}</td>
                <td>{appointment.date}</td>
                <td>{appointment.startTime}</td>
                <td>{appointment.endTime}</td>
                <td>{appointment.duration}</td>
                <td>{appointment.price}</td>
                <td
                  style={
                    statusStyles[appointment.paymentStatus] || { color: "gray" }
                  }
                >
                  {appointment.paymentStatus}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">No upcoming appointments.</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  return (
    <div className="dashboard-container">
      <Navbar />

      <div className="main-content">
        <header className="main-header">
          <h1>Welcome Back, {businessOwner?.name || "Business Owner"}</h1>
          <p>Manage your services, appointments, and providers from here.</p>
        </header>

        {/* Weekly stats */}
        <section id="weekly-stats" className="stats-bar">
          <div className="stat-card">
            <h3 className="stat-title">Total Appointments</h3>
            <p className="stat-value">{stats.totalAppointments}</p>
          </div>
          <div className="stat-card">
            <h3 className="stat-title">Total Revenue</h3>
            <p className="stat-value">SAR {stats.totalRevenue.toFixed(2)}</p>
          </div>
          <div className="stat-card">
            <h3 className="stat-title">Improvement</h3>
            <p
              className={`stat-value ${
                stats.improvement >= 0 ? "positive" : "negative"
              }`}
            >
              {stats.improvement}%
            </p>
          </div>
        </section>

        <section id="up-next" className="card">
          <h2>Up Next</h2>
          <p>Here is where you manage your upcoming appointments.</p>

          <UpNext />
        </section>
      </div>
    </div>
  );
}

export default BusinessDashboard;
