import React from 'react';
import '../styles.css';

function SignupBusiness() {
  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Create Business Owner Account</h2>
        <form action="/auth/signup/businessOwner" method="POST">
          <input type="text" name="name" placeholder="Full Name" required />
          <input type="email" name="email" placeholder="Email" required />
          <input type="text" name="phoneNum" placeholder="Phone Number" required pattern="\d{10,15}" title="Phone number must be 10-15 digits" />
          <input type="text" name="businessName" placeholder="Business Name" required />
          <input type="text" name="location" placeholder="Business Location" required />
          
          <select name="category" required>
            <option value="" disabled selected>Select Business Type</option>
            <option value="barber">Barber Shop</option>
            <option value="salon">Salon</option>
            <option value="spa">Spa</option>
          </select>

          <textarea name="description" placeholder="Business Description" required></textarea>

          <label htmlFor="operatingHoursStart">Operating Hours Start</label>
          <input type="text" name="operatingHoursStart" id="operatingHoursStart" placeholder="Start Time (e.g., 9:00 AM)" required />

          <label htmlFor="operatingHoursEnd">Operating Hours End</label>
          <input type="text" name="operatingHoursEnd" id="operatingHoursEnd" placeholder="End Time (e.g., 6:00 PM)" required />

          <input type="password" name="password" placeholder="Password" required pattern="(?=.*\d)(?=.*[a-zA-Z]).{8,}" title="Password must be at least 8 characters long and contain at least one letter and one number" />

          <div className="terms">
            <input type="checkbox" required /> I agree to the <a href="#">Terms and Conditions</a>
          </div>

          <button type="submit" className="btn">Sign Up</button>
          <p>Already have an account? <a href="/login-business">Login now</a></p>
        </form>
      </div>
    </div>
  );
}

export default SignupBusiness;
