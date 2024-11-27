const express = require('express');
const {
    createReview,
    getProviderReviews, // Ensure this matches the function name in the controller
    getAverageRating,
    deleteReview,
    getBusinessReviews,
    submitFeedback
} = require('../controllers/reviewController');
const { verifySession } = require('../middleware/verifySession');

const router = express.Router();

// Route to create a new review (only accessible to the customer)
router.post('/create', verifySession, createReview);

// Route to get all reviews for a specific provider
router.get('/provider/:providerId', getProviderReviews);

// Route to get the average rating for a specific business
router.get('/average/:businessId', getAverageRating);

// Route to delete a specific review
router.delete('/:reviewId', deleteReview);

router.get("/business-reviews", verifySession, getBusinessReviews); // Route to fetch reviews

// Route to submit feedback to the customer
router.post("/submit-feedback", verifySession, submitFeedback); // New route for feedback submission

module.exports = router;
