const mongoose = require('mongoose');

// Check if the Provider model already exists before creating it
const providerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    availability: [
        {
            date: { type: Date, required: true },
            timeSlots: [String]
        }
    ]
});

const Provider = mongoose.models.Provider || mongoose.model('Provider', providerSchema);

module.exports = Provider;
