import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

function BusinessDashboard() {
  const [businessOwner, setBusinessOwner] = useState(null);
  const [upNextAppointments, setUpNextAppointments] = useState([]); // State to hold upcoming appointments
  const navigate = useNavigate();

  useEffect(() => {
    // Function to fetch dashboard data (business owner information)
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("authToken");
      console.log("Token in BusinessDashboard: ", token); // Log the token to verify it's present

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
          console.log("Dashboard data fetched: ", data); // Log the fetched dashboard data
          setBusinessOwner(data);
        } else {
          console.log(
            "Failed to fetch dashboard data, clearing token and redirecting to login."
          );
          localStorage.removeItem("authToken");
          navigate("/login-business");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error); // Log any fetch errors
        localStorage.removeItem("authToken");
        navigate("/login-business");
      }
    };

    // Function to fetch upcoming appointments
    const fetchUpNextAppointments = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        console.log("Fetching upcoming appointments..."); // Log when fetching starts
        const response = await fetch("/business/up-next", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const appointmentsData = await response.json();
          console.log("Appointments fetched: ", appointmentsData); // Log fetched appointments
          setUpNextAppointments(appointmentsData);
        } else {
          console.error("Failed to fetch upcoming appointments."); // Log any non-200 responses
        }
      } catch (error) {
        console.error("Error fetching upcoming appointments:", error); // Log any fetch errors
      }
    };

    fetchDashboardData(); // Fetch business owner data
    fetchUpNextAppointments(); // Fetch upcoming appointments
  }, [navigate]);

  // Component to render the upcoming appointments in a table
  function UpNext() {
    console.log(
      "Rendering UpNext table with appointments: ",
      upNextAppointments
    ); // Log appointments data

    // Define styles for payment status
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
