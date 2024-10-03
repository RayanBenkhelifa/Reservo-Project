import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

function BusinessServices() {
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get token from localStorage
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch("/business/add-service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token in request header
        },
        body: JSON.stringify({ serviceName, description, duration, price }), // We no longer need to pass businessId
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

  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
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
              <label htmlFor="price">Price ($)</label>
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
