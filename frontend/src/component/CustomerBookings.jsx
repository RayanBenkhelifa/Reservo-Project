import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CustomerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch customer bookings
  const fetchBookings = async () => {
    try {
      const response = await fetch('/booking/customer-bookings', {
        method: 'GET',
        credentials: 'include', // Ensures cookies (session) are sent with the request
      });
      const data = await response.json();

      if (response.ok) {
        // Filter out canceled bookings
        setBookings(
          data.bookings.filter((booking) => booking.paymentStatus !== 'canceled')
        );

        // Log for debugging missing duration warnings
        data.bookings.forEach((booking) => {
          if (!booking.service || booking.service.duration === undefined) {
            console.warn(
              `Missing service duration for booking ID: ${booking._id}`
            );
          }
        });
      } else {
        setError('Failed to fetch bookings.');
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to fetch bookings.');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    try {
      const response = await fetch(`/booking/cancel/${bookingId}`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        // Remove the canceled booking from state
        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking._id !== bookingId)
        );
        alert('Booking canceled successfully');
      } else {
        setError('Failed to cancel booking.');
      }
    } catch (err) {
      console.error('Error canceling booking:', err);
      setError('Failed to cancel booking.');
    }
  };

  const handleRescheduleBooking = (booking) => {
    if (!booking.service || booking.service.duration === undefined) {
      alert('Service duration is missing. Cannot reschedule.');
      return;
    }

    const duration = booking.service.duration;
    const path = `/time-slots/${booking.provider._id}?businessId=${booking.businessOwner._id}&serviceId=${booking.service._id}&duration=${duration}&bookingId=${booking._id}`;
    navigate(path);
  };

  const handleReviewSubmit = async (bookingId, businessRating, providerRating, comment) => {
    try {
      await axios.post('/review/create', {
        bookingId,
        businessRating,
        providerRating,
        comment,
      });
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Failed to submit review.');
    }
  };

  return (
    <div className="container">
      <h2>Your Bookings</h2>
      {error && <p className="error-message">{error}</p>}
      <table className="table">
        <thead>
          <tr>
            <th>Service</th>
            <th>Provider</th>
            <th>Date</th>
            <th>Time</th>
            <th>Duration</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td>{booking.service.serviceName}</td>
              <td>{booking.provider.name}</td>
              <td>{new Date(booking.date).toLocaleDateString()}</td>
              <td>{booking.startTime}</td>
              <td>
                {booking.service.duration
                  ? `${booking.service.duration} mins`
                  : 'Duration not available'}
              </td>
              <td>{booking.paymentStatus}</td>
              <td>
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
            <th>Service</th>
            <th>Provider</th>
            <th>Date</th>
            <th>Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings
            .filter(booking => new Date(booking.date) < new Date())
            .map((booking) => (
              <tr key={booking._id}>
                <td>{booking.service.serviceName}</td>
                <td>{booking.provider.name}</td>
                <td>{new Date(booking.date).toLocaleDateString()}</td>
                <td>{booking.startTime}</td>
                <td>
                  <ReviewForm
                    bookingId={booking._id}
                    handleReviewSubmit={handleReviewSubmit}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

// Review form for submitting reviews after the booking time has passed
const ReviewForm = ({ bookingId, handleReviewSubmit }) => {
  const [businessRating, setBusinessRating] = useState(5);
  const [providerRating, setProviderRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    handleReviewSubmit(bookingId, businessRating, providerRating, comment);
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <label>
        Business Rating:
        <input
          type="number"
          value={businessRating}
          onChange={(e) => setBusinessRating(e.target.value)}
          min="1"
          max="5"
          required
        />
      </label>
      <label>
        Provider Rating:
        <input
          type="number"
          value={providerRating}
          onChange={(e) => setProviderRating(e.target.value)}
          min="1"
          max="5"
          required
        />
      </label>
      <label>
        Comment:
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Leave a comment..."
        />
      </label>
      <button type="submit" className="btn">Submit Review</button>
    </form>
  );
};

export default CustomerBookings;
