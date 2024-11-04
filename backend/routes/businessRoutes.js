const express = require('express');
const businessController = require('../controllers/businessController');
const router = express.Router();
const { verifyBusinessOwner } = require('../middleware/verifySession');

// Route for adding a service
router.post('/add-service', verifyBusinessOwner, businessController.addService);

// Route for adding a provider
router.post('/add-provider', verifyBusinessOwner, businessController.addProvider);

// Route to get services for a business
router.get('/services', verifyBusinessOwner, businessController.getBusinessServices);

// Route to get business dashboard data
router.get('/business-dashboard', verifyBusinessOwner, businessController.getDashboard);

// Route to get upcoming appointments ("Up Next")
router.get('/up-next', verifyBusinessOwner, businessController.getUpNextAppointments); // New route

module.exports = router;
