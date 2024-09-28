const Customer = require('../models/customer');
const BusinessOwner = require('../models/BusinessOwner')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// Signup function for customers
const signupCustomer = async (req, res) => {
  const { name, email, phoneNum, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const newCustomer = new Customer({
      name,
      email,
      phoneNum,
      password: hashedPassword
    });
    await newCustomer.save();
    res.status(201).json({ message: 'Customer registered successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Customer Login
const customerLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
      // Check if the customer exists
      const customer = await Customer.findOne({ email });
      if (!customer) {
        return res.status(400).json({ message: 'Customer not found' });
      }
  
      // Compare passwords
      const isMatch = await bcrypt.compare(password, customer.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Generate JWT token
      const token = jwt.sign(
        { userId: customer._id, userType: 'customer' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      return res.status(200).json({ token });
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  };


// Signup function for business owners
const signupBusinessOwner = async (req, res) => {
    const { name, email, phoneNum, password, businessName, operatingHours } = req.body;
  
    try {
      // Check if the business owner already exists
      const existingBusinessOwner = await BusinessOwner.findOne({ email });
      if (existingBusinessOwner) {
        return res.status(400).json({ message: 'Business owner already exists' });
      }
  
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create new BusinessOwner with operating hours
      const newBusinessOwner = new BusinessOwner({
        name,
        email,
        phoneNum,
        password: hashedPassword,
        businessName,
        operatingHours, // This stores the operating hours
      });
  
      // Save the new business owner to the database
      await newBusinessOwner.save();
  
      // Send a success message back
      res.status(201).json({ message: 'Business owner created successfully', businessOwner: newBusinessOwner });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  
  // Business Owner Login
  const businessOwnerLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
      // Check if the business owner exists
      const businessOwner = await BusinessOwner.findOne({ email });
      if (!businessOwner) {
        return res.status(400).json({ message: 'Business Owner not found' });
      }
  
      // Compare passwords
      const isMatch = await bcrypt.compare(password, businessOwner.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Generate JWT token
      const token = jwt.sign(
        { userId: businessOwner._id, userType: 'businessOwner' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      return res.status(200).json({ token });
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  };

module.exports = {
    signupCustomer,
    signupBusinessOwner,
    customerLogin,
    businessOwnerLogin
  };