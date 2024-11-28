const Service = require("../models/Service");
const BusinessOwner = require("../models/BusinessOwner");
const Provider = require("../models/Provider");
const Booking = require("../models/Booking");

// Add Service to Business
const addService = async (req, res) => {
  try {
    const { serviceName, description, duration, price } = req.body;
    const businessId = req.userId;

    if (!serviceName || !duration || !price) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const business = await BusinessOwner.findById(businessId);
    if (!business) {
      return res.status(404).json({ error: "Business not found" });
    }

    const newService = new Service({
      serviceName,
      description,
      duration,
      price,
    });

    await newService.save();
    business.services.push(newService._id);
    await business.save();

    res
      .status(201)
      .json({ message: "Service added successfully", service: newService });
  } catch (error) {
    console.error("Error adding service:", error);
    res.status(500).json({ error: "Failed to add service" });
  }
};

// Add Provider and Link Services
const addProvider = async (req, res) => {
  try {
    const { providerName, serviceIds } = req.body;
    const businessId = req.userId;

    if (!providerName || !serviceIds || serviceIds.length === 0) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const business = await BusinessOwner.findById(businessId).populate(
      "services"
    );
    if (!business) {
      return res.status(404).json({ error: "Business not found" });
    }

    const validServiceIds = serviceIds.filter((serviceId) => {
      return business.services.some(
        (service) => service._id.toString() === serviceId.toString()
      );
    });

    if (validServiceIds.length !== serviceIds.length) {
      return res
        .status(400)
        .json({ error: "Some services are not part of this business" });
    }

    const newProvider = new Provider({
      name: providerName,
      services: validServiceIds,
    });

    await newProvider.save();
    business.providers.push(newProvider._id);
    await business.save();

    res
      .status(201)
      .json({ message: "Provider added successfully", provider: newProvider });
  } catch (error) {
    console.error("Error adding provider:", error);
    res.status(500).json({ error: "Failed to add provider" });
  }
};

// Get Business Services
const getBusinessServices = async (req, res) => {
  try {
    const businessId = req.userId;
    const business = await BusinessOwner.findById(businessId).populate(
      "services"
    );
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }
    res.status(200).json({ services: business.services });
  } catch (error) {
    console.error("Error fetching business services:", error);
    res.status(500).json({ message: "Failed to fetch services" });
  }
};

// Get Dashboard Data for Business Owner
const getDashboard = async (req, res) => {
  try {
    const businessId = req.userId;
    const businessOwner = await BusinessOwner.findById(businessId);
    if (!businessOwner) {
      return res.status(404).json({ message: "Business Owner not found" });
    }

    res.status(200).json({
      name: businessOwner.name,
      message: `Welcome to the dashboard, ${businessOwner.name}`,
    });
  } catch (error) {
    console.error("Error in getDashboard:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Weekly Stats for Dashboard
// Example of a backend controller to fetch weekly stats
const getWeeklyStats = async (req, res) => {
  try {
    const businessId = req.userId;

    const today = new Date();
    const currentWeekStart = new Date(today);
    currentWeekStart.setDate(today.getDate() - today.getDay()); // Sunday
    currentWeekStart.setHours(0, 0, 0, 0);

    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekStart.getDate() + 6); // Saturday
    currentWeekEnd.setHours(23, 59, 59, 999);

    // Find all bookings for the current week
    const currentWeekBookings = await Booking.find({
      businessOwner: businessId,
      date: { $gte: currentWeekStart, $lt: currentWeekEnd },
    }).populate("service");

    // Calculate total revenue and total appointments
    const totalAppointmentsCurrentWeek = currentWeekBookings.length;
    const totalRevenueCurrentWeek = currentWeekBookings.reduce(
      (sum, booking) => sum + (booking.service?.price || 0),
      0
    );

    // Calculate number of reservations per service
    const serviceReservations = currentWeekBookings.reduce((acc, booking) => {
      const serviceName = booking.service.serviceName;
      if (acc[serviceName]) {
        acc[serviceName] += 1;
      } else {
        acc[serviceName] = 1;
      }
      return acc;
    }, {});

    // Return the data for pie chart (only data, not the JSX)
    const pieChartData = Object.entries(serviceReservations).map(([serviceName, count]) => ({
      label: serviceName,
      value: count,
    }));

    res.status(200).json({
      totalAppointments: totalAppointmentsCurrentWeek,
      totalRevenue: totalRevenueCurrentWeek,
      pieChartData, // Send the pie chart data as a response
    });
  } catch (error) {
    console.error("Error in getWeeklyStats:", error);
    res.status(500).json({ error: "Failed to fetch weekly stats" });
  }
};


// Get Upcoming Appointments
const getUpNextAppointments = async (req, res) => {
  try {
    const businessId = req.userId; // The logged-in business owner's ID
    console.log("Business ID from token:", businessId);

    // Fetch the business owner and populate providers
    const businessOwner = await BusinessOwner.findById(businessId).populate(
      "providers"
    );
    console.log("Business owner found:", businessOwner);

    if (!businessOwner) {
      return res.status(404).json({ error: "Business owner not found" });
    }

    const providerIds = businessOwner.providers.map((provider) => provider._id);
    console.log("Provider IDs:", providerIds);

    // Find all upcoming bookings involving those providers
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    const upcomingAppointments = await Booking.find({
      provider: { $in: providerIds },
      date: { $gte: today }, // Only include appointments from today onwards
    })
      .populate("customer provider service")
      .sort({ date: 1, startTime: 1 });

    console.log("Appointments found:", upcomingAppointments);

    // Map the bookings into a suitable format, including paymentStatus
    const appointmentsData = upcomingAppointments.map((booking) => ({
      _id: booking._id,
      customerName: booking.customer
        ? booking.customer.name
        : "Unknown Customer",
      providerName: booking.provider
        ? booking.provider.name
        : "Unknown Provider",
      serviceName: booking.service
        ? booking.service.serviceName
        : "Unknown Service",
      date: booking.date.toISOString().split("T")[0], // Format the date
      startTime: booking.startTime,
      endTime: booking.endTime,
      duration: booking.service ? booking.service.duration : "Unknown Duration",
      price: booking.service ? booking.service.price : "Unknown Price",
      paymentStatus: booking.paymentStatus || "Unknown", // Include paymentStatus
    }));

    res.status(200).json(appointmentsData);
  } catch (error) {
    console.error("Error fetching upcoming appointments:", error);
    res.status(500).json({ error: "Failed to fetch upcoming appointments" });
  }
};

const uploadBusinessImage = async (req, res) => {
  try {
    const businessOwnerId = req.userId; // Ensure the user is authenticated

    if (!businessOwnerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const businessOwner = await BusinessOwner.findById(businessOwnerId);
    if (!businessOwner) {
      return res.status(404).json({ message: "Business owner not found" });
    }

    // Check if a file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Convert the image to a Base64 string
    const imageData = req.file.buffer.toString("base64");

    // Store the MIME type
    const mimeType = req.file.mimetype;

    // Update the business owner's imageData and mimeType
    businessOwner.imageData = imageData;
    businessOwner.imageMimeType = mimeType;
    await businessOwner.save();

    res.status(200).json({
      message: "Image uploaded successfully",
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Business Image
const getBusinessImage = async (req, res) => {
  try {
    const businessOwnerId = req.params.id;

    const businessOwner = await BusinessOwner.findById(businessOwnerId);

    if (
      !businessOwner ||
      !businessOwner.imageData ||
      !businessOwner.imageMimeType
    ) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Construct the Data URL
    const dataUrl = `data:${businessOwner.imageMimeType};base64,${businessOwner.imageData}`;

    res.status(200).json({ imageUrl: dataUrl });
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Business Profile
const getBusinessProfile = async (req, res) => {
  const businessId = req.userId;
  console.log(`Received GET request at /business/edit-profile`);
  console.log(`Business ID from req.userId: ${businessId}`);

  try {
    // Fetch the business owner's details
    const businessOwner = await BusinessOwner.findById(businessId).select(
      "name email phoneNum businessName location description category operatingHours"
    );
    console.log("Fetched Business Owner:", businessOwner);

    if (!businessOwner) {
      console.error("Business Owner not found.");
      return res.status(404).json({ message: "Business Owner not found." });
    }

    // Return the business owner's details with operatingHoursStart and operatingHoursEnd
    res.status(200).json({
      name: businessOwner.name,
      email: businessOwner.email,
      phoneNum: businessOwner.phoneNum,
      businessName: businessOwner.businessName,
      location: businessOwner.location,
      description: businessOwner.description,
      category: businessOwner.category,
      operatingHoursStart: businessOwner.operatingHours?.start || "",
      operatingHoursEnd: businessOwner.operatingHours?.end || "",
    });
  } catch (error) {
    console.error("Error fetching business profile:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Edit Business Profile
const editBusinessProfile = async (req, res) => {
  const businessId = req.userId;
  console.log(`Received PUT request at /business/edit-profile`);
  console.log(`Business ID from req.userId: ${businessId}`);

  try {
    // Extract fields from request body
    const {
      name,
      email,
      phoneNum,
      businessName,
      location,
      description,
      category,
      operatingHoursStart,
      operatingHoursEnd,
    } = req.body;
    console.log("Received data for update:", req.body);

    // Validate required fields
    if (
      !name ||
      !email ||
      !phoneNum ||
      !businessName ||
      !location ||
      !description ||
      !category ||
      !operatingHoursStart ||
      !operatingHoursEnd
    ) {
      console.error("Validation Error: Missing required fields.");
      return res.status(400).json({ message: "All fields are required." });
    }

    // Prepare update data
    const updateData = {
      name,
      email,
      phoneNum,
      businessName,
      location,
      description,
      category,
      operatingHours: {
        start: operatingHoursStart,
        end: operatingHoursEnd,
      },
    };
    console.log("Update data prepared:", updateData);

    // Update the business owner
    const updatedBusinessOwner = await BusinessOwner.findByIdAndUpdate(
      businessId,
      updateData,
      { new: true, runValidators: true }
    );
    console.log("Updated Business Owner:", updatedBusinessOwner);

    if (!updatedBusinessOwner) {
      console.error("Business owner not found.");
      return res.status(404).json({ message: "Business owner not found." });
    }

    // Return the updated business owner data
    res.status(200).json({
      message: "Profile updated successfully.",
      businessOwner: updatedBusinessOwner,
    });
  } catch (error) {
    console.error("Error updating business profile:", error);
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    }
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const getBusinessOwnerDetails = async (req, res) => {
  try {
    const businessId = req.userId;

    const businessOwner = await BusinessOwner.findById(businessId).select(
      "name imageData imageMimeType"
    );

    if (!businessOwner) {
      return res.status(404).json({ message: "Business Owner not found" });
    }

    let imageUrl = "";
    if (businessOwner.imageData && businessOwner.imageMimeType) {
      imageUrl = `data:${businessOwner.imageMimeType};base64,${businessOwner.imageData}`;
    }

    res.status(200).json({
      name: businessOwner.name,
      imageUrl: imageUrl,
    });
  } catch (error) {
    console.error("Error fetching business owner details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addService,
  addProvider,
  getBusinessServices,
  getDashboard,
  getWeeklyStats,
  getBusinessProfile,
  editBusinessProfile,
  getUpNextAppointments, // Added this function
  uploadBusinessImage,
  getBusinessImage,
  getBusinessOwnerDetails,
};
