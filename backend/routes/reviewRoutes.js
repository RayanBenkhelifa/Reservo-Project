const express = require('express');
const {
    createReview,
    getReviews,
    getAverageRating,
    deleteReview
} = require('../controllers/reviewController');

const router = express.Router();

// Route to create a new review
router.post('/', createReview);

// Route to get all reviews for a specific business
router.get('/:businessId', getReviews);

// Route to get the average rating for a specific business
router.get('/average/:businessId', getAverageRating);

// Route to delete a specific review
router.delete('/:reviewId', deleteReview);

module.exports = router;
