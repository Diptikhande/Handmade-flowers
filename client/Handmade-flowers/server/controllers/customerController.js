const Customer = require('../models/Customer');
const jwt = require('jsonwebtoken');

const generateToken = (customer) => {
  return jwt.sign(
    { id: customer._id, email: customer.email, role: 'customer' },
    process.env.JWT_SECRET || 'change-me-in-production',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Customer login - email based (creates customer if not exists)
exports.login = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email is required for customer login'
      });
    }

    const emailLower = email.trim().toLowerCase();

    // Find or create customer
    let customer = await Customer.findOne({ email: emailLower });

    if (!customer) {
      // Create new customer
      customer = await Customer.create({
        email: emailLower,
        name: emailLower.split('@')[0], // Use part of email as name
        createdAt: new Date()
      });
    }

    const token = generateToken(customer);

    res.status(200).json({
      success: true,
      token,
      data: {
        id: customer._id,
        email: customer.email,
        name: customer.name,
        role: 'customer'
      }
    });
  } catch (error) {
    // If database is unavailable, still allow customer to login with demo token
    if (error.name === 'MongooseError' || error.code === 'ENOTFOUND') {
      const demoEmail = (req.body.email || '').trim().toLowerCase();
      if (!demoEmail) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      const token = jwt.sign(
        { email: demoEmail, role: 'customer', isDemoMode: true },
        process.env.JWT_SECRET || 'change-me-in-production',
        { expiresIn: '7d' }
      );

      console.warn('⚠️  Database unavailable for customer login, using demo mode');
      return res.status(200).json({
        success: true,
        token,
        data: {
          email: demoEmail,
          name: demoEmail.split('@')[0],
          role: 'customer',
          isDemoMode: true
        }
      });
    }
    next(error);
  }
};

// Get customer profile
exports.getProfile = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.user.id).select('-password');

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error) {
    next(error);
  }
};
