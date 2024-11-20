// routes/bookingRoutes.js
const express = require("express");
const bookingController = require("../controllers/bookingController");
const { verifySession } = require("../middleware/verifySession");

const router = express.Router();

// Public Routes (No Authentication Required)
router.post("/available-slots", bookingController.getAvailableSlots);
router.get("/verify-session", bookingController.verifyPaymentSession);
router.get("/details/:bookingId", bookingController.getBookingDetails);

// Route to handle Stripe payment success
router.get("/success", bookingController.handleStripeSuccess);
// routes/bookingRoutes.js
router.get("/cancel", bookingController.handleStripeCancel);

// Protected Routes (Require Authentication)
router.post("/create", verifySession, bookingController.createBooking);
router.get(
  "/customer-bookings",
  verifySession,
  bookingController.getCustomerBookings
);
router.post(
  "/update-status/:bookingId",
  verifySession,
  bookingController.updateBookingStatus
);
router.post(
  "/cancel/:bookingId",
  verifySession,
  bookingController.cancelBooking
);
router.post(
  "/reschedule/:bookingId",
  verifySession,
  bookingController.rescheduleBooking
);

module.exports = router;
