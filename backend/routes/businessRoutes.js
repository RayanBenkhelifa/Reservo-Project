const express = require("express");
const businessController = require("../controllers/businessController");
const router = express.Router();
const { verifyBusinessOwner } = require("../middleware/verifySession");

// Route to add a service
router.post("/add-service", verifyBusinessOwner, businessController.addService);

// Route to add a provider
router.post("/add-provider", verifyBusinessOwner, businessController.addProvider);

// Route to get business services
router.get("/services", verifyBusinessOwner, businessController.getBusinessServices);

// Route to get business dashboard
router.get("/business-dashboard", verifyBusinessOwner, businessController.getDashboard);

// Route to get weekly stats
router.get("/weekly-stats", verifyBusinessOwner, businessController.getWeeklyStats);

// Route to get upcoming appointments ("Up Next")
router.get('/up-next', verifyBusinessOwner, businessController.getUpNextAppointments); 

module.exports = router;
