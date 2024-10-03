import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext"; // Import AuthContext

function AddProvider() {
  const [services, setServices] = useState([]);
  const [providerName, setProviderName] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const { authState } = useContext(AuthContext); // Get the token from AuthContext
  const navigate = useNavigate();

  // Fetch services for the business
  const fetchServices = async () => {
    try {
      const response = await fetch("/business/services", {
        headers: {
          Authorization: `Bearer ${authState.token}`, // Attach the token correctly
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch services");
      }

      const data = await response.json();
      setServices(data.services); // Set fetched services in state
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  // Handle form submit for adding provider
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/business/add-provider", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`, // Attach the token in the header
        },
        body: JSON.stringify({
          providerName,
          serviceIds: selectedServices,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add provider");
      }

      const data = await response.json();
      console.log("Provider added successfully:", data);

      // Redirect to another page after successful submission
      navigate("/business-dashboard");
    } catch (error) {
      console.error("Error adding provider:", error);
    }
  };

  useEffect(() => {
    fetchServices(); // Fetch services when component mounts
  }, []);

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
          <h1>Add a New Provider</h1>
          <p>Fill out the form below to add a new provider.</p>
        </header>

        {/* Provider Form */}
        <section id="add-provider" className="form-card">
          <form onSubmit={handleSubmit} id="addProviderForm">
            <div className="form-group">
              <label htmlFor="providerName">Provider Name</label>
              <input
                type="text"
                id="providerName"
                name="providerName"
                placeholder="Enter provider name"
                value={providerName}
                onChange={(e) => setProviderName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="services">Services</label>
              <select
                id="services"
                name="serviceIds[]"
                multiple
                value={selectedServices}
                onChange={(e) =>
                  setSelectedServices(
                    [...e.target.selectedOptions].map((option) => option.value)
                  )
                }
                required
              >
                {services.map((service) => (
                  <option key={service._id} value={service._id}>
                    {service.serviceName}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn">
              Add Provider
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default AddProvider;
