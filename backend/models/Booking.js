const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  businessOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'BusinessOwner', required: true }, // Link the booking to the business
  date: { type: Date, required: true },
  startTime: { type: String, required: true },  // Time slot selected by the customer
  endTime: { type: String, required: true },    // End time based on service duration
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'completed', 'failed'], 
    default: 'pending' 
  },  // Track the payment status of the booking
  stripeSessionId: { type: String },  // Store the Stripe session ID for tracking payments
});

module.exports = mongoose.model('Booking', bookingSchema);
