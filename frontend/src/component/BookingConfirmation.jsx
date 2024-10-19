import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BookingConfirmationPage = () => {
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [serviceName, setServiceName] = useState('');
  const [providerName, setProviderName] = useState('');

  useEffect(() => {
    // Retrieve booking details from local storage or another method after success
    const savedBooking = JSON.parse(localStorage.getItem('bookingData'));

    if (savedBooking) {
      setBookingDetails(savedBooking);
      fetchServiceName(savedBooking.serviceId);
      fetchProviderName(savedBooking.providerId);
    } else {
      console.error('No booking data found');
      // If no booking details, redirect to home or another page
      navigate('/');
    }
  }, [navigate]);

  // Fetch the service name using the service ID
  const fetchServiceName = async (serviceId) => {
    try {
      const response = await fetch(`/customer/services/${serviceId}`);
      const serviceData = await response.json();
      setServiceName(serviceData.serviceName);  // Assuming the response contains serviceName
    } catch (error) {
      console.error('Failed to fetch service name:', error);
    }
  };

  // Fetch the provider name using the provider ID
  const fetchProviderName = async (providerId) => {
    try {
      const response = await fetch(`/customer/providers/${providerId}`);
      const providerData = await response.json();
      setProviderName(providerData.name);  // Assuming the response contains the provider's name
    } catch (error) {
      console.error('Failed to fetch provider name:', error);
    }
  };

  return (
    <div className="container">
      <header className="main-header">
        <h1>Booking Confirmed!</h1>
      </header>

      <section className="confirmation-section">
        {bookingDetails ? (
          <>
            <p>Thank you for your booking!</p>
            <p><strong>Service:</strong> {serviceName || 'Loading...'}</p>
            <p><strong>Provider:</strong> {providerName || 'Loading...'}</p>
            <p><strong>Date:</strong> {bookingDetails.selectedDate}</p>
            <p><strong>Time:</strong> {bookingDetails.startTime}</p>
          </>
        ) : (
          <p>Loading booking details...</p>
        )}

        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Return to Home
        </button>
      </section>
    </div>
  );
};

export default BookingConfirmationPage;
