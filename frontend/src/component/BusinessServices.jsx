import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";
import { AuthContext } from "./AuthContext";
import Navbar from "./BusinessNavBar";

function BusinessServices() {
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    if (!authState.isAuthenticated || authState.userType !== "businessOwner") {
      navigate("/login-business");
    }
  }, [authState.isAuthenticated, authState.userType, navigate]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/business/add-service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies
        body: JSON.stringify({ serviceName, description, duration, price }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to business dashboard after successful service addition
        navigate("/business-dashboard");
      } else {
        setError(data.message || "Failed to add service");
      }
    } catch (err) {
      console.error("Error adding service:", err);
      setError("An error occurred. Please try again.");
    }
  };

  // Function to handle logo click and redirect to the Home page
  const handleLogoClick = () => {
    navigate("/home");
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      {/* Consider externalizing the navbar */}
      <Navbar />

      {/* Main Content Area */}
      <div className="main-content">
        <header className="main-header">
          <h1>Add a New Service</h1>
          <p>Fill out the form below to add a new service.</p>
        </header>

        {/* Service Form */}
        <section id="add-service" className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="serviceName">Service Name</label>
              <input
                type="text"
                id="serviceName"
                name="serviceName"
                placeholder="Enter service name"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Enter service description"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="duration">Duration (in minutes)</label>
              <input
                type="number"
                id="duration"
                name="duration"
                placeholder="Enter duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Price (SAR)</label>
              <input
                type="number"
                step="0.01"
                id="price"
                name="price"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn">
              Add Service
            </button>

            {error && <p className="error">{error}</p>}
          </form>
        </section>
      </div>
    </div>
  );
}

export default BusinessServices;
