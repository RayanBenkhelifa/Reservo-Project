// controllers/businessController.js
const Service = require('../models/Service');
const BusinessOwner = require('../models/BusinessOwner');

// Add Service to Business
const addService = async (req, res) => {
    console.log("hey")
  try {
    const { serviceName, description, duration, price } = req.body;

    const newService = new Service({
      serviceName,
      description,
      duration,
      price
    });

    await newService.save();
    res.status(201).json({ message: 'Service added successfully', service: newService });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add service' });
  }
};

// Add Provider and Link Services
const addProvider = async (req, res) => {
  try {
    const { businessId, providerName, serviceIds } = req.body;

    const business = await BusinessOwner.findById(businessId);
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    const newProvider = {
      name: providerName,
      services: serviceIds  // Array of service IDs linked to the provider
    };

    business.providers.push(newProvider);
    await business.save();

    res.status(201).json({ message: 'Provider added successfully', business });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add provider' });
  }
};

module.exports = {addService, addProvider}