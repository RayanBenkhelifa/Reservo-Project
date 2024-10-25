const mongoose = require('mongoose');

// Check if the Customer model already exists before creating it
const CustomerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNum: { type: String, required: true },
    password: { type: String, required: true }
}, { timestamps: true });

const Customer = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);

module.exports = Customer;
