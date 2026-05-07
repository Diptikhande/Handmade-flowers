const Customer = require('../models/Customer');
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');

const generateToken = (customer) =>
  jwt.sign(
    { id: customer._id, email: customer.email, role: 'customer' },
    process.env.JWT_SECRET || 'change-me-in-production',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, address, city, state, pincode } = req.body;
    if (!name || !email || !password || !phone || !address || !city || !state || !pincode) {
      return res.status(400).json({ success: false, message: 'All profile details are required to register' });
    }

    const emailLower = email.trim().toLowerCase();
    const existing = await Customer.findOne({ email: emailLower });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Customer with this email already exists' });
    }

    const customer = await Customer.create({
      name: name.trim(),
      email: emailLower,
      password,
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      loginType: 'password',
    });

    const token = generateToken(customer);
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      data: {
        id: customer._id,
        email: customer.email,
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        pincode: customer.pincode,
        role: 'customer',
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.loginWithPassword = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const customer = await Customer.findOne({ email: email.trim().toLowerCase() }).select('+password');
    if (!customer || !customer.password || !(await customer.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(customer);
    res.status(200).json({
      success: true,
      token,
      data: { id: customer._id, email: customer.email, name: customer.name, role: 'customer' },
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Email is required for customer login' });
    }

    const emailLower = email.trim().toLowerCase();
    let customer = await Customer.findOne({ email: emailLower });
    if (!customer) {
      customer = await Customer.create({
        name: emailLower.split('@')[0],
        email: emailLower,
        loginType: 'email',
      });
    }

    const token = generateToken(customer);
    res.status(200).json({
      success: true,
      token,
      data: { id: customer._id, email: customer.email, name: customer.name, role: 'customer' },
    });
  } catch (error) {
    next(error);
  }
};

exports.googleLogin = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Google email is required' });
    }

    const emailLower = email.trim().toLowerCase();
    const resolvedName = (name || emailLower.split('@')[0]).trim();

    let customer = await Customer.findOne({ email: emailLower });
    if (!customer) {
      customer = await Customer.create({
        name: resolvedName,
        email: emailLower,
        loginType: 'google',
      });
    } else if (customer.loginType !== 'google') {
      customer.loginType = 'google';
      if (!customer.name) customer.name = resolvedName;
      await customer.save();
    }

    const token = generateToken(customer);
    res.status(200).json({
      success: true,
      message: 'Google sign-in successful',
      token,
      data: {
        id: customer._id,
        email: customer.email,
        name: customer.name,
        role: 'customer',
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.user.id).select('-password');
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address, city, state, pincode } = req.body;
    const updateData = {};

    if (name !== undefined) updateData.name = name.trim();
    if (phone !== undefined) updateData.phone = phone.trim();
    if (address !== undefined) updateData.address = address.trim();
    if (city !== undefined) updateData.city = city.trim();
    if (state !== undefined) updateData.state = state.trim();
    if (pincode !== undefined) updateData.pincode = pincode.trim();

    const customer = await Customer.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const query = req.user.id
      ? { $or: [{ customerId: req.user.id }, { customerEmail: req.user.email }] }
      : { customerEmail: req.user.email };

    const orders = await Order.find(query).sort({ createdAt: -1 }).populate('productId');
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};
