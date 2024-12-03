// app.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const session = require("express-session");
const authRoutes = require("./routes/authRoutes");
const businessRoutes = require("./routes/businessRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const customerRoutes = require("./routes/customerRoutes");
const reviewRoutes = require("./routes/reviewRoutes"); // Add this line
const bodyParser = require("body-parser");
const path = require("path");

dotenv.config();
const app = express();
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Make sure to set this in your .env file
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000, // Session expiration time in milliseconds (e.g., 2 hours)
    },
  })
);
// Middleware to parse JSON
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../frontend/public")));

// Import routes
app.use("/auth", authRoutes);
app.use("/business", businessRoutes);
app.use("/booking", bookingRoutes);
app.use("/customer", customerRoutes);
app.use("/review", reviewRoutes); // Add this line


const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Successfully connected to the database server.");
    app.listen(PORT, () => console.log(`Web server listening on port ${PORT}`));
  })
  .catch((error) => console.log(error));