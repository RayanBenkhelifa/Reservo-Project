// controllers/businessController.js
const Service = require('../models/Service');
const BusinessOwner = require('../models/BusinessOwner');

// Add Service to Business
const addService = async (req, res) => {
  try {
    const { businessId, serviceName, description, duration, price } = req.body;

    // Find the business
    const business = await BusinessOwner.findById(businessId);
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    // Create a new service
    const newService = new Service({
      serviceName,
      description,
      duration,
      price
    });

    // Save the service to the Service collection
    await newService.save();

    // Attach the service to the business
    business.services.push(newService._id);

    // Save the updated business
    await business.save();

    res.status(201).json({ message: 'Service added successfully', service: newService });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add service' });
  }
};
// Add Provider and Link Services
const addProvider = async (req, res) => {
  try {
    const { businessId, providerName, serviceIds } = req.body;

    // Find the business
    const business = await BusinessOwner.findById(businessId).populate('services');
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    // Ensure the services being added are owned by the business
    const validServiceIds = serviceIds.filter(serviceId =>
      business.services.includes(serviceId)
    );

    if (validServiceIds.length !== serviceIds.length) {
      return res.status(400).json({ error: 'Some services are not part of this business' });
    }

    // Generate availability for the next 7 days based on business hours
    const availability = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(); // Get the current date
      date.setDate(date.getDate() + i); // Increment by i days

      const timeSlots = generateTimeSlots(business.operatingHours.start, business.operatingHours.end);
      availability.push({
        date: date.toISOString().split('T')[0], // Save only the date part
        timeSlots
      });
    }

    // Create the provider object
    const newProvider = {
      name: providerName,
      services: validServiceIds,  // Only add valid service IDs linked to the provider
      availability  // Generated availability for the next 7 days
    };

    // Push provider to business's providers array
    business.providers.push(newProvider);

    // Save the updated business
    await business.save();

    res.status(201).json({ message: 'Provider added successfully', business });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add provider' });
  }
};



module.exports = {addService, addProvider}