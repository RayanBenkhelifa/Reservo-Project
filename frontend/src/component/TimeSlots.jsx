import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const TimeSlots = () => {
  const { providerId } = useParams(); // Get providerId from URL path
  const location = useLocation(); // Get the full location object to access query params
  const navigate = useNavigate();

  // Parse query parameters using URLSearchParams
  const queryParams = new URLSearchParams(location.search);
  const businessId = queryParams.get("businessId");  // Extract businessId from query parameters
  const serviceId = queryParams.get("serviceId");
  const serviceDuration = parseInt(queryParams.get("duration"), 10);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  ); // Default to today's date
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  // Fetch available time slots from backend when date, providerId, or serviceDuration changes
  useEffect(() => {
    const fetchAvailableTimeSlots = async () => {
      try {
        const response = await fetch("/booking/available-slots", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            providerId,
            selectedDate,
            serviceDuration, // Pass the service duration from the query parameters
          }),
        });

        const data = await response.json();
        if (response.ok) {
          setTimeSlots(data.availableSlots); // Set available time slots
        } else {
          alert("Failed to fetch available time slots.");
        }
      } catch (error) {
        console.error("Error fetching available slots:", error);
      }
    };

    fetchAvailableTimeSlots();
  }, [providerId, selectedDate, serviceDuration]);

  // Handle time slot selection (ensure we only select the slots that match the correct service duration)
  const handleTimeSlotSelection = (timeSlot) => {
    setSelectedTimeSlot(timeSlot); // Update selected time slot
  };

  // Handle date selection
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.toISOString().split("T")[0]; // Format date as 'YYYY-MM-DD'
  });

  const handleDateSelection = (date) => {
    setSelectedDate(date); // Update selected date
    setSelectedTimeSlot(null); // Reset the selected time slot when date changes
  };

  // Handle booking creation
  const handleContinueBooking = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login-customer", {
        state: {
          from: location.pathname,
          providerId,
          serviceId,
          serviceDuration,
          selectedDate,
          selectedTimeSlot,
          businessId,  // Pass businessId
        },
      });
      return;
    }
  
    if (!selectedTimeSlot) {
      alert("Please select a time slot to continue.");
      return;
    }
  
    // Log values to verify they are correct
    console.log(providerId, serviceId, serviceDuration, selectedDate, selectedTimeSlot, businessId);
  
    // Redirect to Review and Payment page, passing necessary data in the URL
    navigate(`/review-payment/${providerId}?businessId=${businessId}&serviceId=${serviceId}&duration=${serviceDuration}&date=${selectedDate}&time=${selectedTimeSlot}`);
  };
  
  // Helper function to extract customer ID from the token
  const extractCustomerIdFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.userId; // Extract 'userId' from token payload
    } catch (err) {
      console.error("Error decoding token:", err);
      return null;
    }
  };

  return (
    <div className="container">
      <header className="main-header">
        <h1>Select a Time Slot</h1>
        <p>Please choose an available time slot for your appointment.</p>
      </header>

      {/* Date Selection */}
      <section id="date-selection" className="date-category">
        <h2>Select a Date</h2>
        <div className="date-list">
          {availableDates.map((date) => (
            <button
              key={date}
              className={`date-item ${selectedDate === date ? "selected" : ""}`}
              onClick={() => handleDateSelection(date)}
            >
              {date}
            </button>
          ))}
        </div>
      </section>

      {/* Time Slot Section */}
      <section id="time-slots" className="time-slots-category">
        <h2>Select a Time Slot</h2>
        <div className="time-slots-list">
          {timeSlots.length > 0 ? (
            timeSlots.map((timeSlot, index) => (
              <button
                key={index}
                className={`time-slot ${selectedTimeSlot === timeSlot ? "selected" : ""
                  }`}
                onClick={() => handleTimeSlotSelection(timeSlot)}
              >
                {timeSlot}
              </button>
            ))
          ) : (
            <p>No available time slots for the selected date.</p>
          )}
        </div>
      </section>

      {/* Continue Booking Button */}
      <div className="continue-booking">
        <button className="btn" onClick={handleContinueBooking}>
          Continue Booking
        </button>
      </div>
    </div>
  );
};

export default TimeSlots;
