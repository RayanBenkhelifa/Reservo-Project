import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBookingCreation = async () => {
    try {
      // Retrieve session ID from URL query parameters
      const queryParams = new URLSearchParams(location.search);
      const sessionId = queryParams.get("session_id");

      if (!sessionId) {
        console.error("No session ID found in the URL.");
        return;
      }

      // Retrieve booking data from localStorage
      const bookingData = JSON.parse(localStorage.getItem("bookingData"));

      if (!bookingData) {
        console.error("No booking data found.");
        return;
      }

      // Log bookingData to ensure it has all the necessary fields
      console.log("Booking data before verification:", bookingData);

      // Verify the payment session with Stripe
      const sessionResponse = await fetch(`/payment/verify-session?session_id=${sessionId}`);
      const sessionData = await sessionResponse.json();

      if (!sessionResponse.ok || sessionData.payment_status !== "paid") {
        console.error("Payment was not successful or could not verify the payment.");
        return;
      }

      // Update booking with paymentStatus as 'completed'
      bookingData.paymentStatus = 'completed';

      // Log the booking data again to see the final data being sent
      console.log("Booking data being sent to backend:", bookingData);

      // Send request to create the booking in the database
      const response = await fetch("/booking/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const responseData = await response.json();

      // Log the server response
      console.log("Server response:", responseData);

      if (response.ok) {
        console.log("Booking created successfully!");
        navigate("/booking-confirmation"); // Redirect to confirmation page
      } else {
        console.error("Failed to create booking:", responseData);
      }
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  useEffect(() => {
    handleBookingCreation(); // Trigger booking creation after success
  }, []);

  return (
    <div>
      <h1>Payment Successful!</h1>
      <p>Your booking is being processed...</p>
    </div>
  );
};

export default SuccessPage;
