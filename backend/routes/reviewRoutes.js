// routes/reviewRoutes.js
const express = require('express');
const reviewController = require('../controllers/reviewController');
const { verifySession } = require('../middleware/verifySession');

const router = express.Router();

// Route to create a new review (only accessible to the customer)
router.post('/create', verifySession, reviewController.createReview);

// Route to get all reviews for a provider
router.get('/provider/:providerId', reviewController.getProviderReviews);

module.exports = router;
