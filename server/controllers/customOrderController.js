// Custom Order Controller
const CustomOrder = require('../models/CustomOrder');

// @route   POST /api/custom-orders
// @access  Public
exports.createCustomOrder = async (req, res, next) => {
  try {
    const { name, phone, address, productType, color, customText, quantity, occasion } = req.body;

    const customOrder = await CustomOrder.create({
      name,
      phone,
      address,
      productType,
      color,
      customText,
      quantity,
      occasion,
    });

    res.status(201).json({
      success: true,
      message: 'Custom order created successfully. We will contact you soon!',
      data: customOrder,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/custom-orders
// @access  Private (Admin)
exports.getAllCustomOrders = async (req, res, next) => {
  try {
    const customOrders = await CustomOrder.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: customOrders.length,
      data: customOrders,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/custom-orders/:id
// @access  Private
exports.getCustomOrderById = async (req, res, next) => {
  try {
    const customOrder = await CustomOrder.findById(req.params.id);

    if (!customOrder) {
      return res.status(404).json({
        success: false,
        message: 'Custom order not found',
      });
    }

    res.status(200).json({
      success: true,
      data: customOrder,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PATCH /api/custom-orders/:id
// @access  Private (Admin)
exports.updateCustomOrder = async (req, res, next) => {
  try {
    const { status } = req.body;

    const customOrder = await CustomOrder.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!customOrder) {
      return res.status(404).json({
        success: false,
        message: 'Custom order not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Custom order updated successfully',
      data: customOrder,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/custom-orders/:id
// @access  Private (Admin)
exports.deleteCustomOrder = async (req, res, next) => {
  try {
    const customOrder = await CustomOrder.findByIdAndDelete(req.params.id);

    if (!customOrder) {
      return res.status(404).json({
        success: false,
        message: 'Custom order not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Custom order deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
