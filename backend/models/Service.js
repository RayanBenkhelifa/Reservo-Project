const mongoose = require('mongoose');

// Check if the Service model already exists before creating it
const serviceSchema = new mongoose.Schema({
    serviceName: { type: String, required: true },
    description: String,
    duration: { type: Number, required: true },
    price: { type: Number, required: true }
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
