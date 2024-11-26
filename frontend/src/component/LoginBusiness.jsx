import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";
import { AuthContext } from "./AuthContext"; // Import AuthContext

function LoginBusiness() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/auth/login/businessOwner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("userType", data.userType);
        localStorage.setItem("username", data.username); // Store username
        localStorage.setItem("email", data.email); // Store email

        // Update auth state
        login(data.userType);
        navigate("/business-dashboard");
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
