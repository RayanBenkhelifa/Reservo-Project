const mongoose = require('mongoose');

// Define the Provider schema (embedded in BusinessOwner)
const providerSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() }, // Generate a unique providerId
  name: { type: String, required: true },
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],  // Services offered by the provider
  availability: [
    {
      date: { type: Date, required: true },  // Available date for booking
      timeSlots: [String]  // Available time slots for that day (e.g., ["09:00 AM", "10:00 AM"])
    }
  ]
});

// Define the BusinessOwner schema
const businessOwnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNum: { type: String, required: true },
  password: { type: String, required: true },
  businessName: { type: String, required: true },
  location: { type: String, required: true },
  description: {type: String, required:true},
  category: { type: String, required: true },  // Category for the business (e.g., spa, salon)
  operatingHours: {
    start: { type: String, required: true },  // Business start time (e.g., "09:00 AM")
    end: { type: String, required: true }     // Business end time (e.g., "06:00 PM")
  },
  providers: [providerSchema],  // Array of providers working for the business
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }]  // Array of services offered by this business

});

module.exports = mongoose.model('BusinessOwner', businessOwnerSchema);

