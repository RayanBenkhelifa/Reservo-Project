import React from 'react';
import '../styles.css';

function ForgotPassword() {
  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2>Forgot Your Password?</h2>
        <p>Enter your email address below and we’ll send you instructions to reset your password.</p>
        <form>
          <input
            type="email"
            placeholder="Enter your email address"
            required
          />
          <button type="submit" className="btn">Send Reset Link</button>
        </form>
        <p>
          <a href="/login">Back to Login</a>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
