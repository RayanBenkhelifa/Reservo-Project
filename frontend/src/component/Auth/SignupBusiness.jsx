import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { AuthContext } from "../AuthContext"; // Import AuthContext

function SignupBusiness() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNum: "",
    businessName: "",
    location: "",
    category: "",
    description: "",
    operatingHoursStart: "",
    operatingHoursEnd: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Get the login function from context

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/business-dashboard");
    }
  }, [navigate]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Strictly validate time format to ensure it includes H:MM AM/PM with uppercase AM/PM
  const validateTimeFormat = (time) => {
    const timePattern = /^(1[0-2]|0?[1-9]):([0-5][0-9])\s(AM|PM)$/; // Uppercase AM/PM only
    return timePattern.test(time);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate operating hours format
    if (
      !validateTimeFormat(formData.operatingHoursStart) ||
      !validateTimeFormat(formData.operatingHoursEnd)
    ) {
      setError(
        "Invalid time format. Please use the format H:MM AM/PM with a space before AM or PM in uppercase."
      );
      return;
    }

    try {
      const response = await fetch("/auth/signup/businessOwner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Update auth state
        // Store userId and userType in localStorage
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("userType", data.userType);
        localStorage.setItem("username", data.username); // Store username
        localStorage.setItem("email", data.email); // Store email
        // Update auth state
        login(data.userType);
        navigate("/business-dashboard");
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Create Business Owner Account</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phoneNum"
            placeholder="Phone Number"
            pattern="\d{10,15}"
            title="Phone number must be 10-15 digits"
            value={formData.phoneNum}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="businessName"
            placeholder="Business Name"
            value={formData.businessName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Business Location"
            value={formData.location}
            onChange={handleChange}
            required
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select Business Type
            </option>
            <option value="Barber">Barber Shop</option>
            <option value="Salon">Salon</option>
            <option value="Spa">Spa</option>
          </select>

          <textarea
            name="description"
            placeholder="Business Description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>

          <label htmlFor="operatingHoursStart">Operating Hours Start</label>
          <input
            type="text"
            name="operatingHoursStart"
            id="operatingHoursStart"
            placeholder="Start Time (e.g., 9:00 AM)"
            value={formData.operatingHoursStart}
            onChange={handleChange}
            required
          />

          <label htmlFor="operatingHoursEnd">Operating Hours End</label>
          <input
            type="text"
            name="operatingHoursEnd"
            id="operatingHoursEnd"
            placeholder="End Time (e.g., 6:00 PM)"
            value={formData.operatingHoursEnd}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            pattern="(?=.*\d)(?=.*[a-zA-Z]).{8,}"
            title="Password must be at least 8 characters long and contain at least one letter and one number"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {/* Display error message in red and styled */}
          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="btn">
            Sign Up
          </button>

          <p>
            Already have an account? <a href="/login-business">Login now</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignupBusiness;
