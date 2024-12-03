import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import BusinessProvider from "./component/Customer/BusinessProvider";
import BusinessDashboard from "./component/Business/BusinessDashboard";
import BusinessServices from "./component/Business/BusinessServices";
import Home from "./component/Home";
import LoginBusiness from "./component/Auth/LoginBusiness";
import LoginCustomer from "./component/Auth/LoginCustomer";
import SignupBusiness from "./component/Auth/SignupBusiness";
import SignupCustomer from "./component/Auth/SignupCustomer";
import ForgotPassword from "./component/Auth/ForgotPassword";
import BusinessDetails from "./component/Customer/BusinessDetails";
import EditProfile from "./component/Business/EditProfile";
import Contact from "./component/Contact";
import UserType from "./component/UserType";
import BrowseBusinesses from "./component/Customer/BrowseBusinesses";
import TimeSlots from "./component/Customer/TimeSlots";
import SuccessPage from "./component/Customer/SuccessPage";
import BookingConfirmation from "./component/Customer/BookingConfirmation";
import AddProvider from "./component/Business/AddProvider";
import ReviewAndPayment from "./component/Customer/ReviewAndPayment";
import CustomerBookings from "./component/Customer/CustomerBookings";
import ReviewFeedback from "./component/Business/ReviewFeedback"; // Import the new ReviewFeedback component
import Footer from "./component/Footer"; 
import { AuthContext } from "./component/AuthContext";
import "./styles.css";

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
              authState.isAuthenticated &&
              authState.userType === "businessOwner" ? (
                <BusinessDashboard />
              ) : (
                <Navigate to="/login-business" />
              )
            }
          />

          <Route
            path="/login-business"
            element={
              authState.isAuthenticated &&
              authState.userType === "businessOwner" ? (
                <Navigate to="/business-dashboard" />
              ) : (
                <LoginBusiness />
              )
            }
          />

          <Route
            path="/signup-business"
            element={
              authState.isAuthenticated &&
              authState.userType === "businessOwner" ? (
                <Navigate to="/business-dashboard" />
              ) : (
                <SignupBusiness />
              )
            }
          />

          <Route
            path="/login-customer"
            element={
              authState.isAuthenticated && authState.userType === "customer" ? (
                <Navigate to="/" />
              ) : (
                <LoginCustomer />
              )
            }
          />

          <Route
            path="/signup-customer"
            element={
              authState.isAuthenticated && authState.userType === "customer" ? (
                <Navigate to="/" />
              ) : (
                <SignupCustomer />
              )
            }
          />

          <Route
            path="/business-services"
            element={
              authState.isAuthenticated &&
              authState.userType === "businessOwner" ? (
                <BusinessServices />
              ) : (
                <Navigate to="/login-business" />
              )
            }
          />

          <Route
            path="/business-add-provider"
            element={
              authState.isAuthenticated &&
              authState.userType === "businessOwner" ? (
                <AddProvider />
              ) : (
                <Navigate to="/login-business" />
              )
            }
          />

          <Route
            path="/business-details/:businessId"
            element={<BusinessDetails />}
          />
          <Route
            path="/business-provider/:businessId/:serviceId"
            element={<BusinessProvider />}
          />
          <Route path="/time-slots/:providerId" element={<TimeSlots />} />
          <Route path="/browse-businesses" element={<BrowseBusinesses />} />
          <Route path="/services" element={<BrowseBusinesses />} />
          <Route path="/user-type" element={<UserType />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route
            path="/booking-confirmation"
            element={<BookingConfirmation />}
          />
          <Route
            path="/review-payment/:providerId"
            element={<ReviewAndPayment />}
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/customer-bookings" element={<CustomerBookings />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/review-feedback"
            element={
              authState.isAuthenticated &&
              authState.userType === "businessOwner" ? (
                <ReviewFeedback />
              ) : (
                <Navigate to="/login-business" />
              )
            }
          />

          {/* Handle unknown routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer /> {/* Footer will appear on all pages */}

      </div>
    </Router>
  );
}

export default App;
