import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // For navigation and redirecting after login
import { AuthContext } from "../AuthContext"; // Import AuthContext

function LoginCustomer() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext); // Get login function from AuthContext

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/auth/login/customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update auth state
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("userType", data.userType);
        localStorage.setItem("username", data.username); // Store username
        localStorage.setItem("email", data.email); // Store email
        login(data.userType);

        // Handle redirection logic
        const { from } = location.state || {};
        if (from) {
          navigate(from);
        } else {
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
          {error && <p className="error-message">{error}</p>}
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
