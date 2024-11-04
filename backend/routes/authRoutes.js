const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const { verifySession } = require('../middleware/verifySession');


// Routes for customer and business owner signup/login
router.post('/signup/customer',authController.signupCustomer);
router.post('/signup/businessOwner', authController.signupBusinessOwner);

router.post('/login/customer', authController.customerLogin);  // Customer login route
router.post('/login/businessOwner', authController.businessOwnerLogin);  // Business owner login route

router.get('/check-auth', authController.checkAuth);
router.get('/profile', verifySession, authController.getProfile);
router.post('/logout', authController.logout);


module.exports = router;
