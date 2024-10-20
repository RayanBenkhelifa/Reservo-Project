import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const ReviewAndPayment = () => {
  const { providerId } = useParams();  // Extract providerId from the URL path
  const location = useLocation();  // Get the query parameters
  const navigate = useNavigate();

  // Parse query parameters using URLSearchParams
  const queryParams = new URLSearchParams(location.search);
  const businessId = queryParams.get("businessId");  // Extract businessId from query parameters
  const serviceId = queryParams.get("serviceId");
  const serviceDuration = queryParams.get("duration");
  const selectedDate = queryParams.get("date");
  const selectedTimeSlot = queryParams.get("time");

  // State variables to hold service, provider, and business details
  const [serviceDetails, setServiceDetails] = useState(null);
  const [providerDetails, setProviderDetails] = useState(null);
  const [businessDetails, setBusinessDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        console.log("Provider ID:", providerId);
        console.log("Business ID:", businessId);
        console.log("Service ID:", serviceId);
        console.log("Service Duration:", serviceDuration);
        console.log("Selected Date:", selectedDate);
        console.log("Selected Time Slot:", selectedTimeSlot);
        
        const serviceResponse = await fetch(`/customer/services/${serviceId}`);
        const serviceData = await serviceResponse.json();

        if (!serviceResponse.ok) {
          throw new Error(`Failed to fetch service details, status: ${serviceResponse.status}`);
        }

        console.log("Service data fetched:", serviceData);
        setServiceDetails(serviceData);

        const providerResponse = await fetch(`/customer/businesses/${businessId}/services/${serviceId}/providers`);
        const providerData = await providerResponse.json();

        if (!providerResponse.ok) {
          throw new Error(`Failed to fetch provider details, status: ${providerResponse.status}`);
        }

        console.log("Provider data fetched:", providerData);
        setProviderDetails(providerData);

        const businessResponse = await fetch(`/customer/businesses/${businessId}`);
        const businessData = await businessResponse.json();

        if (!businessResponse.ok) {
          throw new Error(`Failed to fetch business details, status: ${businessResponse.status}`);
        }

        console.log("Business data fetched:", businessData);
        setBusinessDetails(businessData);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching details:", err);
        setError('Failed to load details.');
        setLoading(false);
      }
    };

    fetchDetails();
  }, [providerId, serviceId, businessId]);

  const handleCheckout = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login-customer", { state: { from: location.pathname } });
      return;
    }

    const customerId = extractCustomerIdFromToken(token);  // Extract customerId from the token
    if (!customerId) {
      console.error("Failed to extract customer ID from token.");
      return;
    }

    const bookingData = {
      customerId,  // Use the extracted customerId
      providerId,
      serviceId,
      selectedDate,
      startTime: selectedTimeSlot,
      items: [
        {
          name: serviceDetails?.serviceName || "Unknown Service",  // Handle case where serviceName is not available
          price: serviceDetails?.price || 0,  // Handle case where price is not available
          quantity: 1,  // Default to 1
        },
      ],
    };

    try {
      const response = await fetch("/payment/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,  // Include the authorization token if needed
        },
        body: JSON.stringify(bookingData),  // Ensure you stringify the body correctly
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('bookingData', JSON.stringify(bookingData)); // Store booking data in localStorage
        window.location = data.url;  // Redirect to Stripe
      } else {
        console.error(`Checkout failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  // Helper function to extract customer ID from the token
  const extractCustomerIdFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("Token payload extracted:", payload);
      return payload.userId;  // Extract 'userId' from token payload
    } catch (err) {
      console.error("Error decoding token:", err);
      return null;
    }
  };

  if (loading) {
    return <p>Loading details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container">
      <header className="main-header">
        <h1>Review and Payment</h1>
      </header>

      <section className="review-section">
        <h2>Review Your Booking</h2>
        <p><strong>Business:</strong> {businessDetails?.businessName || 'N/A'}</p>
        <p><strong>Provider:</strong> {providerDetails?.[0]?.name || 'N/A'}</p>
        <p><strong>Service:</strong> {serviceDetails?.serviceName || 'N/A'}</p>
        <p><strong>Duration:</strong> {serviceDuration} minutes</p>
        <p><strong>Date:</strong> {selectedDate}</p>
        <p><strong>Start Time:</strong> {selectedTimeSlot}</p>
        <p><strong>Price:</strong> SAR {serviceDetails?.price || 'N/A'}</p>

        <button className="btn btn-primary" onClick={handleCheckout}>
          Pay with Stripe
        </button>
      </section>
    </div>
  );
};

export default ReviewAndPayment;
