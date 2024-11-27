import React, { useState, useEffect } from "react";
import Navbar from "./BusinessNavBar"; // Adjust the path based on your folder structure

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

  const [isLoading, setIsLoading] = useState(true); // Handle loading state
  const [error, setError] = useState(""); // Handle error messages

  // Validation function for time format
  const validateTimeFormat = (time) => {
    const timePattern = /^(1[0-2]|0?[1-9]):([0-5][0-9])\s(AM|PM)$/; // Uppercase AM/PM only
    return timePattern.test(time);
  };

  useEffect(() => {
    // Fetch the current profile data
    console.log("Fetching profile data from /business/edit-profile");
    fetch("/business/edit-profile", {
      method: "GET",
      credentials: "include", // Include credentials for authentication
    })
      .then((response) => {
        console.log("Received response:", response);
        if (response.status === 401) {
          // Handle unauthorized access
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
        // Ensure all fields are set correctly
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
        setIsLoading(false); // Data is loaded
      })
      .catch((error) => {
        console.error("Error fetching profile data:", error);
        setError("Failed to load profile data.");
        setIsLoading(false); // Stop loading even on error
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
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate operating hours format
    if (
      !validateTimeFormat(profileData.operatingHoursStart) ||
      !validateTimeFormat(profileData.operatingHoursEnd)
    ) {
      setError(
        "Invalid time format. Please use H:MM AM/PM with a space before AM or PM in uppercase."
      );
      return;
    }

    // Prepare data to send
    const dataToSend = {
      ...profileData,
      operatingHours: {
        start: profileData.operatingHoursStart,
        end: profileData.operatingHoursEnd,
      },
    };

    fetch("/business/edit-profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include credentials for authentication
      body: JSON.stringify(dataToSend),
    })
      .then((response) => {
        console.log("Received response:", response);
        if (response.status === 401) {
          // Handle unauthorized access
          console.error("Unauthorized access");
          throw new Error("Unauthorized");
        }
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(err.message || "Failed to update profile");
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Profile updated successfully:", data);
        alert(data.message);
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        setError(error.message);
      });
  };

  useEffect(() => {
    console.log("Profile data updated:", profileData);
  }, [profileData]);

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
          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={profileData.name}
              onChange={handleChange}
              required
            />
            {/* Email Field */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={profileData.email}
              onChange={handleChange}
              required
            />
            {/* Phone Number Field */}
            <input
              type="text"
              name="phoneNum"
              placeholder="Phone Number"
              value={profileData.phoneNum}
              onChange={handleChange}
              required
            />
            {/* Business Name Field */}
            <input
              type="text"
              name="businessName"
              placeholder="Business Name"
              value={profileData.businessName}
              onChange={handleChange}
              required
            />
            {/* Location Field */}
            <input
              type="text"
              name="location"
              placeholder="Business Location"
              value={profileData.location}
              onChange={handleChange}
              required
            />
            {/* Category Field */}
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={profileData.category}
              onChange={handleChange}
              required
            />
            {/* Description Field */}
            <textarea
              name="description"
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
