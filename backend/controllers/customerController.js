const BusinessOwner = require('../models/BusinessOwner');

// View All Businesses
const getAllBusinesses = async (req, res) => {
  try {
    const businesses = await BusinessOwner.find();
    res.status(200).json(businesses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch businesses' });
  }
};

// View Services for a Selected Business
const getBusinessServices = async (req, res) => {
  try {
    const { businessId } = req.params;
    const business = await BusinessOwner.findById(businessId).populate('providers.services');
    
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }
    
    const services = new Set();
    business.providers.forEach(provider => {
      provider.services.forEach(service => services.add(service));
    });

    res.status(200).json([...services]);  // Convert Set to Array
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
};

// View Providers for a Selected Service
const getServiceProviders = async (req, res) => {
  try {
    const { businessId, serviceId } = req.params;
    const business = await BusinessOwner.findById(businessId).populate('providers.services');
    
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    const providers = business.providers.filter(provider =>
      provider.services.some(service => service._id.toString() === serviceId)
    );

    if (providers.length === 0) {
      return res.status(404).json({ error: 'No providers found for this service' });
    }

    res.status(200).json(providers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch providers' });
  }
};

module.exports = {getAllBusinesses, getBusinessServices, getServiceProviders}