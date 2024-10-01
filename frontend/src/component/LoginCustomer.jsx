import React from 'react';
import '../styles.css';

function LoginCustomer() {
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back, Customer!</h2>
        <form action="/auth/login/customer" method="POST">
          <input type="email" name="email" placeholder="Email" required />
          <input type="password" name="password" placeholder="Password" required />
          <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
          <button type="submit" className="btn">Login</button>
          <p>Don't have an account? <a href="/signup-customer">Sign up now</a></p>
        </form>
      </div>
    </div>
  );
}

export default LoginCustomer;
