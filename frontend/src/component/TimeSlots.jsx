import React, { useState } from 'react';
import '../styles.css';

const TimeSlots = () => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  const timeSlots = [
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
  ];

  const handleTimeSlotSelection = (timeSlot) => {
    setSelectedTimeSlot(timeSlot); // Update the selected time slot
  };

  const handleContinueBooking = () => {
    if (selectedTimeSlot) {
      console.log('Selected Time Slot:', selectedTimeSlot);
      // Continue booking logic goes here, such as redirecting to a new page or submitting data
    } else {
      alert('Please select a time slot to continue.');
    }
  };

  return (
    <div className="container">
      <header className="main-header">
        <h1>Select a Time Slot</h1>
        <p>Please choose an available time slot for your appointment.</p>
      </header>

      {/* Time Slot Section */}
      <section id="time-slots" className="time-slots-category">
        <h2>Select a Time Slot</h2>
        <div className="time-slots-list">
          {timeSlots.map((timeSlot, index) => (
            <button
              key={index}
              className={`time-slot ${selectedTimeSlot === timeSlot ? 'selected' : ''}`}
              onClick={() => handleTimeSlotSelection(timeSlot)}
            >
              {timeSlot}
            </button>
          ))}
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
