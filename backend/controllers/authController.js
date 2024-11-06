const Customer = require('../models/Customer')
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
    req.session.userId = newCustomer._id;
    req.session.userType = 'customer';
    // Send success message
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
      req.session.userId = customer._id;
      req.session.userType = 'customer';
      // Send success message
      res.status(201).json({ message: 'Customer Logged In successfully!' });
      
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
    req.session.userId = newBusinessOwner._id;
    req.session.userType = 'businessOwner';
    // Send success message
    res.status(201).json({ message: 'BusinessOwner registered successfully!' });
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
  
      req.session.userId = businessOwner._id;
      req.session.userType = 'businessOwner';
      // Send success message
      res.status(201).json({ message: 'BusinessOwner Loged In successfully!' });
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  };

  const checkAuth = async (req, res) => {
    if (req.session && req.session.userId) {
      const userId = req.session.userId;
      const userType = req.session.userType;
  
      try {
        let user;
        if (userType === 'customer') {
          user = await Customer.findById(userId).select('name email');
        } else if (userType === 'businessOwner') {
          user = await BusinessOwner.findById(userId).select('name email');
        }
  
        if (user) {
          res.status(200).json({
            isAuthenticated: true,
            userType: userType,
            user: {
              username: user.name,
              email: user.email,
            },
          });
        } else {
          // User not found
          res.status(401).json({ isAuthenticated: false });
        }
      } catch (err) {
        console.error('Error fetching user in checkAuth:', err);
        res.status(500).json({ isAuthenticated: false });
      }
    } else {
      res.status(401).json({ isAuthenticated: false });
    }
  };

  const getProfile = async (req, res) => {
    try {
      const userId = req.session.userId;
      const userType = req.session.userType;
  
      if (userType === 'customer') {
        const customer = await Customer.findById(userId);
        if (customer) {
          res.status(200).json({ id: customer._id, name: customer.name, email: customer.email });
        } else {
          res.status(404).json({ error: 'Customer not found' });
        }
      } else {
        res.status(403).json({ error: 'Access denied' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to get user profile' });
    }
  };

  const logout = async (req, res) => {
    try {
      // Destroy the session on the server
      req.session.destroy((err) => {
        if (err) {
          console.error('Error destroying session:', err);
          return res.status(500).json({ error: 'Logout failed' });
        }
        
        // Clear the session cookie
        res.clearCookie('connect.sid', { httpOnly: true, sameSite: 'Strict' });
        res.status(200).json({ message: 'Logout successful' });
      });
    } catch (error) {
      console.error('Error during logout:', error);
      res.status(500).json({ error: 'Logout failed' });
    }
  };
module.exports = {
    signupCustomer,
    signupBusinessOwner,
    customerLogin,
    businessOwnerLogin,
    checkAuth,
    getProfile,
    logout
  };