import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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
import BrowseBusinesses from './component/BrowseBusinesses';
import SelectProvider from './component/SelectProvider';
import TimeSlots from './component/TimeSlots';
import SuccessPage from './component/SuccessPage';  // Import the SuccessPage component
import BookingConfirmation from './component/BookingConfirmation';  // Confirmation page component
import AddProvider from './component/AddProvider';
import ReviewAndPayment from './component/ReviewAndPayment';
import { AuthContext } from './component/AuthContext';
import './styles.css';

function App() {
  const { authState, loading } = useContext(AuthContext);
  console.log("Auth State:", authState);

  if (loading) {
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
              authState.isAuthenticated && authState.userType === "businessOwner"
                ? <BusinessDashboard />
                : <Navigate to="/login-business" />
            }
          />
          
          <Route
            path="/login-business"
            element={
              authState.isAuthenticated && authState.userType === "businessOwner"
                ? <Navigate to="/business-dashboard" />
                : <LoginBusiness />
            }
          />
          
          <Route
            path="/signup-business"
            element={
              authState.isAuthenticated && authState.userType === "businessOwner"
                ? <Navigate to="/business-dashboard" />
                : <SignupBusiness />
            }
          />

          <Route
            path="/login-customer"
            element={
              authState.isAuthenticated && authState.userType === "customer"
                ? <Navigate to="/" />
                : <LoginCustomer />
            }
          />
          
          <Route
            path="/signup-customer"
            element={
              authState.isAuthenticated && authState.userType === "customer"
                ? <Navigate to="/" />
                : <SignupCustomer />
            }
          />
          
          <Route
            path="/business-services"
            element={
              authState.isAuthenticated && authState.userType === "businessOwner"
                ? <BusinessServices />
                : <Navigate to="/login-business" />
            }
          />

          <Route
            path="/business-add-provider"
            element={
              authState.isAuthenticated && authState.userType === "businessOwner"
                ? <AddProvider />
                : <Navigate to="/login-business" />
            }
          />
          
          <Route path="/select-provider/:id" element={<SelectProvider />} />
          <Route path="/business-details/:businessId" element={<BusinessDetails />} />
          <Route path="/business-provider/:businessId/:serviceId" element={<BusinessProvider />} />
          <Route path="/time-slots/:providerId" element={<TimeSlots />} />
          <Route path="/browse-businesses" element={<BrowseBusinesses />} />
          <Route path="/services" element={<BrowseBusinesses />} />
          <Route path="/user-type" element={<UserType />} />
          <Route path="/success" element={<SuccessPage />} />  {/* Success page */}
          <Route path="/booking-confirmation" element={<BookingConfirmation />} /> {/* Confirmation page */}
          <Route path="/review-payment/:providerId" element={<ReviewAndPayment />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/contact" element={<Contact />} />
  /          
          {/* Handle unknown routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
