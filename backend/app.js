const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const businessRoutes = require('./routes/businessRoutes')

dotenv.config();
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Import routes
app.use('/auth', authRoutes);
app.use('/business', businessRoutes);

const PORT = process.env.PORT || 3000;


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log(`Successfully connected to the database server.`);
    app.listen(PORT, () => console.log(`Web server listening on port ${PORT}`));
  })
  .catch(error => console.log(error));
