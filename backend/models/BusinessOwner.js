const mongoose = require('mongoose');

// Check if the BusinessOwner model already exists before creating it
const businessOwnerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNum: { type: String, required: true },
    password: { type: String, required: true },
    businessName: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    operatingHours: {
        start: { type: String, required: true },
        end: { type: String, required: true }
    },
    providers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Provider' }],
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    imageData: {
        type: String, // Base64 encoded string
        default: '',  // Default to an empty string if no image is uploaded
      },
      imageMimeType: {
        type: String, // MIME type of the image
        default: '',  // Default to an empty string if no image is uploaded
      },
});

const BusinessOwner = mongoose.models.BusinessOwner || mongoose.model('BusinessOwner', businessOwnerSchema);

module.exports = BusinessOwner;
