const BusinessOwner = require('../models/BusinessOwner'); // Assuming this is the business model
const Provider = require('../models/Provider'); // Assuming you have a Provider model

// Controller to fetch all businesses
const getAllBusinesses = async (req, res) => {
  try {
    const businesses = await BusinessOwner.find(); // Fetch all businesses
    res.status(200).json(businesses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch businesses' });
  }
};

// Controller to fetch services of a specific business
const getBusinessServices = async (req, res) => {
  try {
    const { businessId } = req.params;

    // Fetch the business and populate its services
    const business = await BusinessOwner.findById(businessId).populate('services');

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    res.status(200).json(business.services);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
};

// Controller to fetch providers for a specific service within a business
const getServiceProviders = async (req, res) => {
  try {
    const { businessId, serviceId } = req.params;

    // Fetch the business and filter the providers based on the serviceId
    const business = await BusinessOwner.findById(businessId).populate({
      path: 'providers',
      match: { services: serviceId }, // Match providers offering the serviceId
      populate: { path: 'services' }  // Populate the services inside the provider
    });

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    // Return the providers offering the specified service
    const providers = business.providers;

    if (providers.length === 0) {
      return res.status(404).json({ error: 'No providers found for this service' });
    }

    res.status(200).json(providers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch providers' });
  }
};

module.exports = { getAllBusinesses, getBusinessServices, getServiceProviders };
