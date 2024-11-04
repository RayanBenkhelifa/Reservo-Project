import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import Navbar from "./BusinessNavBar";

function AddProvider() {
  const [services, setServices] = useState([]);
  const [providerName, setProviderName] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    if (!authState.isAuthenticated || authState.userType !== "businessOwner") {
      navigate("/login-business");
    }
  }, [authState.isAuthenticated, authState.userType, navigate]);

  // Fetch services for the business
  const fetchServices = async () => {
    try {
      const response = await fetch("/business/services", {
        method: "GET",
        credentials: "include", // Include cookies
      });

      if (!response.ok) {
        throw new Error("Failed to fetch services");
      }

      const data = await response.json();
      setServices(data.services); // Adjust according to your backend response
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
        },
        credentials: "include", // Include cookies
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
  const handleCheckboxChange = (serviceId) => {
    setSelectedServices((prevSelected) => {
      if (prevSelected.includes(serviceId)) {
        // If already selected, remove it
        return prevSelected.filter((id) => id !== serviceId);
      } else {
        // If not selected, add it
        return [...prevSelected, serviceId];
      }
    });
  };
  useEffect(() => {
    fetchServices();
  }, []);

  // Function to handle logo click and redirect to the Home page
  const handleLogoClick = () => {
    navigate("/home");
  };

  return (
    <div className="dashboard-container">
      <Navbar />
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
              <label>Services</label>
              <div className="checkbox-group">
                {services.map((service) => (
                  <label key={service._id} className="checkbox-label">
                    <input
                      type="checkbox"
                      value={service._id}
                      checked={selectedServices.includes(service._id)}
                      onChange={() => handleCheckboxChange(service._id)}
                    />
                    {service.serviceName}
                  </label>
                ))}
              </div>
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
