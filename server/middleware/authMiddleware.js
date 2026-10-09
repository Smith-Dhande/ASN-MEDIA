const jwt = require('jsonwebtoken');
const Staff = require('../models/Staff');


const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {

    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. No token provided.'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'asn_digital_media_secret_jwt_key_2026'
    );

    const user = await Staff.findById(decoded.id);

    if (!user) {

      req.user = decoded;
      return next();
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      designation: user.designation,
      avatar: user.avatar
    };

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Invalid or expired token.'
    });
  }
};


const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role "${req.user ? req.user.role : 'Unknown'}" is not authorized to access this resource`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
