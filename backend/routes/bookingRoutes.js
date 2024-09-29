// routes/bookingRoutes.js
const express = require('express');
const bookingController = require('../controllers/bookingController');
const router = express.Router();

// Route to create a new booking
router.post('/create', bookingController.createBooking);

module.exports = router;
