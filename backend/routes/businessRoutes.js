const express = require("express");
const businessController = require("../controllers/businessController");
const router = express.Router();
const { verifyBusinessOwner } = require("../middleware/verifySession");
const multer = require("multer");

// Configure Multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit files to 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."));
    }
  },
});
// Route to add a service
router.post("/add-service", verifyBusinessOwner, businessController.addService);

// Route to add a provider
router.post(
  "/add-provider",
  verifyBusinessOwner,
  businessController.addProvider
);
router.get(
  "/providers",
  verifyBusinessOwner,
  businessController.getBusinessProviders
);

// Route to get business services
router.get(
  "/services",
  verifyBusinessOwner,
  businessController.getBusinessServices
);
router.put(
  "/edit-service",
  verifyBusinessOwner,
  businessController.editService
);

// Route to delete a service
router.delete(
  "/delete-service/:serviceId",
  verifyBusinessOwner,
  businessController.deleteService
);

router.put(
  "/edit-provider",
  verifyBusinessOwner,
  businessController.editProvider
);

// Route to delete a provider
router.delete(
  "/delete-provider/:providerId",
  verifyBusinessOwner,
  businessController.deleteProvider
);

// Route to get business dashboard
router.get(
  "/business-dashboard",
  verifyBusinessOwner,
  businessController.getBusinessOwnerDetails
);

// Route to get weekly stats
router.get(
  "/weekly-stats",
  verifyBusinessOwner,
  businessController.getWeeklyStats
);

// Route to get upcoming appointments ("Up Next")
router.get(
  "/up-next",
  verifyBusinessOwner,
  businessController.getUpNextAppointments
);

router.get(
  "/edit-profile",
  verifyBusinessOwner,
  businessController.getBusinessProfile
);

router.put(
  "/edit-profile",
  verifyBusinessOwner,
  businessController.editBusinessProfile
);

router.post(
  "/upload-image",
  verifyBusinessOwner,
  upload.single("image"),
  businessController.uploadBusinessImage
);
router.get(
  "/get-image-url",
  verifyBusinessOwner,
  businessController.getBusinessImageUrl
);

router.get("/image/:id", businessController.getBusinessImage);

module.exports = router;
