// controllers/businessController.js
const Service = require('../models/Service');
const BusinessOwner = require('../models/BusinessOwner');

// Add Service to Business
const addService = async (req, res) => {
  try {
    const { serviceName, description, duration, price } = req.body;
    const businessId = req.userId; // Extracted from the verified token (businessId)


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
    const { providerName, serviceIds } = req.body;
    const businessId = req.userId
    // Find the business
    const business = await BusinessOwner.findById(businessId).populate('services');
    console.log(business)
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    // Ensure the services being added are owned by the business
    const validServiceIds = serviceIds.filter(serviceId => {
      // Use .some() to check if the serviceId exists in business.services
      const serviceExists = business.services.some(service => service._id.toString() === serviceId.toString());
    
      // Debugging output
      // console.log(business.services);
      // console.log(serviceId);
    
      return serviceExists; // Only keep serviceIds that exist in business.services
    });


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
    console.log(availability)
    // Create the provider object
    const newProvider = {
      name: providerName,
      services: serviceIds,  // Array of service IDs linked to the provider
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

const getBusinessServices = async (req, res) => {
  try {
    const businessId = req.userId; // Extracted from the JWT token
    console.log(businessId)
    const business = await BusinessOwner.findById(businessId).populate('services');
    console.log(business)

    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    res.status(200).json({ services: business.services });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch services' });
  }
};

const getDashboard = async (req,res) => {
  try {
    const businessId = req.userId
    console.log(businessId)
    const businessOwner = await BusinessOwner.findById(businessId);
    if (!businessOwner) {
      return res.status(404).json({ message: 'Business Owner not found' });
    }

    // Send back the business owner's name and other data
    res.status(200).json({
      name: businessOwner.name,
      message: `Welcome to the dashboard, ${businessOwner.name}`,
    });
  } catch (error) {
    console.error('Error in business-dashboard route:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
}
// Function to generate time slots between start and end times (assumes 1-hour intervals)
const generateTimeSlots = (start, end) => {
  const slots = [];
  
  // Convert start and end times to Date objects to handle hours and minutes
  const startTime = new Date(`1970-01-01T${convertTo24Hour(start)}:00`);
  const endTime = new Date(`1970-01-01T${convertTo24Hour(end)}:00`);
  
  let currentTime = startTime;
  
  // Loop through and add 1-hour intervals to the timeSlots array until the end time is reached
  while (currentTime < endTime) {
    slots.push(currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    currentTime = new Date(currentTime.getTime() + 60 * 60 * 1000); // Add 1 hour
  }

  return slots;
};

// Helper function to convert 12-hour format (e.g., "9:00 AM") to 24-hour format
const convertTo24Hour = (time) => {
  const [hour, minute, period] = time.match(/(\d+):(\d+)\s*(AM|PM)/i).slice(1);
  let hours = parseInt(hour, 10);
  const minutes = parseInt(minute, 10);
  
  if (period.toUpperCase() === 'PM' && hours < 12) {
    hours += 12;
  }
  if (period.toUpperCase() === 'AM' && hours === 12) {
    hours = 0;
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

module.exports = {addService, addProvider, getBusinessServices, getDashboard}