import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";
import { AuthContext } from "./AuthContext";
import Navbar from "./BusinessNavBar";

function BusinessDashboard() {
  const [businessOwner, setBusinessOwner] = useState(null);
  const [upNextAppointments, setUpNextAppointments] = useState([]); // State to hold upcoming appointments
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    if (!authState.isAuthenticated || authState.userType !== "businessOwner") {
      navigate("/login-business");
      return;
    }

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

    const fetchUpNextAppointments = async () => {
      try {
        const response = await fetch("/business/up-next", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const appointmentsData = await response.json();
          setUpNextAppointments(appointmentsData);
        } else {
          console.error("Failed to fetch upcoming appointments.");
        }
      } catch (error) {
        console.error("Error fetching upcoming appointments:", error);
      }
    };
    if (authState.isAuthenticated) {
      fetchDashboardData();
      fetchUpNextAppointments();
    }
  }, [authState.isAuthenticated, authState.userType, navigate]);

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
      <Navbar />

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
