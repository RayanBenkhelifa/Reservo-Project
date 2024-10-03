import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

function LoginBusiness() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle form submission
  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission (reload)

    console.log("Attempting login with:", { email, password });

    try {
      const response = await fetch("/auth/login/businessOwner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("Response received:", response);

      const data = await response.json();
      console.log("Response JSON data:", data);

      if (response.ok) {
        // Store the JWT token in localStorage
        console.log("Storing token in localStorage:", data.token);
        localStorage.setItem("authToken", data.token);

        // Verify the token was stored correctly
        const storedToken = localStorage.getItem("authToken");
        console.log("Token in localStorage after storing:", storedToken);

        // Delay redirect to avoid race conditions
        setTimeout(() => {
          console.log("Redirecting to /business-dashboard");
          navigate("/business-dashboard");
          window.location.reload(); // <-- This will ensure App.js `useEffect` fires
        }, 1000); // 500ms delay, you can adjust this as needed
      } else {
        console.log("Login failed:", data.message);
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
