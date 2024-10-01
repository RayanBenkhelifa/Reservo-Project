import React from 'react';
import { BrowserRouter as Router, Route, Routes,Navigate } from 'react-router-dom';
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

import './styles.css';

function App() {
  return (
    <Router>

        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/index" element={<Home />} />
            <Route path="/business-dashboard" element={<BusinessDashboard />} />
            <Route path="/business-services" element={<BusinessServices />} />
            <Route path="/select-provider/:id" element={<SelectProvider />} />
            <Route path="/timeslots/:id" element={<TimeSlots />} />
            <Route path="/business-details/:id" element={<BusinessDetails />} />
            <Route path="/business-provider" element={<BusinessProvider />} />
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