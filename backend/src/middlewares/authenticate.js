const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys');
const Vendor = require('../models/Vendor');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const vendor = await Vendor.findOne({ v_id: decoded.id });

    if (!vendor) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.vendor = vendor;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authenticate;