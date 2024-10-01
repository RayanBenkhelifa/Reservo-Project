import React from 'react';
import '../styles.css';

function UserType() {
  return (
    <div className="signup-type-container">
      <div className="signup-type-box">
        <h2>Get Started</h2>
        <p>Please select your account type:</p>
        <div className="btn-group">
          <a href="/signup-customer" className="btn">Customer</a>
          <a href="/signup-business" className="btn">Business Owner</a>
        </div>
      </div>
    </div>
  );
}

export default UserType;
