// src/components/ReviewAndPayment.jsx
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const ReviewAndPayment = () => {
  const { providerId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const businessId = queryParams.get("businessId");
  const serviceId = queryParams.get("serviceId");
  const serviceDuration = queryParams.get("duration");
  const selectedDate = queryParams.get("date");
  const selectedTimeSlot = queryParams.get("time");

  // State variables
  const [serviceDetails, setServiceDetails] = useState(null);
  const [providerDetails, setProviderDetails] = useState(null);
  const [businessDetails, setBusinessDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentOption, setPaymentOption] = useState("stripe"); // Default to 'stripe'

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    // Redirect to login if user is not authenticated
    if (!token) {
      navigate("/login-customer", { state: { from: location.pathname } });
      return;
    }

    const fetchDetails = async () => {
      try {
        const serviceResponse = await fetch(`/customer/services/${serviceId}`);
        const serviceData = await serviceResponse.json();
        if (!serviceResponse.ok) {
          throw new Error(
            `Failed to fetch service details, status: ${serviceResponse.status}`
          );
        }

        setServiceDetails(serviceData);

        const providerResponse = await fetch(
          `/customer/businesses/${businessId}/services/${serviceId}/providers`
        );
        const providerData = await providerResponse.json();
        if (!providerResponse.ok) {
          throw new Error(
            `Failed to fetch provider details, status: ${providerResponse.status}`
          );
        }

        setProviderDetails(providerData);

        const businessResponse = await fetch(
          `/customer/businesses/${businessId}`
        );
        const businessData = await businessResponse.json();
        if (!businessResponse.ok) {
          throw new Error(
            `Failed to fetch business details, status: ${businessResponse.status}`
          );
        }

        setBusinessDetails(businessData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching details:", err);
        setError("Failed to load details.");
        setLoading(false);
      }
    };

    fetchDetails();
  }, [providerId, serviceId, businessId, navigate, location]);

  const handleCheckout = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login-customer", { state: { from: location.pathname } });
      return;
    }

    const customerId = extractCustomerIdFromToken(token);
    if (!customerId) {
      console.error("Failed to extract customer ID from token.");
      return;
    }

    const bookingData = {
      customerId,
      providerId,
      serviceId,
      selectedDate,
      startTime: selectedTimeSlot,
      paymentOption, // Include payment option
      items: [
        {
          name: serviceDetails?.serviceName || "Unknown Service",
          price: serviceDetails?.price || 0,
          quantity: 1,
        },
      ],
    };

    try {
      const response = await fetch("/booking/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();
      if (response.ok) {
        if (paymentOption === "stripe") {
          // Redirect to Stripe checkout URL
          window.location = data.url;
        } else if (paymentOption === "venue") {
          // Redirect to confirmation page
          navigate(`/booking-confirmation?bookingId=${data.bookingId}`);
        }
      } else {
        console.error(`Booking failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  // Helper function to extract customer ID from the token
  const extractCustomerIdFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.userId;
    } catch (err) {
      console.error("Error decoding token:", err);
      return null;
    }
  };

  const handlePaymentOptionChange = (event) => {
    setPaymentOption(event.target.value);
  };

  if (loading) return <p>Loading details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      <header className="main-header">
        <h1>Review and Payment</h1>
      </header>

      <section className="review-section">
        <h2>Review Your Booking</h2>
        <p>
          <strong>Business:</strong> {businessDetails?.businessName || "N/A"}
        </p>
        <p>
          <strong>Provider:</strong> {providerDetails?.[0]?.name || "N/A"}
        </p>
        <p>
          <strong>Service:</strong> {serviceDetails?.serviceName || "N/A"}
        </p>
        <p>
          <strong>Duration:</strong> {serviceDuration} minutes
        </p>
        <p>
          <strong>Date:</strong> {selectedDate}
        </p>
        <p>
          <strong>Start Time:</strong> {selectedTimeSlot}
        </p>
        <p>
          <strong>Price:</strong> SAR {serviceDetails?.price || "N/A"}
        </p>
        <div className="payment-toggle">
          <h3>Select Payment Method:</h3>
          <div className="toggle-container">
            <div
              className={`toggle-card ${
                paymentOption === "stripe" ? "selected" : ""
              }`}
              onClick={() => setPaymentOption("stripe")}
            >
              Pay with Card (Stripe)
            </div>
            <div
              className={`toggle-card ${
                paymentOption === "venue" ? "selected" : ""
              }`}
              onClick={() => setPaymentOption("venue")}
            >
              Pay at Venue
            </div>
          </div>
          <button className="confirm-booking-btn" onClick={handleCheckout}>
            Confirm Booking
          </button>
        </div>
      </section>
    </div>
  );
};

export default ReviewAndPayment;
