const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const getTokenFromHeader = (req) => {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) return null;
  return auth.split(' ')[1];
};

const protect = async (req, res, next) => {
  try {
    const token = getTokenFromHeader(req);
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'change-me-in-production');
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Admin not found' });
    }

    if (admin.status !== 'active') {
      return res.status(403).json({ success: false, message: 'Admin account is inactive' });
    }

    req.admin = {
      id: admin._id,
      username: admin.username,
      role: admin.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.admin || !roles.includes(req.admin.role)) {
    return res.status(403).json({
      success: false,
      message: 'Insufficient permissions',
    });
  }
  next();
};

const requireAdmin = [protect, authorize('admin', 'super-admin')];

module.exports = { protect, authorize, requireAdmin };

