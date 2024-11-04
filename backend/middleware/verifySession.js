// verifySession.js

const verifySession = (req, res, next) => {
  if (req.session && req.session.userId) {
    req.userId = req.session.userId;
    req.userType = req.session.userType;
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized: No active session' });
  }
};

const verifyBusinessOwner = (req, res, next) => {
  if (req.session && req.session.userId && req.session.userType === 'businessOwner') {
    req.userId = req.session.userId;
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized: Business owner access only' });
  }
};

module.exports = { verifySession, verifyBusinessOwner };
