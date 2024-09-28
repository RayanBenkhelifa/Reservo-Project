// routes/businessRoutes.js
const express = require('express');
const businessController = require('../controllers/businessController');
const router = express.Router();

// Route for adding a service
router.post('/add-service', businessController.addService);

// Route for adding a provider
router.post('/add-provider', businessController.addProvider);

module.exports = router;
