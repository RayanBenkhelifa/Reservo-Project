const Review = require('../models/Review');
const Business = require('../models/BusinessOwner');

// Controller to create a new review
exports.createReview = async (req, res) => {
    try {
        const { rating, comment, business } = req.body;

        if (!rating || !business) {
            return res.status(400).json({ error: 'Rating and business ID are required' });
        }

        const newReview = await Review.create({
            rating,
            comment,
            business,
            user: req.user._id, // Assuming you have user authentication
        });

        res.status(201).json(newReview);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create review' });
    }
};

// Controller to get all reviews for a specific business
exports.getReviews = async (req, res) => {
    try {
        const businessId = req.params.businessId;
        const reviews = await Review.find({ business: businessId }).populate('user', 'name');

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
};

// Controller to calculate the average rating for a business
exports.getAverageRating = async (req, res) => {
    try {
        const businessId = req.params.businessId;

        // Fetch all reviews for the business
        const reviews = await Review.find({ business: businessId });
        console.log(`Reviews for business ${businessId}:`, reviews); // Debugging log

        if (reviews.length === 0) {
            console.log(`No reviews found for business ${businessId}`); // Debugging log
            return res.status(200).json({ averageRating: 0 }); // No reviews, return 0
        }

        // Calculate the average rating
        const averageRating =
            reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

        console.log(`Average rating for business ${businessId}:`, averageRating); // Debugging log

        res.status(200).json({ averageRating });
    } catch (error) {
        console.error(`Error calculating average rating for business ${req.params.businessId}:`, error); // Debugging log
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
        res.status(500).json({ error: 'Failed to delete review' });
    }
};
