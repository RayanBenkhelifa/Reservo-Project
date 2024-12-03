const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    businessOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'BusinessOwner', required: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    businessRating: { type: Number, required: true, min: 1, max: 5 }, // Rating for the BusinessOwner
    providerRating: { type: Number, required: true, min: 1, max: 5 }, // Rating for the Provider
    comment: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

module.exports = Review;