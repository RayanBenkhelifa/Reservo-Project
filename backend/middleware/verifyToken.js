const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer token"

  if (!token) {
    console.error('No token provided');
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // Attach userId to the request object
    req.userType = decoded.userType; // Attach userType (e.g., 'businessOwner')

    console.log('Token successfully decoded:', decoded); // Debugging log for the decoded token
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    console.error('Invalid token:', error.message); // Log the specific error
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

module.exports = verifyToken;
