const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

const PRIMARY_ADMIN_EMAIL = 'admin1@gmail.com';

const generateToken = (admin) => {
  return jwt.sign(
    { id: admin._id, role: admin.role },
    process.env.JWT_SECRET || 'change-me-in-production',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

const validatePassword = (password) => {
  const errors = [];
  if (password.length < 8) errors.push('Password must be at least 8 characters long');
  if (!/[a-z]/.test(password)) errors.push('Password must contain lowercase letters');
  if (!/[A-Z]/.test(password)) errors.push('Password must contain uppercase letters');
  if (!/\d/.test(password)) errors.push('Password must contain numbers');
  if (!/[@$!%*?&]/.test(password)) errors.push('Password must contain special characters (@$!%*?&)');
  return errors;
};

const getAllowedAdmins = () =>
  (process.env.ADMIN_ALLOWED_USERS || PRIMARY_ADMIN_EMAIL)
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

const isIdentifierAllowed = (username, email) => {
  const allowed = getAllowedAdmins();
  if (!allowed.length) return true;
  const userKey = (username || '').toLowerCase();
  const emailKey = (email || '').toLowerCase();
  return allowed.includes(userKey) || (emailKey && allowed.includes(emailKey));
};

exports.register = async (_req, res) => {
  return res.status(403).json({
    success: false,
    message: 'Registration is disabled. Please contact your administrator.',
  });
};

exports.login = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const identifier = (email || username || '').trim().toLowerCase();
    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const admin = await Admin.findOne({ email: identifier }).select('+password +role');

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!isIdentifierAllowed(admin.username, admin.email)) {
      return res.status(403).json({
        success: false,
        message: 'This admin account is not allowed to sign in on this deployment',
      });
    }

    if (admin.status !== 'active') {
      return res.status(403).json({ success: false, message: 'Admin account is inactive' });
    }

    if (!admin.isAdmin()) {
      return res.status(403).json({ success: false, message: 'You do not have admin privileges' });
    }

    const isPasswordCorrect = await admin.matchPassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(admin);

    res.status(200).json({
      success: true,
      token,
      data: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        status: admin.status,
        createdAt: admin.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.setupFirstAdmin = async (req, res, next) => {
  try {
    const { username = 'admin1', email = PRIMARY_ADMIN_EMAIL, password } = req.body;

    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      return res.status(403).json({ success: false, message: 'Admin already exists. Setup already completed.' });
    }

    if (!password) {
      return res.status(400).json({ success: false, message: 'Please provide password' });
    }

    const normalizedUsername = username.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail !== PRIMARY_ADMIN_EMAIL) {
      return res.status(400).json({
        success: false,
        message: `Setup email must be ${PRIMARY_ADMIN_EMAIL}`,
      });
    }

    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email' });
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      return res.status(400).json({ success: false, message: 'Password validation failed', errors: passwordErrors });
    }

    const admin = await Admin.create({
      username: normalizedUsername,
      email: normalizedEmail,
      password,
      role: 'super-admin',
      status: 'active',
    });

    const token = generateToken(admin);

    res.status(201).json({
      success: true,
      message: 'First admin account created successfully',
      token,
      data: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
