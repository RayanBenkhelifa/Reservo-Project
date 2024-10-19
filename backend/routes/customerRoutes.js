const express = require('express');
const customerController = require('../controllers/customerController');
const router = express.Router();

// Route to get all businesses
router.get('/businesses', customerController.getAllBusinesses);

router.get('/businesses/:businessId', customerController.getBusinessById);


// Route to get services of a specific business
router.get('/businesses/:businessId/services', customerController.getBusinessServices);

// Route to get providers of a specific service within a business
router.get('/businesses/:businessId/services/:serviceId/providers', customerController.getServiceProviders);

router.get('/services/:serviceId', customerController.getServiceById);
router.get('/providers/:providerId', customerController.getProviderById);


module.exports = router;
