// models/Service.js
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  serviceName: { type: String, required: true },
  description: String,  // Optional description
  duration: { type: Number, required: true },  // Duration in minutes
  price: { type: Number, required: true }      // Price of the service
});

module.exports = mongoose.model('Service', serviceSchema);
