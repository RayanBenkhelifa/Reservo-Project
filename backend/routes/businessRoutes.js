const express = require('express');
const businessController = require('../controllers/businessController');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

// Route for adding a service
router.post('/add-service', verifyToken, businessController.addService);

// Route for adding a provider
router.post('/add-provider', verifyToken, businessController.addProvider);

// Route to get services for a business
router.get('/services', verifyToken, businessController.getBusinessServices);

// Route to get business dashboard data
router.get('/business-dashboard', verifyToken, businessController.getDashboard);

// Route to get upcoming appointments ("Up Next")
router.get('/up-next', verifyToken, businessController.getUpNextAppointments); // New route

module.exports = router;
