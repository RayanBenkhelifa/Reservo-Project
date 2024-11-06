// controllers/reviewController.js
const Review = require('../models/Review');
const Booking = require('../models/Booking');

// Controller to create a review after the booking time has passed
const createReview = async (req, res) => {
    const { businessRating, providerRating, comment, bookingId } = req.body;
    const customerId = req.userId;

    try {
        const booking = await Booking.findById(bookingId).populate('provider businessOwner');

        // Ensure booking exists and that it has ended
        if (!booking || booking.date > new Date()) {
            return res.status(400).json({ message: 'Booking does not exist or has not yet completed' });
        }

        // Check if a review already exists for this booking
        const existingReview = await Review.findOne({ booking: bookingId });
        if (existingReview) {
            return res.status(400).json({ message: 'Review already submitted for this booking' });
        }

        const newReview = new Review({
            customer: customerId,
            businessOwner: booking.businessOwner._id,
            provider: booking.provider._id,
            booking: bookingId,
            businessRating,
            providerRating,
            comment
        });

        await newReview.save();
        res.status(201).json({ message: 'Review submitted successfully', review: newReview });
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ error: 'Failed to submit review' });
    }
};

// Controller to fetch reviews for a specific provider
const getProviderReviews = async (req, res) => {
    const { providerId } = req.params;

    try {
        const reviews = await Review.find({ provider: providerId }).populate('customer');
        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching provider reviews:', error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
};

module.exports = { createReview, getProviderReviews };
