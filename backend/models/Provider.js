const mongoose = require('mongoose');

// Define the Provider schema
const providerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],  // Services offered by the provider
  availability: [
    {
      date: { type: Date, required: true },  // Available date for booking
      timeSlots: [String]  // Available time slots for that day (e.g., ["09:00 AM", "10:00 AM"])
    }
  ]
});

module.exports = mongoose.model('Provider', providerSchema);
