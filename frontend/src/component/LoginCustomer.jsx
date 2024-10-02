import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // For navigation and redirecting after login
import "../styles.css";

function LoginCustomer() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/auth/login/customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the JWT token in localStorage
        localStorage.setItem("authToken", data.token);

        // If there's state passed from the previous page, extract it
        const {
          from,
          providerId,
          serviceId,
          serviceDuration,
          selectedDate,
          selectedTimeSlot,
        } = location.state || {}; // Destructure the state

        // Redirect the user back to the time-slots page with all the details
        if (
          from &&
          providerId &&
          serviceId &&
          serviceDuration &&
          selectedDate &&
          selectedTimeSlot
        ) {
          navigate(
            `/time-slots/${providerId}?serviceId=${serviceId}&duration=${serviceDuration}&date=${selectedDate}&timeSlot=${selectedTimeSlot}`
          );
        } else {
          // Default to the homepage if no state is provided
          navigate("/");
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back, Customer!</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="error">{error}</p>}
          <a href="/forgot-password" className="forgot-password">
            Forgot Password?
          </a>
          <button type="submit" className="btn">
            Login
          </button>
          <p>
            Don't have an account? <a href="/signup-customer">Sign up now</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginCustomer;
