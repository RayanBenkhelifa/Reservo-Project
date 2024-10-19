const BusinessOwner = require('../models/BusinessOwner'); // Assuming this is the business model
const Provider = require('../models/Provider'); 
const Service = require('../models/Service');

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

    // Log the businessId and serviceId to ensure they are being passed correctly
    console.log("Business ID received:", businessId);
    console.log("Service ID received:", serviceId);

    // Find the business and filter the providers based on the serviceId
    const business = await BusinessOwner.findById(businessId).populate({
      path: 'providers',
      match: { services: serviceId }, // Match providers offering the serviceId
      populate: { path: 'services' }  // Populate the services inside the provider
    });

    // Log the fetched business or if no business was found
    console.log("Business fetched:", business);

    if (!business) {
      console.log("Business not found for ID:", businessId);
      return res.status(404).json({ error: 'Business not found' });
    }

    // Log the providers or if no providers were found
    const providers = business.providers;
    console.log("Providers found:", providers);

    if (providers.length === 0) {
      console.log("No providers found for serviceId:", serviceId);
      return res.status(404).json({ error: 'No providers found for this service' });
    }

    res.status(200).json(providers);
  } catch (error) {
    console.error('Error fetching providers:', error);
    return res.status(500).json({ error: 'Failed to fetch providers' });
  }
};


const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.serviceId);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch service" });
  }
};
const getProviderById = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.providerId);
    if (!provider) {
      return res.status(404).json({ error: "Provider not found" });
    }
    res.status(200).json(provider);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch provider" });
  }
};

const getBusinessById = async (req, res) => {
  try {
    const { businessId } = req.params;
    const business = await BusinessOwner.findById(businessId);  // Fetch business by ID

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    res.status(200).json(business);  // Return the business details
  } catch (error) {
    console.error('Error fetching business:', error);
    res.status(500).json({ error: 'Failed to fetch business details' });
  }
};


module.exports = { getAllBusinesses, getBusinessServices, getServiceProviders,getServiceById,getBusinessById,getProviderById  };
