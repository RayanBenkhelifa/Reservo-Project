import React from 'react';
import { BrowserRouter as Router, Route, Routes,Navigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import BusinessProvider from './component/BusinessProvider';
import BusinessDashboard from './component/BusinessDashboard';
import BusinessServices from './component/BusinessServices';
import Home from './component/Home';
import LoginBusiness from './component/LoginBusiness';
import LoginCustomer from './component/LoginCustomer';
import SignupBusiness from './component/SignupBusiness';
import SignupCustomer from './component/SignupCustomer';
import BusinessDetails from './component/BusinessDetails';
import UserType from './component/UserType';
import ForgotPassword from './component/ForgotPassword';
import Contact from './component/Contact';
import BrowseBusinesses from './component/BrowseBusinesses'
import SelectProvider from './component/SelectProvider'
import TimeSlots from './component/TimeSlots'
import AddProvider from './component/AddProvider'

import './styles.css';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    console.log("Checking authentication status...");  // <-- Check if this fires
  
    const token = localStorage.getItem("authToken");
    if (token) {
      console.log("Token exists, setting authenticated to true.");  // <-- Log token check
      setAuthenticated(true);
    } else {
      console.log("No token found, setting authenticated to false.");  // <-- Log when no token
      setAuthenticated(false);
    }
  
    setLoading(false); // Set loading to false after checking token
  }, []);

  // If still checking authentication, display loading message (or spinner)
  if (loading) {
    console.log("Loading state active, awaiting token check.");  // <--- Add this log
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/index" element={<Home />} />
          <Route
  path="/business-dashboard"
  element={
    !loading ? (
      authenticated ? <BusinessDashboard /> : <Navigate to="/login-business" />
    ) : (
      <div>Loading...</div>  // While loading, show this
    )
  }
/>
          <Route
            path="/business-services"
            element={
              authenticated ? <BusinessServices /> : <Navigate to="/login-business" />
            }
          />
          <Route
            path="/business-add-provider"
            element={authenticated ? <AddProvider /> : <Navigate to="/login-business" />} />
            <Route path="/business-add-provider" element={authenticated ? <AddProvider /> : <Navigate to="/login-business" /> } /> 
            <Route path="/select-provider/:id" element={<SelectProvider />} />
            <Route path="/business-details/:businessId" element={<BusinessDetails />} />
            <Route path="/business-provider/:businessId/:serviceId" element={<BusinessProvider />} />
            <Route path="/time-slots/:providerId" element={<TimeSlots />} />
            <Route path="/browse-businesses" element={<BrowseBusinesses />} />
            <Route path="/login-business" element={<LoginBusiness />} />
            <Route path="/login-customer" element={<LoginCustomer />} />
            <Route path="/services" element={<BrowseBusinesses />} />
            <Route path="/signup-business" element={<SignupBusiness />} />
            <Route path="/signup-customer" element={<SignupCustomer />} />
            <Route path="/user-type" element={<UserType />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/contact" element={<Contact />} />
            {/* Handle unknown routes */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
      </div>
    </Router>
  );
}

export default App;