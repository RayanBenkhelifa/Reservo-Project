const Customer = require('../models/customer');
const BusinessOwner = require('../models/BusinessOwner')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Signup function for customers (with immediate login)
const signupCustomer = async (req, res) => {
  const { name, email, phoneNum, password } = req.body;
  console.log("sdasdas")
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const newCustomer = new Customer({
      name,
      email,
      phoneNum,
      password: hashedPassword
    });
    await newCustomer.save();

    // Generate JWT token immediately after signup
    const token = jwt.sign(
      { userId: newCustomer._id, userType: 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send token back so the customer can be logged in
    res.status(201).json({ message: 'Customer registered successfully!', token });
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
  const { name, email, phoneNum, password, businessName, operatingHoursStart,operatingHoursEnd , category , description, location } = req.body;
  console.log(name, email, phoneNum, password, businessName, operatingHoursStart,operatingHoursEnd , category , description, location)
  
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
      category,
      description,
      location,
      operatingHours:{
        start: operatingHoursStart,
        end: operatingHoursEnd,
      }
    });

    // Save the new business owner to the database
    await newBusinessOwner.save();

    // Generate JWT token immediately after signup
    const token = jwt.sign(
      { userId: newBusinessOwner._id, userType: 'businessOwner' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send the token back to log in
    res.status(201).json({ message: 'Business owner created successfully', token });
  } catch (error) {
    res.status(500).json({ message: `Server error ${error}` });
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
  
      // Send the token back to log in
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