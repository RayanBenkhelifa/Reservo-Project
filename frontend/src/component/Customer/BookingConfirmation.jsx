// BookingConfirmationPage.jsx

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const BookingConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      const queryParams = new URLSearchParams(location.search);
      const bookingId = queryParams.get("bookingId");

      if (bookingId) {
        try {
          const response = await fetch(`/booking/details/${bookingId}`);
          const data = await response.json();

          if (response.ok && data.success) {
            setBookingDetails(data.booking);
            console.log(bookingDetails);
          } else {
            console.error("Failed to fetch booking details:", data.error);
          }
        } catch (error) {
          console.error("Error fetching booking details:", error);
        }
      } else {
        console.error("No booking ID found in URL");
        navigate("/");
      }
    };

    fetchBookingDetails();
  }, [location, navigate]);

  if (!bookingDetails) {
    return <p>Loading booking details...</p>;
  }

  // Determine if booking is confirmed
  const isBookingConfirmed =
    bookingDetails.paymentStatus === "completed" ||
    bookingDetails.paymentStatus === "unpaid";

  return (
    <div className="container">
      <header className="main-header">
        <h1>{isBookingConfirmed ? "Booking Confirmed!" : "Booking Pending"}</h1>
      </header>
      <section className="confirmation-section">
        {isBookingConfirmed ? (
          <>
            <p>Thank you for your booking!</p>
            <p>
              <strong>Business Name:</strong> {bookingDetails.businessName}
            </p>
            <p>
              <strong>Service:</strong> {bookingDetails.serviceName}
            </p>
            <p>
              <strong>Provider:</strong> {bookingDetails.providerName}
            </p>
            <p>
              <strong>Date:</strong> {bookingDetails.date}
            </p>
            <p>
              <strong>Time:</strong> {bookingDetails.startTime}
            </p>
          </>
        ) : (
          <p>Your booking is pending. Please complete the payment.</p>
        )}
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Return to Home
        </button>
      </section>
    </div>
  );
};

export default BookingConfirmationPage;
