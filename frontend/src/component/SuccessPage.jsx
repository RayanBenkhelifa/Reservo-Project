// SuccessPage.jsx

import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const updateBookingStatus = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const bookingId = queryParams.get("bookingId");
        const sessionId = queryParams.get("session_id");

        if (!bookingId || !sessionId) {
          console.error("Required parameters are missing.");
          navigate("/");
          return;
        }

        // Verify the payment session with Stripe
        const sessionResponse = await fetch(
          `/booking/verify-session?session_id=${sessionId}`
        );
        const sessionData = await sessionResponse.json();

        if (sessionData.payment_status !== "paid") {
          console.error("Payment not successful.");
          navigate("/payment-failed");
          return;
        }

        // Update the booking status
        const response = await fetch(`/booking/update-status/${bookingId}`, {
          method: "POST",
        });

        const data = await response.json();

        if (response.ok && data.success) {
          console.log("Booking status updated successfully!");
          navigate(`/booking-confirmation?bookingId=${bookingId}`);
        } else {
          console.error("Failed to update booking status:", data.error);
        }
      } catch (error) {
        console.error("Error updating booking status:", error);
      }
    };

    updateBookingStatus();
  }, [location, navigate]);

  return (
    <div>
      <h1>Payment Successful!</h1>
      <p>Your booking is being processed...</p>
    </div>
  );
};

export default SuccessPage;
