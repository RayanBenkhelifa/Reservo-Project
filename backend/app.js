require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

// Import routes
const authRoutes = require("./routes/authRoutes");
const businessRoutes = require("./routes/businessRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const customerRoutes = require("./routes/customerRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

// Initialize Express app
const app = express();

// CORS Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Allow frontend
    credentials: true, // Allow cookies
  })
);

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret", // Replace with a secure secret
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set true if using HTTPS
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000, // 2 hours
    },
  })
);

// Middleware for parsing JSON and form data
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (if applicable)
app.use(express.static(path.join(__dirname, "../frontend/public")));

// Routes
app.use("/auth", authRoutes);
app.use("/business", businessRoutes);
app.use("/booking", bookingRoutes);
app.use("/customer", customerRoutes);
app.use("/review", reviewRoutes);
app.use("/payment", paymentRoutes);

// Database connection and server start
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Successfully connected to the database server.");
    app.listen(PORT, () => console.log(`Web server listening on port ${PORT}`));
  })
  .catch((error) => console.error("Error connecting to the database:", error));
