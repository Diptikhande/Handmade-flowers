const Order = require('../models/Order');
const Product = require('../models/Product');

const getUploadedUrl = (file) => file?.path || file?.secure_url || file?.url || null;

exports.createOrder = async (req, res, next) => {
  try {
    const { productId, customerName, phone, address, transactionId, quantity } = req.body;
    const paymentScreenshot = getUploadedUrl(req.file);

    if (!paymentScreenshot) {
      return res.status(400).json({ success: false, message: 'Payment screenshot is required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const orderQuantity = Math.max(1, Number(quantity || 1));
    const amount = Number(product.price) * orderQuantity;

    const order = await Order.create({
      productId,
      productName: product.name,
      customerName,
      phone,
      address,
      amount,
      transactionId,
      paymentScreenshot,
      quantity: orderQuantity,
    });

    res.status(201).json({
      success: true,
      message: 'Order submitted. Waiting for verification.',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate('productId');
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('productId');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

exports.getOrderByTransactionId = async (req, res, next) => {
  try {
    const order = await Order.findOne({ transactionId: req.params.transactionId });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    let statusMessage = 'Waiting for verification';
    if (order.status === 'approved') statusMessage = 'Order Confirmed';
    if (order.status === 'rejected') statusMessage = 'Payment not verified';

    res.status(200).json({ success: true, data: { ...order.toObject(), statusMessage } });
  } catch (error) {
    next(error);
  }
};

exports.approveOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.status(200).json({ success: true, message: 'Order approved successfully', data: order });
  } catch (error) {
    next(error);
  }
};

exports.rejectOrder = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', rejectionReason: reason },
      { new: true }
    );

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.status(200).json({ success: true, message: 'Order rejected successfully', data: order });
  } catch (error) {
    next(error);
  }
};

exports.getOrderStats = async (_req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const approvedOrders = await Order.countDocuments({ status: 'approved' });
    const rejectedOrders = await Order.countDocuments({ status: 'rejected' });

    const totalRevenue = await Order.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        approvedOrders,
        rejectedOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
    });
  } catch (error) {
    // If database is unavailable, return mock data
    if (error.name === 'MongooseError' || error.code === 'ENOTFOUND' || error.message?.includes('buffering')) {
      console.warn('⚠️  Database unavailable for order stats, returning mock data');
      return res.status(200).json({
        success: true,
        data: {
          totalOrders: 0,
          pendingOrders: 0,
          approvedOrders: 0,
          rejectedOrders: 0,
          totalRevenue: 0,
        },
      });
    }
    next(error);
  }
};
