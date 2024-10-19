// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Route to create Stripe checkout session
router.post('/create-checkout-session', paymentController.createCheckoutSession);

module.exports = router;
