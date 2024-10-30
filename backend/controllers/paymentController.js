const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking'); // Import the Booking model
const Service = require('../models/Service');
const Provider = require('../models/Provider');
const BusinessOwner = require('../models/BusinessOwner');
const Customer = require('../models/Customer');

const createCheckoutSession = async (req, res) => {
  try {
    const { customerId, providerId, serviceId, selectedDate, startTime, items } = req.body;

    // Step 1: Fetch necessary details
    const service = await Service.findById(serviceId);
    const provider = await Provider.findById(providerId);
    const business = await BusinessOwner.findOne({ providers: providerId });
    const customer = await Customer.findById(customerId);

    if (!service || !provider || !business || !customer) {
      return res.status(400).json({ error: 'Invalid booking details' });
    }

    // Step 2: Calculate end time
    const serviceDuration = service.duration;
    const startDateTime = new Date(`${selectedDate} ${startTime}`);
    const endDateTime = new Date(startDateTime.getTime() + serviceDuration * 60000);
    const formattedEndTime = endDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Step 3: Check for existing bookings
    const existingBooking = await Booking.findOne({
      provider: providerId,
      date: selectedDate,
      startTime: { $lt: formattedEndTime },
      endTime: { $gt: startTime },
    });

    if (existingBooking) {
      return res.status(400).json({ error: 'Selected time slot is not available' });
    }

    // Step 4: Create new booking with 'pending' status
    const newBooking = new Booking({
      customer: customerId,
      provider: providerId,
      service: serviceId,
      businessOwner: business._id,
      date: selectedDate,
      startTime,
      endTime: formattedEndTime,
      paymentStatus: 'pending',
    });

    await newBooking.save();

    // Step 5: Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item) => ({
        price_data: {
          currency: 'USD',
          product_data: { name: item.name },
          unit_amount: item.price * 100, // Convert price to cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/booking-confirmation?bookingId=${newBooking._id}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: {
        bookingId: newBooking._id.toString(),
      },
    });

    // Step 6: Update booking with Stripe session ID
    newBooking.stripeSessionId = session.id;
    await newBooking.save();

    // Step 7: Respond with Stripe checkout URL
    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};
const verifySession = async (req, res) => {
  const { session_id } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    res.json(session);
  } catch (error) {
    console.error("Error verifying session:", error);
    res.status(400).json({ error: "Could not verify payment session" });
  }
};
module.exports = { createCheckoutSession,verifySession  };
