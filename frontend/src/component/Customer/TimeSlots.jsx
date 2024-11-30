import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import CustomerNavBar from "./CustomerNavBar"; // Adjust the path as needed

const TimeSlots = () => {
  const { providerId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const businessId = queryParams.get("businessId");
  const serviceId = queryParams.get("serviceId");
  const serviceDuration = parseInt(queryParams.get("duration"), 10);
  const bookingId = queryParams.get("bookingId"); // Check if it's a reschedule
  const { authState } = useContext(AuthContext);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  useEffect(() => {
    if (!authState.isAuthenticated) {
      const fullPath = `${location.pathname}${location.search}`;
      console.log(fullPath); // Outputs the full path including query parameters
      navigate("/login-customer", {
        state: {
          from: fullPath,
          providerId,
          serviceId,
          serviceDuration,
          selectedDate,
          selectedTimeSlot,
          businessId,
          bookingId,
        },
      });
    }
  }, [
    authState.isAuthenticated,
    navigate,
    location.pathname,
    location.search,
    providerId,
    serviceId,
    serviceDuration,
    selectedDate,
    selectedTimeSlot,
    businessId,
    bookingId,
  ]);

  // Fetch available time slots
  useEffect(() => {
    const fetchAvailableTimeSlots = async () => {
      try {
        const response = await fetch("/booking/available-slots", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            providerId,
            selectedDate,
            serviceDuration,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          setTimeSlots(data.availableSlots);
        } else {
          alert("Failed to fetch available time slots.");
        }
      } catch (error) {
        console.error("Error fetching available slots:", error);
        alert("Error fetching available slots.");
      }
    };

    fetchAvailableTimeSlots();
  }, [providerId, selectedDate, serviceDuration]);

  const handleTimeSlotSelection = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  // **Updated availableDates Generation**
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.toLocaleDateString("en-CA"); // Returns 'YYYY-MM-DD' in local time
  });

  const handleDateSelection = (date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
  };

  const handleContinueBooking = async () => {
    if (!authState.isAuthenticated) {
      navigate("/login-customer", {
        state: {
          from: location.pathname,
          providerId,
          serviceId,
          serviceDuration,
          selectedDate,
          selectedTimeSlot,
          businessId,
          bookingId,
        },
      });
      return;
    }

    if (!selectedTimeSlot) {
      alert("Please select a time slot to continue.");
      return;
    }

    // If bookingId is present, we are rescheduling
    if (bookingId) {
      try {
        const response = await fetch(`/booking/reschedule/${bookingId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            newDate: selectedDate,
            newStartTime: selectedTimeSlot, // Corrected parameter name
          }),
        });

        const data = await response.json();

        if (response.ok) {
          alert("Booking rescheduled successfully");
          navigate("/customer-bookings"); // Redirect to customer bookings
        } else {
          alert(data.error || "Failed to reschedule booking.");
        }
      } catch (error) {
        console.error("Error rescheduling booking:", error);
        alert("An error occurred while rescheduling.");
      }
    } else {
      // Proceed with the booking flow
      navigate(
        `/review-payment/${providerId}?businessId=${businessId}&serviceId=${serviceId}&duration=${serviceDuration}&date=${selectedDate}&time=${selectedTimeSlot}`
      );
    }
  };

  return (
    <>
      <CustomerNavBar />

      <div className="container">
        <header className="main-header">
          <h1>
            {bookingId ? "Reschedule Your Booking" : "Select a Time Slot"}
          </h1>
          <p>
            {bookingId
              ? "Choose a new time for your appointment."
              : "Please choose an available time slot for your appointment."}
          </p>
        </header>

        <section id="date-selection" className="date-category">
          <h2>Select a Date</h2>
          <div className="date-list">
            {availableDates.map((date) => (
              <button
                key={date}
                className={`date-item ${
                  selectedDate === date ? "selected" : ""
                }`}
                onClick={() => handleDateSelection(date)}
              >
                {date}
              </button>
            ))}
          </div>
        </section>

        <section id="time-slots" className="time-slots-category">
          <h2>Select a Time Slot</h2>
          <div className="time-slots-list">
            {timeSlots.length > 0 ? (
              timeSlots.map((timeSlot, index) => (
                <button
                  key={index}
                  className={`time-slot ${
                    selectedTimeSlot === timeSlot ? "selected" : ""
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

        <div className="continue-booking">
          <button className="btn" onClick={handleContinueBooking}>
            {bookingId ? "Confirm Reschedule" : "Continue Booking"}
          </button>
        </div>
      </div>
    </>
  );
};

export default TimeSlots;
