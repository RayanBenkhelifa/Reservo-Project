import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2"; // Import Pie chart from Chart.js
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"; // Import necessary components for Pie chart
import { AuthContext } from "../AuthContext";
import Navbar from "./BusinessNavBar";
import UploadBusinessImage from "./UploadBusinessImage";
import Modal from "../Modal"; // We'll create a simple Modal component

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function BusinessDashboard() {
  const [businessOwner, setBusinessOwner] = useState(null); // Business owner details
  const [pieChartData, setPieChartData] = useState([]); // Pie chart data for reserved services
  const [stats, setStats] = useState({
    totalAppointments: 0,
    totalRevenue: 0,
  }); // Weekly stats
  const [upNextAppointments, setUpNextAppointments] = useState([]); // Upcoming appointments
  const [businessImageUrl, setBusinessImageUrl] = useState(""); // Business image URL
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext); // Auth context
  const [showUploadModal, setShowUploadModal] = useState(false); // New state variable

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

          // Set the image URL if available
          if (data.imageUrl) {
            setBusinessImageUrl(data.imageUrl);
          }
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
          setUpNextAppointments(appointmentsData);
        } else {
          console.error("Failed to fetch upcoming appointments.");
        }
      } catch (error) {
        console.error("Error fetching upcoming appointments:", error);
      }
    };

    // Fetch weekly stats and pie chart data
    const fetchWeeklyStats = async () => {
      try {
        const response = await fetch("/business/weekly-stats", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const statsData = await response.json();
          setStats({
            totalAppointments: statsData.totalAppointments,
            totalRevenue: statsData.totalRevenue,
          });
          setPieChartData(statsData.pieChartData); // Set pie chart data
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
  // Function to handle image upload success
  const handleImageUploadSuccess = (newImageUrl) => {
    setBusinessImageUrl(newImageUrl);
    setShowUploadModal(false); // Close the modal after upload
  };
  // Pie chart configuration
  // Pie chart configuration
  const pieChartConfig = {
    labels: pieChartData.map((data) => data.label), // Service names as labels
    datasets: [
      {
        label: "Reserved Services",
        data: pieChartData.map((data) => data.value), // Number of reservations for each service
        backgroundColor: pieChartData.map((_, index) => {
          // Assign a color based on the index (first service in blue, second in red, etc.)
          const colors = [
            "#5d5fef", // Blue
            "#e3342f", // Red
            "#38c172", // Green
            "#ffed4a", // Yellow
            "#6cb2eb", // Light Blue
            "#f39c12", // Orange
            "#8e44ad", // Purple
            "#2ecc71", // Lime Green
          ];
          // Cycle through colors or use the same set for multiple services
          return colors[index % colors.length];
        }),
        borderColor: "#fff", // White border for each slice
        borderWidth: 1,
      },
    ],
  };

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
          <h1>Welcome Back, {businessOwner?.name || "Business Owner"}!</h1>
          <p>Manage your services, appointments, and providers from here.</p>

          {/* Display Business Logo with Edit Overlay */}
          <div
            className="business-logo-container"
            onClick={() => setShowUploadModal(true)}
          >
            {businessImageUrl ? (
              <img
                src={businessImageUrl}
                alt={`${businessOwner?.name} Logo`}
                className="business-logo"
              />
            ) : (
              <div className="business-logo-placeholder">
                {/* Placeholder if no logo */}
                <span>No Logo</span>
              </div>
            )}
            <div className="edit-overlay">
              <span>Edit Picture</span>
            </div>
          </div>
        </header>

        {/* Modal for Uploading Business Image */}
        {showUploadModal && (
          <Modal onClose={() => setShowUploadModal(false)}>
            <UploadBusinessImage onUploadSuccess={handleImageUploadSuccess} />
          </Modal>
        )}

        {/* Weekly stats */}
        <section id="weekly-stats" className="stats-bar">
          {/* Total Appointments stat */}
          <div className="stat-card stat-card-appointments">
            <h3 className="stat-title">Total Appointments</h3>
            <p className="stat-value">{stats.totalAppointments}</p>
          </div>

          {/* Total Revenue stat */}
          <div className="stat-card stat-card-revenue">
            <h3 className="stat-title">Total Revenue</h3>
            <p className="stat-value">SAR {stats.totalRevenue.toFixed(2)}</p>
          </div>

          {/* Pie Chart for Reserved Services */}
          <div id="reserved-services-pie-chart" className="card">
            <h2>Reserved Services</h2>
            <p>
              Visualize how many reservations each service has received this
              week.
            </p>
            {pieChartData.length > 0 ? (
              <Pie
                data={pieChartConfig}
                options={{
                  responsive: true,
                  maintainAspectRatio: false, // Allow the pie chart to resize
                }}
              />
            ) : (
              <p>No data available for reserved services this week.</p>
            )}
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
