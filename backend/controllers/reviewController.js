const Review = require('../models/Review');

// Controller to create a new review
exports.createReview = async (req, res) => {
    try {
        const { businessRating, providerRating, comment, businessOwner, provider, booking } = req.body;

        if (!businessRating || !providerRating || !businessOwner || !provider || !booking) {
            return res.status(400).json({ error: 'All required fields must be provided' });
        }

        const newReview = await Review.create({
            businessRating,
            providerRating,
            comment,
            businessOwner,
            provider,
            booking,
            customer: req.user._id, // Assuming user authentication is implemented
        });

        res.status(201).json(newReview);
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ error: 'Failed to create review' });
    }
};

// Controller to get all reviews for a specific business
exports.getReviews = async (req, res) => {
    try {
        const businessId = req.params.businessId;
        const reviews = await Review.find({ businessOwner: businessId }).populate('customer', 'name');

        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
};

// Controller to calculate the average rating for a business
exports.getAverageRating = async (req, res) => {
    try {
        const businessId = req.params.businessId;

        // Fetch all reviews for the business
        const reviews = await Review.find({ businessOwner: businessId });

        if (reviews.length === 0) {
            return res.status(200).json({ averageRating: 0.0 }); // No reviews, return 0.0
        }

        // Calculate the average business rating
        const averageBusinessRating =
            reviews.reduce((sum, review) => sum + review.businessRating, 0) / reviews.length;

        res.status(200).json({ averageRating: averageBusinessRating });
    } catch (error) {
        console.error(`Error calculating average rating for business ${req.params.businessId}:`, error);
        res.status(500).json({ error: 'Failed to calculate average rating' });
    }
};

// Controller to delete a review
exports.deleteReview = async (req, res) => {
    try {
        const reviewId = req.params.reviewId;

        const review = await Review.findByIdAndDelete(reviewId);

        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ error: 'Failed to delete review' });
    }
};
