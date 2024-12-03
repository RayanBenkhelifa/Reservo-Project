// CustomerBookings.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReviewForm from "./ReviewForm";
import CustomerNavBar from "./CustomerNavBar";

const CustomerBookings = () => {
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch customer bookings
  const fetchBookings = async () => {
    try {
      const response = await fetch("/booking/customer-bookings", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();

      if (response.ok) {
        setUpcomingBookings(data.upcomingBookings);
        setPastBookings(data.pastBookings);
      } else {
        setError("Failed to fetch bookings.");
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to fetch bookings.");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    try {
      const response = await fetch(`/booking/cancel/${bookingId}`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        // Remove the canceled booking from upcoming bookings
        setUpcomingBookings((prevBookings) =>
          prevBookings.filter((booking) => booking._id !== bookingId)
        );
        alert("Booking canceled successfully");
      } else {
        setError("Failed to cancel a paid booking.");
      }
    } catch (err) {
      console.error("Error canceling booking:", err);
      setError("Failed to cancel booking.");
    }
  };

  const handleRescheduleBooking = (booking) => {
    if (!booking.service || booking.service.duration === undefined) {
      alert("Service duration is missing. Cannot reschedule.");
      return;
    }

    const duration = booking.service.duration;
    const path = `/time-slots/${booking.provider._id}?businessId=${booking.businessOwner._id}&serviceId=${booking.service._id}&duration=${duration}&bookingId=${booking._id}`;
    navigate(path);
  };

  const handleReviewSubmit = async (
    bookingId,
    businessRating,
    providerRating,
    comment
  ) => {
    try {
      const response = await fetch("/review/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          bookingId,
          businessRating,
          providerRating,
          comment,
        }),
      });

      if (response.ok) {
        alert("Review submitted successfully!");
        // Update the pastBookings state to mark the booking as reviewed
        setPastBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === bookingId
              ? { ...booking, isReviewed: true }
              : booking
          )
        );
      } else {
        setError("Failed to submit review.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setError("Failed to submit review.");
    }
  };

  return (
    <>
      <CustomerNavBar />
      <div className="container">
        <h2>Your Upcoming Bookings</h2>
        {error && <p className="error-message">{error}</p>}
        <table className="table">
          <thead>
            <tr>
              <th>Business Name</th> {/* New column for Business Name */}
              <th>Service</th>
              <th>Provider</th>
              <th>Date</th>
              <th>Time</th>
              <th>Duration</th>
              <th>Payment Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {upcomingBookings.map((booking) => (
              <tr key={booking._id}>
                <td>
                  {booking.businessOwner
                    ? booking.businessOwner.businessName
                    : "Business not available"}
                </td>
                <td>
                  {booking.service
                    ? booking.service.serviceName
                    : "Service not available"}
                </td>
                <td>
                  {booking.provider
                    ? booking.provider.name
                    : "Provider not available"}
                </td>
                <td>{new Date(booking.date).toLocaleDateString()}</td>
                <td>{booking.startTime}</td>
                <td>
                  {booking.service && booking.service.duration
                    ? `${booking.service.duration} mins`
                    : "Duration not available"}
                </td>
                <td>{booking.paymentStatus}</td>
                <td>
                  <div className="booking-actions">
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      className="btn cancel-btn"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleRescheduleBooking(booking)}
                      className="btn reschedule-btn"
                    >
                      Reschedule
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Past Bookings Table with Review Option */}
        <h2>Your Previous Appointments</h2>
        <table className="appointments-table">
          <thead>
            <tr>
              <th>Business Name</th> {/* New column for Business Name */}
              <th>Service</th>
              <th>Provider</th>
              <th>Date</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pastBookings.map((booking) => (
              <tr key={booking._id}>
                <td>
                  {booking.businessOwner
                    ? booking.businessOwner.businessName
                    : "Business not available"}
                </td>
                <td>
                  {booking.service
                    ? booking.service.serviceName
                    : "Service not available"}
                </td>
                <td>
                  {booking.provider
                    ? booking.provider.name
                    : "Provider not available"}
                </td>
                <td>{new Date(booking.date).toLocaleDateString()}</td>
                <td>{booking.startTime}</td>
                <td>
                  {booking.isReviewed ? (
                    <span>Reviewed</span>
                  ) : (
                    <ReviewForm
                      bookingId={booking._id}
                      handleReviewSubmit={handleReviewSubmit}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CustomerBookings;
