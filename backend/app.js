const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const businessRoutes = require('./routes/businessRoutes')
const bookingRoutes = require('./routes/bookingRoutes');
const customerRoutes = require('./routes/customerRoutes')
dotenv.config();
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Import routes
app.use('/auth', authRoutes);
app.use('/business', businessRoutes);
app.use('/booking', bookingRoutes);  // New booking routes
app.use('/customer', customerRoutes);  // Adding customer routes


const PORT = process.env.PORT || 3000;


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log(`Successfully connected to the database server.`);
    app.listen(PORT, () => console.log(`Web server listening on port ${PORT}`));
  })
  .catch(error => console.log(error));
