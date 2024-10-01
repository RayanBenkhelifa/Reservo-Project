import React from 'react';
import '../styles.css';

function LoginBusiness() {
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back, Business Owner!</h2>
        <form action="/auth/login/businessOwner" method="POST">
          <input type="email" name="email" placeholder="Business Email" required />
          <input type="password" name="password" placeholder="Password" required />
          <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
          <button type="submit" className="btn">Login</button>
          <p>Don't have an account? <a href="/signup-business">Sign up now</a></p>
        </form>
      </div>
    </div>
  );
}

export default LoginBusiness;
