import React from 'react';
import '../styles.css';

function SignupCustomer() {
  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Create Customer Account</h2>
        <form action="/auth/signup/customer" method="POST">
          <input type="text" name="name" placeholder="Full Name" required />
          <input type="email" name="email" placeholder="Email" required />
          <input type="text" name="phoneNum" placeholder="Phone Number" required pattern="\d{10,15}" title="Phone number must be 10-15 digits" />
          <input type="password" name="password" placeholder="Password" required pattern="(?=.*\d)(?=.*[a-zA-Z]).{8,}" title="Password must be at least 8 characters long and contain at least one letter and one number" />
          
          <div className="terms">
            <input type="checkbox" required /> I agree to the <a href="#">Terms and Conditions</a>
          </div>

          <button type="submit" className="btn">Sign Up</button>
          <p>Already have an account? <a href="/login-customer">Login now</a></p>
        </form>
      </div>
    </div>
  );
}

export default SignupCustomer;
