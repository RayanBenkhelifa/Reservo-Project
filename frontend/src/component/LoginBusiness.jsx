import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";
import { AuthContext } from "./AuthContext"; // Import AuthContext

function LoginBusiness() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Get login function from context

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

      const data = await response.json();
      console.log("Response JSON data:", data);

      if (response.ok) {
        // Store the JWT token and userType in context
        login(data.token, "businessOwner");

        // Delay redirect to avoid race conditions
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
