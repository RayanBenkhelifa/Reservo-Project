import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

function LoginBusiness() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/auth/login/businessOwner", {
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

        // Redirect to business dashboard after successful login
        navigate("/business-dashboard");
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
        <h2>Welcome Back, Business Owner!</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Business Email"
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
            Don't have an account? <a href="/signup-business">Sign up now</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginBusiness;
