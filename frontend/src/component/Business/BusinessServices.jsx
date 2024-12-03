// BusinessServices.jsx

import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import Navbar from "./BusinessNavBar";

function BusinessServices() {
  const [services, setServices] = useState([]);
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [editingServiceId, setEditingServiceId] = useState(null);

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
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setServices(data.services);
      } else {
        setError(data.message || "Failed to fetch services");
      }
    } catch (err) {
      console.error("Error fetching services:", err);
      setError("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Handle form submission for adding or editing service
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!serviceName || !duration || !price) {
      setError("Please fill out all required fields.");
      return;
    }

    try {
      if (editingServiceId) {
        // Editing existing service
        const response = await fetch("/business/edit-service", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            serviceId: editingServiceId,
            serviceName,
            description,
            duration,
            price,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // Update services list
          setServices((prevServices) =>
            prevServices.map((service) =>
              service._id === data.service._id ? data.service : service
            )
          );
          // Reset form
          resetForm();
        } else {
          setError(data.message || "Failed to update service");
        }
      } else {
        // Adding new service
        const response = await fetch("/business/add-service", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ serviceName, description, duration, price }),
        });

        const data = await response.json();

        if (response.ok) {
          // Update services list
          setServices((prevServices) => [...prevServices, data.service]);
          // Reset form
          resetForm();
        } else {
          setError(data.message || "Failed to add service");
        }
      }
    } catch (err) {
      console.error("Error submitting service:", err);
      setError("An error occurred. Please try again.");
    }
  };

  const resetForm = () => {
    setServiceName("");
    setDescription("");
    setDuration("");
    setPrice("");
    setEditingServiceId(null);
    setError("");
  };

  const handleEdit = (service) => {
    setEditingServiceId(service._id);
    setServiceName(service.serviceName);
    setDescription(service.description);
    setDuration(service.duration);
    setPrice(service.price);
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm("Are you sure you want to delete this service?")) {
      return;
    }

    try {
      const response = await fetch(`/business/delete-service/${serviceId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (response.status === 400) {
        alert(data.message);
        return;
      }

      if (response.ok) {
        // Remove the deleted service from the list
        setServices((prevServices) =>
          prevServices.filter((service) => service._id !== serviceId)
        );
      } else {
        setError(data.message || "Failed to delete service");
      }
    } catch (err) {
      console.error("Error deleting service:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar />

      <div className="main-content">
        <header className="main-header">
          <h1>{editingServiceId ? "Edit Service" : "Add a New Service"}</h1>
          <p>
            {editingServiceId
              ? "Update the service's information below."
              : "Fill out the form below to add a new service."}
          </p>
        </header>

        {/* Service Form */}
        <section id="service-form" className="form-card">
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
              {editingServiceId ? "Update Service" : "Add Service"}
            </button>

            {editingServiceId && (
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

        {/* Services List */}
        <section id="services-list">
          <h2>Existing Services</h2>
          {services.length === 0 ? (
            <p>No services found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Service Name</th>
                  <th>Description</th>
                  <th>Duration (mins)</th>
                  <th>Price (SAR)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service._id}>
                    <td>{service.serviceName}</td>
                    <td>{service.description}</td>
                    <td>{service.duration}</td>
                    <td>{service.price}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn edit-btn"
                          onClick={() => handleEdit(service)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn delete-btn"
                          onClick={() => handleDelete(service._id)}
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
}

export default BusinessServices;
