// AddProvider.jsx

import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./BusinessNavBar";
import { AuthContext } from "../AuthContext";

const AddProvider = () => {
  const [providers, setProviders] = useState([]);
  const [services, setServices] = useState([]);
  const [providerName, setProviderName] = useState("");
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [error, setError] = useState("");
  const [editingProviderId, setEditingProviderId] = useState(null);

  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    if (!authState.isAuthenticated || authState.userType !== "businessOwner") {
      navigate("/login-business");
    }
  }, [authState.isAuthenticated, authState.userType, navigate]);

  // Fetch services and providers
  const fetchServicesAndProviders = async () => {
    try {
      const [servicesResponse, providersResponse] = await Promise.all([
        fetch("/business/services", {
          method: "GET",
          credentials: "include",
        }),
        fetch("/business/providers", {
          method: "GET",
          credentials: "include",
        }),
      ]);

      const servicesData = await servicesResponse.json();
      const providersData = await providersResponse.json();

      if (servicesResponse.ok) {
        setServices(servicesData.services);
      } else {
        setError(servicesData.message || "Failed to fetch services.");
      }

      if (providersResponse.ok) {
        setProviders(providersData.providers);
      } else {
        setError(providersData.message || "Failed to fetch providers.");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("An error occurred while fetching data. Please try again.");
    }
  };

  useEffect(() => {
    fetchServicesAndProviders();
  }, []);

  // Handle form submission for adding or editing a provider
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!providerName || selectedServiceIds.length === 0) {
      setError("Please fill out all required fields.");
      return;
    }

    try {
      if (editingProviderId) {
        // Editing existing provider
        const response = await fetch("/business/edit-provider", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            providerId: editingProviderId,
            providerName,
            serviceIds: selectedServiceIds,
          }),
        });

        const data = await response.json();

        if (response.status === 400 || response.status === 404) {
          // Display the error message returned by the server
          alert(data.message);
          return;
        }

        if (response.status === 401) {
          console.error("Unauthorized access - redirecting to login.");
          navigate("/login-business");
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to edit provider: ${response.statusText}`);
        }

        // Update providers list
        setProviders((prevProviders) =>
          prevProviders.map((provider) =>
            provider._id === data.provider._id ? data.provider : provider
          )
        );

        // Reset form
        resetForm();
      } else {
        // Adding new provider
        const response = await fetch("/business/add-provider", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            providerName,
            serviceIds: selectedServiceIds,
          }),
        });

        const data = await response.json();

        if (response.status === 400 || response.status === 404) {
          // Display the error message returned by the server
          alert(data.message);
          return;
        }

        if (response.status === 401) {
          console.error("Unauthorized access - redirecting to login.");
          navigate("/login-business");
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to add provider: ${response.statusText}`);
        }

        // Update providers list
        setProviders((prevProviders) => [...prevProviders, data.provider]);

        // Reset form
        resetForm();
      }
    } catch (error) {
      console.error("Error submitting provider:", error);
      alert(
        "An error occurred while submitting the provider. Please try again."
      );
    }
  };

  const resetForm = () => {
    setProviderName("");
    setSelectedServiceIds([]);
    setEditingProviderId(null);
    setError("");
  };

  const handleEdit = (provider) => {
    setEditingProviderId(provider._id);
    setProviderName(provider.name);
    setSelectedServiceIds(provider.services.map((service) => service._id));
  };

  const handleDelete = async (providerId) => {
    if (!window.confirm("Are you sure you want to delete this provider?")) {
      return;
    }

    try {
      const response = await fetch(`/business/delete-provider/${providerId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (response.status === 400 || response.status === 404) {
        // Display the error message returned by the server
        alert(data.message);
        return;
      }

      if (response.status === 401) {
        console.error("Unauthorized access - redirecting to login.");
        navigate("/login-business");
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to delete provider: ${response.statusText}`);
      }

      // Remove the deleted provider from the list
      setProviders((prevProviders) =>
        prevProviders.filter((provider) => provider._id !== providerId)
      );
    } catch (error) {
      console.error("Error deleting provider:", error);
      alert("An error occurred while deleting the provider. Please try again.");
    }
  };

  const handleServiceSelection = (serviceId) => {
    if (selectedServiceIds.includes(serviceId)) {
      // Deselect service
      setSelectedServiceIds((prevServiceIds) =>
        prevServiceIds.filter((id) => id !== serviceId)
      );
    } else {
      // Select service
      setSelectedServiceIds((prevServiceIds) => [...prevServiceIds, serviceId]);
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
          <form onSubmit={handleSubmit}>
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
              <label>Assign Services</label>
              {services.length === 0 ? (
                <p>No services available. Please add services first.</p>
              ) : (
                <div className="services-list">
                  {services.map((service) => (
                    <div key={service._id} className="service-item">
                      <input
                        type="checkbox"
                        id={`service-${service._id}`}
                        value={service._id}
                        checked={selectedServiceIds.includes(service._id)}
                        onChange={() => handleServiceSelection(service._id)}
                      />
                      <label htmlFor={`service-${service._id}`}>
                        {service.serviceName}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" className="btn">
              {editingProviderId ? "Update Provider" : "Add Provider"}
            </button>

            {editingProviderId && (
              <button
                type="button"
                className="btn cancel-btn"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}

            {error && <p className="error">{error}</p>}
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
                  <th>Provider Name</th>
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
                      <div className="action-buttons">
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
                      </div>
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
};

export default AddProvider;
