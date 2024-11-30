// components/AddProvider.jsx

import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import Navbar from "./BusinessNavBar";

function AddProvider() {
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [providerName, setProviderName] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [editingProviderId, setEditingProviderId] = useState(null);
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    console.log("AuthState:", authState);
    if (!authState.isAuthenticated || authState.userType !== "businessOwner") {
      console.log(
        "User not authenticated or not a business owner. Redirecting to login."
      );
      navigate("/login-business");
    }
  }, [authState.isAuthenticated, authState.userType, navigate]);

  // Fetch services for the business
  const fetchServices = async () => {
    try {
      console.log("Fetching services from /business/services");
      const response = await fetch("/business/services", {
        method: "GET",
        credentials: "include", // Include cookies for authentication
      });

      console.log("Received response for services:", response);

      if (response.status === 401) {
        console.error("Unauthorized access - redirecting to login.");
        navigate("/login-business");
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch services: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Fetched services:", data.services); // For debugging
      setServices(data.services); // Adjust according to your backend response
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  // Fetch providers for the business
  const fetchProviders = async () => {
    try {
      console.log("Fetching providers from /business/providers");
      const response = await fetch("/business/providers", {
        method: "GET",
        credentials: "include", // Include cookies for authentication
      });

      console.log("Received response for providers:", response);

      if (response.status === 401) {
        console.error("Unauthorized access - redirecting to login.");
        navigate("/login-business");
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch providers: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Fetched providers:", data.providers); // For debugging
      setProviders(data.providers);
    } catch (error) {
      console.error("Error fetching providers:", error);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchProviders();
  }, []);

  // Handle form submit for adding or editing provider
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!providerName || selectedServices.length === 0) {
      alert("Please enter a provider name and select at least one service.");
      return;
    }

    try {
      if (editingProviderId) {
        // Editing existing provider
        console.log("Editing provider:", editingProviderId);
        const response = await fetch("/business/edit-provider", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies
          body: JSON.stringify({
            providerId: editingProviderId,
            providerName,
            serviceIds: selectedServices,
          }),
        });

        console.log("Received response for edit provider:", response);

        if (response.status === 401) {
          console.error("Unauthorized access - redirecting to login.");
          navigate("/login-business");
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to update provider: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Provider updated successfully:", data);

        // Update providers list
        setProviders((prevProviders) =>
          prevProviders.map((provider) =>
            provider._id === data.provider._id ? data.provider : provider
          )
        );
      } else {
        // Adding new provider
        console.log("Adding new provider");
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

        console.log("Received response for add provider:", response);

        if (response.status === 401) {
          console.error("Unauthorized access - redirecting to login.");
          navigate("/login-business");
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to add provider: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Provider added successfully:", data);

        // Update providers list
        setProviders((prevProviders) => [...prevProviders, data.provider]);
      }

      // Reset form
      setProviderName("");
      setSelectedServices([]);
      setEditingProviderId(null);
    } catch (error) {
      console.error("Error adding/updating provider:", error);
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

  const handleEdit = (provider) => {
    console.log("Editing provider:", provider);
    setEditingProviderId(provider._id);
    setProviderName(provider.name);
    setSelectedServices(provider.services.map((service) => service._id));
  };

  const handleDelete = async (providerId) => {
    if (!window.confirm("Are you sure you want to delete this provider?")) {
      return;
    }

    try {
      console.log("Deleting provider:", providerId);
      const response = await fetch(`/business/delete-provider/${providerId}`, {
        method: "DELETE",
        credentials: "include",
      });

      console.log("Received response for delete provider:", response);

      if (response.status === 401) {
        console.error("Unauthorized access - redirecting to login.");
        navigate("/login-business");
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to delete provider: ${response.statusText}`);
      }

      // Update providers list
      setProviders((prevProviders) =>
        prevProviders.filter((provider) => provider._id !== providerId)
      );
    } catch (error) {
      console.error("Error deleting provider:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="main-content">
        <header className="main-header">
          <h1>{editingProviderId ? "Edit Provider" : "Add a New Provider"}</h1>
          <p>
            {editingProviderId
              ? "Update the provider's information below."
              : "Fill out the form below to add a new provider."}
          </p>
        </header>

        {/* Provider Form */}
        <section id="provider-form" className="form-card">
          <form onSubmit={handleSubmit} id="providerForm">
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
              {editingProviderId ? "Update Provider" : "Add Provider"}
            </button>

            {editingProviderId && (
              <button
                type="button"
                className="btn cancel-btn"
                onClick={() => {
                  setEditingProviderId(null);
                  setProviderName("");
                  setSelectedServices([]);
                }}
              >
                Cancel
              </button>
            )}
          </form>
        </section>

        {/* Providers List */}
        <section id="providers-list">
          <h2>Existing Providers</h2>
          {providers.length === 0 ? (
            <p>No providers found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Services</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {providers.map((provider) => (
                  <tr key={provider._id}>
                    <td>{provider.name}</td>
                    <td>
                      {provider.services
                        .map((service) => service.serviceName)
                        .join(", ")}
                    </td>
                    <td>
                      <button
                        className="btn edit-btn"
                        onClick={() => handleEdit(provider)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn delete-btn"
                        onClick={() => handleDelete(provider._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}

export default AddProvider;
