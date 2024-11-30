// src/components/EditProfile.js

import React, { useState, useEffect } from "react";
import Navbar from "./BusinessNavBar";
import UploadBusinessImage from "./UploadBusinessImage";
import Modal from "../Modal";

function EditProfile() {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phoneNum: "",
    businessName: "",
    location: "",
    description: "",
    category: "",
    operatingHoursStart: "",
    operatingHoursEnd: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [businessImageUrl, setBusinessImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Validation function for time format
  const validateTimeFormat = (time) => {
    const timePattern = /^(1[0-2]|0?[1-9]):([0-5][0-9])\s?(AM|PM)$/i;
    return timePattern.test(time);
  };

  useEffect(() => {
    // Fetch the current profile data
    console.log("Fetching profile data from /business/edit-profile");
    fetch("/business/edit-profile", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        console.log("Received response:", response);
        if (response.status === 401) {
          console.error("Unauthorized access");
          throw new Error("Unauthorized");
        }
        if (!response.ok) {
          throw new Error(
            `Failed to fetch profile data: ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((data) => {
        console.log("Profile data fetched:", data);
        setProfileData({
          name: data.name || "",
          email: data.email || "",
          phoneNum: data.phoneNum || "",
          businessName: data.businessName || "",
          location: data.location || "",
          description: data.description || "",
          category: data.category || "",
          operatingHoursStart: data.operatingHoursStart || "",
          operatingHoursEnd: data.operatingHoursEnd || "",
        });
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching profile data:", error);
        setError("Failed to load profile data.");
        setIsLoading(false);
      });

    // Fetch the business image URL separately
    console.log("Fetching business image from /business/get-image-url");
    fetch("/business/get-image-url", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch business image URL");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Business image data fetched:", data);
        setBusinessImageUrl(data.imageUrl || "");
      })
      .catch((error) => {
        console.error("Error fetching business logo:", error);
      });
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    console.log(`Changing ${e.target.name} to ${e.target.value}`);
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Clear previous errors and messages
    setError("");
    setMessage("");

    // Validate operating hours format
    if (
      !validateTimeFormat(profileData.operatingHoursStart) ||
      !validateTimeFormat(profileData.operatingHoursEnd)
    ) {
      setError(
        "Invalid time format. Please use H:MM AM/PM with a space before AM or PM."
      );
      return;
    }

    try {
      // Update profile data
      const dataToSend = {
        name: profileData.name,
        email: profileData.email,
        phoneNum: profileData.phoneNum,
        businessName: profileData.businessName,
        location: profileData.location,
        description: profileData.description,
        category: profileData.category,
        operatingHoursStart: profileData.operatingHoursStart,
        operatingHoursEnd: profileData.operatingHoursEnd,
      };

      const profileResponse = await fetch("/business/edit-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(dataToSend),
      });

      if (!profileResponse.ok) {
        const err = await profileResponse.json();
        throw new Error(err.message || "Failed to update profile");
      }

      setMessage("Profile updated successfully.");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.message);
    }
  };

  // Function to handle image upload success
  const handleImageUploadSuccess = () => {
    // Re-fetch the business image URL after upload
    console.log("Re-fetching business image after upload");
    fetch("/business/get-image-url", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch updated image URL");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Updated business image data fetched:", data);
        setBusinessImageUrl(data.imageUrl || "");
        setShowUploadModal(false); // Close the modal after upload
      })
      .catch((error) => {
        console.error("Error fetching updated business logo:", error);
      });
  };

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <div className="main-content">
          <p>Loading profile data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="main-content">
        <div className="form-card">
          <h1 className="main-header">Edit Profile</h1>
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}

          {/* Display Current Business Logo with Edit Overlay OUTSIDE the form */}
          <div
            className="business-logo-container"
            onClick={() => setShowUploadModal(true)}
          >
            {businessImageUrl ? (
              <img
                src={businessImageUrl}
                alt="Business Logo"
                className="business-logo"
              />
            ) : (
              <div className="business-logo-placeholder">
                <span>No Logo</span>
              </div>
            )}
            <div className="edit-overlay">
              <span>Edit Picture</span>
            </div>
          </div>

          {/* Modal for Uploading Business Image */}
          {showUploadModal && (
            <Modal onClose={() => setShowUploadModal(false)}>
              <UploadBusinessImage onUploadSuccess={handleImageUploadSuccess} />
            </Modal>
          )}

          {/* Move the form below the image upload */}
          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Full Name"
              value={profileData.name}
              onChange={handleChange}
              required
            />

            {/* Email Field */}
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              value={profileData.email}
              onChange={handleChange}
              required
            />

            {/* Phone Number Field */}
            <label htmlFor="phoneNum">Phone Number</label>
            <input
              type="text"
              name="phoneNum"
              id="phoneNum"
              placeholder="Phone Number"
              value={profileData.phoneNum}
              onChange={handleChange}
              required
            />

            {/* Business Name Field */}
            <label htmlFor="businessName">Business Name</label>
            <input
              type="text"
              name="businessName"
              id="businessName"
              placeholder="Business Name"
              value={profileData.businessName}
              onChange={handleChange}
              required
            />

            {/* Location Field */}
            <label htmlFor="location">Business Location</label>
            <input
              type="text"
              name="location"
              id="location"
              placeholder="Business Location"
              value={profileData.location}
              onChange={handleChange}
              required
            />

            {/* Category Field */}
            <label htmlFor="category">Category</label>
            <input
              type="text"
              name="category"
              id="category"
              placeholder="Category"
              value={profileData.category}
              onChange={handleChange}
              required
            />

            {/* Description Field */}
            <label htmlFor="description">Business Description</label>
            <textarea
              name="description"
              id="description"
              placeholder="Business Description"
              value={profileData.description}
              onChange={handleChange}
              required
            ></textarea>

            {/* Operating Hours Start */}
            <label htmlFor="operatingHoursStart">Operating Hours Start</label>
            <input
              type="text"
              name="operatingHoursStart"
              id="operatingHoursStart"
              placeholder="Start Time (e.g., 9:00 AM)"
              value={profileData.operatingHoursStart}
              onChange={handleChange}
              required
            />

            {/* Operating Hours End */}
            <label htmlFor="operatingHoursEnd">Operating Hours End</label>
            <input
              type="text"
              name="operatingHoursEnd"
              id="operatingHoursEnd"
              placeholder="End Time (e.g., 6:00 PM)"
              value={profileData.operatingHoursEnd}
              onChange={handleChange}
              required
            />

            {/* Submit Button */}
            <button type="submit" className="btn">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
