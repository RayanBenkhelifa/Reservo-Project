// controllers/bookingController.js

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Service = require("../models/Service");
const BusinessOwner = require("../models/BusinessOwner");
const Provider = require("../models/Provider");
const Booking = require("../models/Booking");
const Customer = require("../models/Customer");
const nodemailer = require("nodemailer");

// Setup transporter for SendGrid using nodemailer
const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL_USERNAME, // This is always 'apikey' for SendGrid
    pass: process.env.EMAIL_PASSWORD, // Your SendGrid API key
  },
});

// Send confirmation email
const sendConfirmationEmail = async (customerEmail, bookingDetails) => {
  const mailOptions = {
    from: "reservoreminder@hotmail.com", // Use your verified sender email
    to: customerEmail,
    subject: "Booking Confirmation - Reservo",
    text: `Your booking has been confirmed.\n\nDetails:\nService: ${bookingDetails.serviceName}\nProvider: ${bookingDetails.providerName}\nDate: ${bookingDetails.date}\nTime: ${bookingDetails.startTime}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Confirmation email sent successfully");
  } catch (error) {
    console.error("Error sending confirmation email:", error.message);
  }
};

// Send reminder email 1 hour before the appointment
const sendReminderEmail = async (customerEmail, bookingDetails) => {
  const mailOptions = {
    from: "reservoreminder@hotmail.com", // Use your verified sender email
    to: customerEmail,
    subject: "Reminder - Upcoming Appointment in 1 Hour",
    text: `Reminder: Your appointment is scheduled in 1 hour.\n\nDetails:\nService: ${bookingDetails.serviceName}\nProvider: ${bookingDetails.providerName}\nDate: ${bookingDetails.date}\nTime: ${bookingDetails.startTime}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Reminder email sent successfully");
  } catch (error) {
    console.error("Error sending reminder email:", error.message);
  }
};

// Generate time slots
const generateTimeSlots = (startTime, endTime, interval) => {
  const slots = [];
  let start = new Date(`1970-01-01 ${startTime}`);
  let end = new Date(`1970-01-01 ${endTime}`);

  while (start < end) {
    slots.push(
      start.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    );
    start = new Date(start.getTime() + interval * 60000);
  }
  return slots;
};

// Filter booked slots
const filterBookedSlots = (timeSlots, bookings, serviceDuration) => {
  const availableSlots = [];
  const serviceDurationMs = serviceDuration * 60000;

  timeSlots.forEach((slot) => {
    let slotStartTime = new Date(`1970-01-01 ${slot}`);
    let slotEndTime = new Date(slotStartTime.getTime() + serviceDurationMs);

    let hasOverlap = bookings.some((booking) => {
      let bookingStart = new Date(`1970-01-01 ${booking.startTime}`);
      let bookingEnd = new Date(`1970-01-01 ${booking.endTime}`);
      return slotStartTime < bookingEnd && slotEndTime > bookingStart;
    });

    if (!hasOverlap) {
      availableSlots.push(slot);
    }
  });
  return availableSlots;
};

// Controller to get available slots
// Helper function to parse 'h:mm AM/PM' time strings
function parseTime12Hour(timeStr) {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) {
    hours += 12;
  }
  if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  return { hours, minutes };
}

// Controller to get available slots
const getAvailableSlots = async (req, res) => {
  try {
    const { providerId, selectedDate, serviceDuration } = req.body;

    console.log("Selected Date:", selectedDate);

    // Get today's date at midnight (local time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log("Today (midnight):", today);

    // Parse selectedDate into a Date object
    const [year, month, day] = selectedDate.split("-").map(Number);
    const selectedDateObj = new Date(year, month - 1, day);

    console.log("Selected Date Object:", selectedDateObj);

    // Compare selectedDate with today
    if (selectedDateObj < today) {
      console.log("Selected date is in the past.");
      return res
        .status(400)
        .json({ message: "Cannot select a date in the past" });
    }

    // Fetch business operating hours
    const business = await BusinessOwner.findOne({ providers: providerId });
    if (!business) {
      console.log("Business not found for providerId:", providerId);
      return res.status(404).json({ message: "Business not found" });
    }

    console.log("Business Operating Hours:", business.operatingHours);

    const provider = await Provider.findById(providerId);
    const { start: startTime, end: endTime } = business.operatingHours;

    console.log("Start Time:", startTime, "| End Time:", endTime);

    // Generate time slots
    let timeSlots = generateTimeSlots(startTime.trim(), endTime.trim(), 10);

    console.log("Generated Time Slots:", timeSlots);

    // If selectedDate is today, filter out past time slots
    if (selectedDateObj.getTime() === today.getTime()) {
      const currentTime = new Date();

      console.log("Current Time:", currentTime);

      // Filter out past time slots
      timeSlots = timeSlots.filter((slot) => {
        // Parse the slot time
        const { hours, minutes } = parseTime12Hour(slot);

        // Create Date object for slotTime using selected date and slot time
        const slotTime = new Date(selectedDateObj);
        slotTime.setHours(hours, minutes, 0, 0);

        console.log(`Slot Time for "${slot}":`, slotTime);

        // Compare slotTime with currentTime
        const isFuture = slotTime > currentTime;
        console.log(`Is "${slot}" in the future?`, isFuture);

        return isFuture;
      });

      console.log("Filtered Time Slots:", timeSlots);
    }

    // Fetch existing bookings for the selected date
    const bookingsOnDate = await Booking.find({
      provider: providerId,
      date: selectedDate,
      paymentStatus: { $nin: ["canceled"] }, // Exclude canceled bookings
    });

    console.log("Bookings on Selected Date:", bookingsOnDate);

    // Filter out booked slots
    const availableSlots = filterBookedSlots(
      timeSlots,
      bookingsOnDate,
      serviceDuration
    );

    console.log(
      "Available Slots after filtering booked slots:",
      availableSlots
    );

    res.status(200).json({
      message: "Available slots fetched successfully",
      availableSlots,
    });
  } catch (error) {
    console.error("Error fetching available slots:", error);
    res.status(500).json({ error: "Failed to fetch available slots" });
  }
};
// Controller to create a booking
const createBooking = async (req, res) => {
  try {
    const {
      customerId,
      providerId,
      serviceId,
      selectedDate,
      startTime,
      paymentOption,
      items,
    } = req.body;

    const service = await Service.findById(serviceId);
    const provider = await Provider.findById(providerId);

    if (!service || !provider) {
      return res.status(400).json({ error: "Invalid service or provider" });
    }

    const serviceDuration = service.duration;

    const startDateTime = new Date(`${selectedDate} ${startTime}`);
    if (isNaN(startDateTime.getTime())) {
      return res.status(400).json({ error: "Invalid start time format" });
    }

    const endDateTime = new Date(
      startDateTime.getTime() + serviceDuration * 60000
    );
    const formattedEndTime = endDateTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const existingBooking = await Booking.findOne({
      provider: providerId,
      date: selectedDate,
      startTime: { $lt: formattedEndTime },
      endTime: { $gt: startTime },
      paymentStatus: { $ne: "canceled" }, // Exclude canceled bookings
    });

    if (existingBooking) {
      return res
        .status(400)
        .json({ error: "Selected time slot is not available" });
    }

    const business = await BusinessOwner.findOne({ providers: providerId });
    if (!business) {
      return res.status(404).json({ error: "Business owner not found" });
    }

    const customer = await Customer.findById(customerId);

    // Determine payment status based on payment option
    let paymentStatus = "pending";
    if (paymentOption === "venue") {
      paymentStatus = "unpaid"; // Set to 'unpaid' for 'Pay at Venue'
    } else if (paymentOption === "stripe") {
      paymentStatus = "pending";
    }

    // Create a new booking
    const newBooking = new Booking({
      customer: customerId,
      provider: providerId,
      service: serviceId,
      businessOwner: business._id,
      date: selectedDate,
      startTime,
      endTime: formattedEndTime,
      paymentStatus,
    });

    await newBooking.save();

    // Prepare booking details for email
    const bookingDetails = {
      serviceName: service.serviceName,
      providerName: provider.name,
      date: selectedDate,
      startTime,
    };

    if (paymentOption === "venue") {
      // Send confirmation email immediately
      await sendConfirmationEmail(customer.email, bookingDetails);

      // Schedule reminder email
      const appointmentTime = new Date(`${selectedDate} ${startTime}`);
      const reminderTime = new Date(appointmentTime.getTime() - 60 * 60 * 1000); // 1 hour before
      const timeUntilReminder = reminderTime - new Date();

      if (timeUntilReminder > 0) {
        setTimeout(async () => {
          await sendReminderEmail(customer.email, bookingDetails);
        }, timeUntilReminder);
      }

      res.json({
        message: "Booking created successfully",
        bookingId: newBooking._id,
      });
    } else if (paymentOption === "stripe") {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: items.map((item) => ({
          price_data: {
            currency: "SAR",
            product_data: {
              name: item.name,
              description: `Service by ${provider.name}`,
            },
            unit_amount: item.price * 100, // Amount in cents
          },
          quantity: item.quantity,
        })),
        success_url: `${process.env.SERVER_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}&bookingId=${newBooking._id}`,
        cancel_url: `${process.env.SERVER_URL}/booking/cancel?bookingId=${newBooking._id}`,
      });

      // Update booking with Stripe session ID
      newBooking.stripeSessionId = session.id;
      await newBooking.save();

      // Send Stripe checkout URL to the client
      res.json({ url: session.url });
    }
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
};

// Controller to handle Stripe payment success
const handleStripeSuccess = async (req, res) => {
  const sessionId = req.query.session_id;

  try {
    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Find the booking using the session ID
    const booking = await Booking.findOne({ stripeSessionId: sessionId });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Verify that the payment was successful
    if (session.payment_status === "paid") {
      // Update payment status to completed
      booking.paymentStatus = "completed";
      await booking.save();

      // Send confirmation email
      const customer = await Customer.findById(booking.customer);
      const service = await Service.findById(booking.service);
      const provider = await Provider.findById(booking.provider);

      const bookingDetails = {
        serviceName: service.serviceName,
        providerName: provider.name,
        date: booking.date,
        startTime: booking.startTime,
      };

      await sendConfirmationEmail(customer.email, bookingDetails);

      // Schedule reminder email
      const appointmentTime = new Date(`${booking.date} ${booking.startTime}`);
      const reminderTime = new Date(appointmentTime.getTime() - 60 * 60 * 1000); // 1 hour before
      const timeUntilReminder = reminderTime - new Date();

      if (timeUntilReminder > 0) {
        setTimeout(async () => {
          await sendReminderEmail(customer.email, bookingDetails);
        }, timeUntilReminder);
      }

      // Redirect to booking confirmation page on the frontend
      res.redirect(
        `${process.env.CLIENT_URL}/booking-confirmation?bookingId=${booking._id}`
      );
    } else {
      // Payment not completed
      res.redirect(`${process.env.CLIENT_URL}/payment-failed`);
    }
  } catch (error) {
    console.error("Error handling Stripe success:", error);
    res.status(500).json({ error: "Failed to complete payment" });
  }
};

const handleStripeCancel = async (req, res) => {
  const { bookingId } = req.query;

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Update payment status to canceled
    booking.paymentStatus = "canceled";
    await booking.save();

    // Redirect to frontend cancellation confirmation page
    res.redirect(`${process.env.CLIENT_URL}/payment-cancelled`);
  } catch (error) {
    console.error("Error handling Stripe cancellation:", error);
    res.status(500).json({ error: "Failed to cancel booking" });
  }
};

// Controller to verify Stripe payment session
const verifyPaymentSession = async (req, res) => {
  const { session_id } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      res.json({ payment_status: "paid" });
    } else {
      res.json({ payment_status: "unpaid" });
    }
  } catch (error) {
    console.error("Error verifying session:", error);
    res.status(500).json({ error: "Failed to verify payment session" });
  }
};

// Controller to get booking details
const getBookingDetails = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const booking = await Booking.findById(bookingId)
      .populate("service")
      .populate("provider")
      .populate("customer");

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, error: "Booking not found" });
    }

    const bookingDetails = {
      serviceName: booking.service.serviceName,
      providerName: booking.provider.name,
      date: booking.date,
      startTime: booking.startTime,
      paymentStatus: booking.paymentStatus, // Include payment status
    };

    res.json({ success: true, booking: bookingDetails });
  } catch (error) {
    console.error("Error fetching booking details:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch booking details" });
  }
};

// Controller to update booking status after payment success (may not be needed now)
const updateBookingStatus = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const booking = await Booking.findById(bookingId)
      .populate("service")
      .populate("provider")
      .populate("customer");

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, error: "Booking not found" });
    }

    // Update payment status to completed
    booking.paymentStatus = "completed";
    await booking.save();

    // Prepare booking details for email
    const bookingDetails = {
      serviceName: booking.service.serviceName,
      providerName: booking.provider.name,
      date: booking.date,
      startTime: booking.startTime,
    };

    // Send confirmation email to customer
    await sendConfirmationEmail(booking.customer.email, bookingDetails);

    // Schedule reminder email
    const appointmentTime = new Date(`${booking.date} ${booking.startTime}`);
    const reminderTime = new Date(appointmentTime.getTime() - 60 * 60 * 1000); // 1 hour before
    const timeUntilReminder = reminderTime - new Date();

    if (timeUntilReminder > 0) {
      setTimeout(async () => {
        await sendReminderEmail(booking.customer.email, bookingDetails);
      }, timeUntilReminder);
    }

    res.json({ success: true, booking: bookingDetails });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to update booking status" });
  }
};

// Controller to get customer bookings
const getCustomerBookings = async (req, res) => {
  const customerId = req.userId;

  try {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Optional: Set to midnight to compare dates only

    // Fetch upcoming bookings
    const upcomingBookings = await Booking.find({
      customer: customerId,
      date: { $gte: now },
      paymentStatus: { $ne: "canceled" },
    })
      .populate({
        path: "service",
        select: "serviceName duration",
      })
      .populate("provider", "name")
      .populate("businessOwner", "businessName")
      .lean();

    // Fetch past bookings
    const pastBookings = await Booking.find({
      customer: customerId,
      date: { $lt: now },
      paymentStatus: { $ne: "canceled" },
    })
      .populate({
        path: "service",
        select: "serviceName duration",
      })
      .populate("provider", "name")
      .populate("businessOwner", "businessName")
      .lean();

    res.json({ upcomingBookings, pastBookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Error fetching bookings." });
  }
};

// Controller to cancel a booking
const cancelBooking = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, error: "Booking not found" });
    }

    // Check if the booking is eligible for cancellation
    if (booking.paymentStatus === "completed") {
      return res
        .status(400)
        .json({ success: false, error: "Cannot cancel a completed booking" });
    }

    // Cancel the booking by updating status
    booking.paymentStatus = "canceled";
    await booking.save();

    res.json({ success: true, message: "Booking canceled successfully" });
  } catch (error) {
    console.error("Error canceling booking:", error);
    res.status(500).json({ success: false, error: "Failed to cancel booking" });
  }
};

// Controller to reschedule a booking
const rescheduleBooking = async (req, res) => {
  const { bookingId } = req.params;
  const { newDate, newStartTime } = req.body;

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, error: "Booking not found" });
    }

    // Fetch service duration
    await booking.populate("service", "duration");

    const serviceDuration = booking.service.duration;
    const startDateTime = new Date(`${newDate} ${newStartTime}`);
    const endDateTime = new Date(
      startDateTime.getTime() + serviceDuration * 60000
    );
    const formattedEndTime = endDateTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Check if the new time slot is available, excluding the current booking
    const existingBooking = await Booking.findOne({
      provider: booking.provider,
      date: newDate,
      startTime: { $lt: formattedEndTime },
      endTime: { $gt: newStartTime },
      _id: { $ne: bookingId }, // Exclude the current booking
      paymentStatus: { $ne: "canceled" }, // Exclude canceled bookings
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        error: "Selected time slot is not available for rescheduling",
      });
    }

    // Update booking details
    booking.date = newDate;
    booking.startTime = newStartTime;
    booking.endTime = formattedEndTime;
    await booking.save();

    res.json({ success: true, message: "Booking rescheduled successfully" });
  } catch (error) {
    console.error("Error rescheduling booking:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to reschedule booking" });
  }
};

module.exports = {
  getAvailableSlots,
  createBooking,
  handleStripeSuccess,
  handleStripeCancel,
  verifyPaymentSession,
  getBookingDetails,
  updateBookingStatus,
  getCustomerBookings,
  cancelBooking,
  rescheduleBooking,
};
