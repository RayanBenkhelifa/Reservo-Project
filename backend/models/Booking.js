const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    businessOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'BusinessOwner', required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed','unpaid','canceled'],
        default: 'pending'
    },
    stripeSessionId: { type: String },
    isReviewed: {
        type: Boolean,
        default: false,
      },
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
