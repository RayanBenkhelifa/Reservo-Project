// bookingRoutes.js

const express = require('express');
const bookingController = require('../controllers/bookingController');
const { verifySession } = require('../middleware/verifySession');

const router = express.Router();

// Route to create a new booking
router.post('/create', verifySession ,bookingController.createBooking);

// Route to get available slots
router.post('/available-slots', bookingController.getAvailableSlots);

// Route to update booking status after payment
router.post('/update-status/:bookingId', bookingController.updateBookingStatus);

// Route to verify Stripe payment session
router.get('/verify-session', bookingController.verifyPaymentSession );

// Route to get booking details
router.get('/details/:bookingId', bookingController.getBookingDetails);

module.exports = router;
