const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const businessRoutes = require('./routes/businessRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const customerRoutes = require('./routes/customerRoutes');

dotenv.config();
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the 'frontend' folder (one level up from backend)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Route to serve index.html at the root URL ('/')
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Import routes
app.use('/auth', authRoutes);
app.use('/business', businessRoutes);
app.use('/booking', bookingRoutes);
app.use('/customer', customerRoutes);

// Define the port
const PORT = process.env.PORT || 3000;

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log(`Successfully connected to the database.`);
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(error => console.log(error));
