const mongoose = require('mongoose');

// Define the BusinessOwner schema
const businessOwnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNum: { type: String, required: true },
  password: { type: String, required: true },
  businessName: { type: String, required: true },
  operatingHours: {  // New field for operating hours
    start: { type: String, required: true },  // Example: "09:00 AM"
    end: { type: String, required: true }  // Example: "06:00 PM"
  },
  providers: [  // Array of providers working for this business
    {
      _id: mongoose.Schema.Types.ObjectId,
      name: { type: String, required: true },
      services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
      availability: [
        {
          date: Date,
          timeSlots: [String]
        }
      ]
    }
  ]
});

module.exports = mongoose.model('BusinessOwner', businessOwnerSchema);
