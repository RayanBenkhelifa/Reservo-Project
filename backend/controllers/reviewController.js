const Review = require('../models/Review');
const Customer = require('../models/Customer');
const Booking = require('../models/Booking');
const nodemailer = require('nodemailer');

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

// Controller to submit feedback to customer
const submitFeedback = async (req, res) => {
  const { reviewId, customerId, feedbackMessage } = req.body;

  try {
    // Find the review and customer
    const review = await Review.findById(reviewId);
    const customer = await Customer.findById(customerId);

    if (!review || !customer) {
      return res.status(404).json({ message: "Review or Customer not found" });
    }

    // Set up Nodemailer to send the feedback email
    const transporter = nodemailer.createTransport({
      service: 'SendGrid', // Use SendGrid's SMTP service
      auth: {
        user: process.env.EMAIL_USERNAME, // 'apikey' (this is your SendGrid username)
        pass: process.env.EMAIL_PASSWORD, // Your SendGrid API Key as password
      },
    });

    // Email content
    const mailOptions = {
      from: 'reservoreminder@hotmail.com', // Valid sender email address (sendgrid verified)
      to: customer.email,
      subject: 'Feedback from Business Owner',
      text: `Dear ${customer.name},\n\nYou have received the following feedback from the business owner:\n\n${feedbackMessage}\n\nBest regards,\nBusiness Owner`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    console.log("feedback email sent successfully");

    // Return success
    res.status(200).json({ message: "Feedback sent successfully" });
  } catch (error) {
    console.error("Error sending feedback:", error);
    res.status(500).json({ message: "Failed to send feedback" });
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

// Controller to fetch reviews for a specific business owner (the logged-in user)
const getBusinessReviews = async (req, res) => {
  try {
    // Fetch reviews and populate the customer field with only the 'name' field from the Customer model
    const reviews = await Review.find({ businessOwner: req.userId })
      .populate("customer", "name"); // Populate customer and include only the 'name' field

    if (reviews.length === 0) {
      return res.status(200).json({ reviews: [] });
    }

    res.status(200).json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

// Export all necessary functions
module.exports = {
  createReview,
  submitFeedback, // Export the new submitFeedback function
  getProviderReviews,
  getAverageRating,
  deleteReview,
  getBusinessReviews,
};
