const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);  // Ensure your Stripe secret key is set
const Service = require('../models/Service');
const BusinessOwner = require('../models/BusinessOwner');
const Provider = require('../models/Provider');
const Booking = require('../models/Booking');

// Function to exclude booked slots
const filterBookedSlots = (timeSlots, bookings, serviceDuration) => {
  const availableSlots = [];

  // Convert service duration from minutes to milliseconds
  const serviceDurationMs = serviceDuration * 60000;

  timeSlots.forEach(slot => {
    let slotStartTime = new Date(`1970-01-01 ${slot}`);
    let slotEndTime = new Date(slotStartTime.getTime() + serviceDurationMs);

    let hasOverlap = bookings.some(booking => {
      let bookingStart = new Date(`1970-01-01 ${booking.startTime}`);
      let bookingEnd = new Date(`1970-01-01 ${booking.endTime}`);

      // Check for overlap
      return slotStartTime < bookingEnd && slotEndTime > bookingStart;
    });

    if (!hasOverlap) {
      availableSlots.push(slot);
    }
  });

  console.log("Available slots after filtering:", availableSlots);
  return availableSlots;
};

const generateTimeSlots = (startTime, endTime, interval) => {
  const slots = [];
  let start = new Date(`1970-01-01 ${startTime}`);
  let end = new Date(`1970-01-01 ${endTime}`);

  console.log("Parsed Start Time:", start);
  console.log("Parsed End Time:", end);

  while (start < end) {
    slots.push(start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    start = new Date(start.getTime() + interval * 60000);
  }
  console.log("Generated time slots:", slots);
  return slots;
};

// Route handler to get available slots for a provider and a specific date
const getAvailableSlots = async (req, res) => {
  try {
    const { providerId, selectedDate, serviceDuration } = req.body;

    // Find the provider and its associated business
    const business = await BusinessOwner.findOne({ "providers": providerId });
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    const provider = await Provider.findById(providerId);
    const { start: startTime, end: endTime } = business.operatingHours;

    console.log("Operating hours:", startTime, endTime);

    // Generate the time slots based on 10-minute intervals
    let timeSlots = generateTimeSlots(startTime.trim(), endTime.trim(), 10);

    // Find existing bookings for the provider on the selected date
    const bookingsOnDate = await Booking.find({
      provider: providerId,
      date: selectedDate
    });

    console.log("Existing bookings on selected date:", bookingsOnDate);

    // Filter out booked slots
    const availableSlots = filterBookedSlots(timeSlots, bookingsOnDate, serviceDuration);

    // Respond with available slots
    res.status(200).json({
      message: "Available slots fetched successfully",
      availableSlots
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch available slots" });
  }
};

// Function to create a booking with Stripe integration
const createBooking = async (req, res) => {
  try {
    const { customerId, providerId, serviceId, selectedDate, startTime } = req.body;
    console.log(customerId, providerId, serviceId, selectedDate, startTime);

    // Step 1: Find the service to get the service duration
    const service = await Service.findById(serviceId);
    const serviceDuration = service.duration; // Duration is in minutes

    // Step 2: Parse start time properly by combining selectedDate and startTime
    const startDateTime = new Date(`${selectedDate} ${startTime}`);
    if (isNaN(startDateTime.getTime())) {
      return res.status(400).json({ error: 'Invalid start time format' });
    }

    // Step 3: Calculate the end time by adding service duration
    const endDateTime = new Date(startDateTime.getTime() + serviceDuration * 60000);
    const formattedEndTime = endDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    console.log("Start time:", startTime);
    console.log("End time:", formattedEndTime); // Check that this is a valid time

    // Step 4: Check if the slot is available before booking
    const existingBooking = await Booking.findOne({
      provider: providerId,
      date: selectedDate,
      startTime: { $lt: formattedEndTime },
      endTime: { $gt: startTime }
    });

    console.log("Existing booking found:", existingBooking);  // Log the found booking

    if (existingBooking) {
      return res.status(400).json({ error: 'Selected time slot is not available' });
    }

    // Step 5: Find the associated business owner
    const business = await BusinessOwner.findOne({ providers: providerId });
    if (!business) {
      return res.status(404).json({ error: "Business owner not found" });
    }
    
    // Step 6: Create a new booking (without payment completed yet)
    const newBooking = new Booking({
      customer: customerId,
      provider: providerId,
      service: serviceId,
      businessOwner: business._id,  // Assign the business owner from the business
      date: selectedDate,
      startTime,
      endTime: formattedEndTime, // Store the correctly formatted end time
      paymentStatus: 'pending', // Set initial payment status as pending
    });

    await newBooking.save();

    // Step 7: Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'SAR',
          product_data: {
            name: service.serviceName,
            description: `Service by ${providerId}`,
          },
          unit_amount: service.price * 100, // Amount in cents
        },
        quantity: 1,
      }],
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    // Step 8: Store Stripe session ID in the booking
    newBooking.stripeSessionId = session.id;
    await newBooking.save();

    // Step 9: Send Stripe checkout URL to the client
    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

module.exports = { getAvailableSlots, createBooking };
