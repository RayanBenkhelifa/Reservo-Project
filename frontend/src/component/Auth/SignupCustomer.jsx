import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { AuthContext } from "../AuthContext"; // Import AuthContext

function SignupCustomer() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNum: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Get login function from AuthContext

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/auth/signup/customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store userId and userType in localStorage
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("userType", data.userType);
        localStorage.setItem("username", data.username); // Store username
        localStorage.setItem("email", data.email); // Store email
        // Use the login function from AuthContext to update auth state
        login(data.userType);

        // Redirect using useNavigate after successful signup
        navigate("/");
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
        <h2>Create Customer Account</h2>
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
            type="password"
            name="password"
            placeholder="Password"
            pattern="(?=.*\d)(?=.*[a-zA-Z]).{8,}"
            title="Password must be at least 8 characters long and contain at least one letter and one number"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn">
            Sign Up
          </button>

          {error && <p className="error-message">{error}</p>}

          <p>
            Already have an account? <a href="/login-customer">Login now</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignupCustomer;
