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
  
      // Check if the booking has already been reviewed
      if (booking.isReviewed) {
        return res.status(400).json({ message: 'Review already submitted for this booking' });
      }
  
      const newReview = new Review({
        customer: customerId,
        businessOwner: booking.businessOwner._id,
        provider: booking.provider._id,
        booking: bookingId,
        businessRating,
        providerRating,
        comment,
      });
  
      await newReview.save();
  
      // Mark the booking as reviewed
      booking.isReviewed = true;
      await booking.save();
  
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

// Controller to calculate the average rating for a business
const getAverageRating = async (req, res) => {
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
const deleteReview = async (req, res) => {
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

// reviewController.js
const getBusinessReviews = async (req, res) => {
    try {
      console.log("Fetching reviews for Business Owner ID:", req.userId); // Debug log
      const reviews = await Review.find({ businessOwner: req.userId });
  
      if (reviews.length === 0) {
        console.log("No reviews found for this business owner.");
        return res.status(200).json({ reviews: [] });
      }
  
      console.log("Reviews fetched successfully:", reviews); // Debug log
      res.status(200).json({ reviews });
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  };
      

// Export all necessary functions
module.exports = { createReview, getProviderReviews, getAverageRating, deleteReview, getBusinessReviews};
