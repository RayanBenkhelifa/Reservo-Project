const Service = require('../models/Service');
const BusinessOwner = require('../models/BusinessOwner');
const Provider = require('../models/Provider');  // New Provider model
const Booking = require('../models/Booking'); // Assuming Booking is where appointments are stored

// Add Service to Business
const addService = async (req, res) => {
  try {
    const { serviceName, description, duration, price } = req.body;
    const businessId = req.userId; // Extracted from the verified token (businessId)

    // Check if required fields are provided
    if (!serviceName || !duration || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

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
    console.error('Error adding service:', error);
    res.status(500).json({ error: 'Failed to add service' });
  }
};

// Add Provider and Link Services
const addProvider = async (req, res) => {
  try {
    const { providerName, serviceIds } = req.body;
    const businessId = req.userId;

    // Check if required fields are provided
    if (!providerName || !serviceIds || serviceIds.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Find the business
    const business = await BusinessOwner.findById(businessId).populate('services');
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    // Ensure the services being added are owned by the business
    const validServiceIds = serviceIds.filter(serviceId => {
      const serviceExists = business.services.some(service => service._id.toString() === serviceId.toString());
      return serviceExists;
    });

    if (validServiceIds.length !== serviceIds.length) {
      return res.status(400).json({ error: 'Some services are not part of this business' });
    }

    // Generate availability for the next 7 days based on business hours
    const availability = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const timeSlots = generateTimeSlots(business.operatingHours.start, business.operatingHours.end);
      availability.push({
        date: date.toISOString().split('T')[0], // Save only the date part
        timeSlots
      });
    }

    // Create the provider object
    const newProvider = new Provider({
      name: providerName,
      services: validServiceIds,
      availability  // Generated availability for the next 7 days
    });

    // Save the provider to the Provider collection
    await newProvider.save();

    // Add provider to business's provider list (by reference)
    business.providers.push(newProvider._id);

    // Save the updated business
    await business.save();

    res.status(201).json({ message: 'Provider added successfully', provider: newProvider });
  } catch (error) {
    console.error('Error adding provider:', error);
    res.status(500).json({ error: 'Failed to add provider' });
  }
};

// Get Business Services
const getBusinessServices = async (req, res) => {
  try {
    const businessId = req.userId;

    // Find the business by ID and populate its services
    const business = await BusinessOwner.findById(businessId).populate('services');
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    res.status(200).json({ services: business.services });
  } catch (error) {
    console.error('Error fetching business services:', error);
    res.status(500).json({ message: 'Failed to fetch services' });
  }
};

// Get Dashboard Data for Business Owner
const getDashboard = async (req, res) => {
  try {
    const businessId = req.userId;

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
    console.error('Error in getDashboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to generate time slots between start and end times (assumes 1-hour intervals)
const generateTimeSlots = (start, end) => {
  const slots = [];
  const startTime = new Date(`1970-01-01T${convertTo24Hour(start)}:00`);
  const endTime = new Date(`1970-01-01T${convertTo24Hour(end)}:00`);

  let currentTime = startTime;
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
const getUpNextAppointments = async (req, res) => {
  try {
    const businessId = req.userId;  // The logged-in business owner's ID
    console.log('Business ID from token:', businessId);

    // Fetch all providers for this business owner
    const businessOwner = await BusinessOwner.findById(businessId).populate('providers');
    console.log('Business owner found:', businessOwner);

    if (!businessOwner) {
      return res.status(404).json({ error: 'Business owner not found' });
    }

    const providerIds = businessOwner.providers.map(provider => provider._id);
    console.log('Provider IDs:', providerIds);

    // Find all bookings involving those providers
    const upcomingAppointments = await Booking.find({ provider: { $in: providerIds } })
      .populate('customer provider service')
      .sort({ date: 1 });

    console.log('Appointments found:', upcomingAppointments);

    // Map the bookings into a suitable format, with null checks
    const appointmentsData = upcomingAppointments.map((booking) => ({
      _id: booking._id,
      customerName: booking.customer ? booking.customer.name : "Unknown Customer",
      providerName: booking.provider ? booking.provider.name : "Unknown Provider",
      serviceName: booking.service ? booking.service.serviceName : "Unknown Service",
      date: booking.date.toISOString().split('T')[0], // Format the date
      startTime: booking.startTime,
      endTime: booking.endTime,
      duration: booking.service ? booking.service.duration : "Unknown Duration",
      price: booking.service ? booking.service.price : "Unknown Price",
    }));

    res.status(200).json(appointmentsData);
  } catch (error) {
    console.error('Error fetching upcoming appointments:', error);
    res.status(500).json({ error: 'Failed to fetch upcoming appointments' });
  }
};

module.exports = { addService, addProvider, getBusinessServices, getDashboard, getUpNextAppointments };
