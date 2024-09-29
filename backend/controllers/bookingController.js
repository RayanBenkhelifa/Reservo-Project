// controllers/businessController.js
const Service = require('../models/Service');
const BusinessOwner = require('../models/BusinessOwner');
const Booking = require('../models/booking');

// Get available time slots for a provider and service on a specific date
const getAvailableTimeSlots = async (req, res) => {
  try {
    const { businessId, providerId, serviceId, date } = req.body;

    // Find the business and provider
    const business = await BusinessOwner.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    const provider = business.providers.id(providerId);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    // Fetch the service details (like duration)
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const { start: startTime, end: endTime } = business.operatingHours;  // Operating hours of the business
    const serviceDuration = service.duration;  // Service duration in minutes

    // Generate all possible time slots for the day
    const availableSlots = generateTimeSlots(startTime, endTime, serviceDuration);

    // Check existing bookings for the provider on that date
    const existingBookings = await Booking.find({
      provider: providerId,
      date: date
    });

    // Filter out time slots that overlap with existing bookings
    const filteredSlots = availableSlots.filter(slot => {
      const slotStart = slot.start;
      const slotEnd = slot.end;

      // Check if this slot overlaps with any existing bookings
      for (const booking of existingBookings) {
        if (
          (slotStart >= booking.startTime && slotStart < booking.endTime) ||
          (slotEnd > booking.startTime && slotEnd <= booking.endTime)
        ) {
          return false;  // This slot is not available
        }
      }
      return true;  // This slot is available
    });

    res.status(200).json({ availableSlots: filteredSlots });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve available time slots' });
  }
};

// Helper function to generate time slots
const generateTimeSlots = (start, end, serviceDuration) => {
  const slots = [];
  let currentTime = convertToMinutes(start);  // Converts time to minutes for easy calculations
  const endTime = convertToMinutes(end);

  while (currentTime + serviceDuration <= endTime) {
    const slotStart = convertToTime(currentTime);
    const slotEnd = convertToTime(currentTime + serviceDuration);
    slots.push({ start: slotStart, end: slotEnd });
    currentTime += serviceDuration;
  }

  return slots;
};

// Helper to convert "09:00 AM" style time to minutes from midnight
const convertToMinutes = (time) => {
  // Logic to convert time string to minutes (e.g., "09:00 AM" to 540 minutes)
  const [hour, minutePart] = time.split(':');
  const minutes = parseInt(minutePart.split(' ')[0], 10);
  const isPM = time.includes('PM');
  return (parseInt(hour) % 12) * 60 + minutes + (isPM ? 12 * 60 : 0);
};

// Helper to convert minutes from midnight back to "09:00 AM" style time
const convertToTime = (minutes) => {
  const hour = Math.floor(minutes / 60);
  const min = minutes % 60;
  const isPM = hour >= 12;
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${min < 10 ? '0' : ''}${min} ${isPM ? 'PM' : 'AM'}`;
};

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { customerId, providerId, serviceId, date, startTime, endTime } = req.body;

    // Check if the provider exists
    const business = await BusinessOwner.findOne({ "providers._id": providerId });
    if (!business) {
      return res.status(404).json({ message: "Provider not found" });
    }

    // Check if the selected time slot is already booked for the provider
    const existingBooking = await Booking.findOne({
      provider: providerId,
      date: date,
      $or: [
        { startTime: { $lt: endTime, $gte: startTime } }, // Booking starts within the desired slot
        { endTime: { $gt: startTime, $lte: endTime } },   // Booking ends within the desired slot
        { startTime: { $lte: startTime }, endTime: { $gte: endTime } } // Booking overlaps
      ]
    });

    if (existingBooking) {
      return res.status(400).json({ message: "Time slot is already booked" });
    }

    // Create new booking
    const newBooking = new Booking({
      customer: customerId,
      provider: providerId,
      service: serviceId,
      date: date,
      startTime: startTime,
      endTime: endTime
    });

    await newBooking.save();
    res.status(201).json({ message: 'Booking created successfully', booking: newBooking });

  } catch (error) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

module.exports = { getAvailableTimeSlots, createBooking };
