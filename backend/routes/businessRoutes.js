// routes/businessRoutes.js
const express = require('express');
const businessController = require('../controllers/businessController');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken')

// Route for adding a service
router.post('/add-service', verifyToken ,businessController.addService);

// Route for adding a provider
router.post('/add-provider', verifyToken ,businessController.addProvider);

router.get('/services', verifyToken, businessController.getBusinessServices);


router.get('/business-dashboard', verifyToken, (req, res) => {
    // Only accessible if the token is valid
    res.status(200).json({ message: `Welcome to the dashboard, Business Owner ID: ${req.userId}` });
  });

module.exports = router;
