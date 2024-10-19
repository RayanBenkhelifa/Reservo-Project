// app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const businessRoutes = require('./routes/businessRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const customerRoutes = require('./routes/customerRoutes');
const paymentRoutes = require('./routes/paymentRoutes'); // Import payment routes
const bodyParser = require('body-parser');
const paymentController = require('./controllers/paymentController');
const path = require('path');

dotenv.config();
const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Import routes
app.use('/auth', authRoutes);
app.use('/business', businessRoutes);
app.use('/booking', bookingRoutes);
app.use('/customer', customerRoutes);
app.use('/payment', paymentRoutes); // Use payment routes

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Successfully connected to the database server.');
    app.listen(PORT, () => console.log(`Web server listening on port ${PORT}`));
  })
  .catch(error => console.log(error));

// Handle success page route
app.get('/success', async (req, res) => {
  const sessionId = req.query.session_id;

  try {
    const booking = await Booking.findOne({ stripeSessionId: sessionId });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Update payment status to completed
    booking.paymentStatus = 'completed';
    await booking.save();

    res.render('success', { booking });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ error: 'Failed to complete payment' });
  }
});

// Handle cancel page route
app.get('/cancel', (req, res) => {
  res.render('cancel'); // Render cancel page
});
app.get('/payment/verify-session', paymentController.verifySession);

