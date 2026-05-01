// Custom Order Model for Personalized Products
const mongoose = require('mongoose');

const customOrderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide your phone number'],
      match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number'],
    },
    address: {
      type: String,
      required: [true, 'Please provide your address'],
    },
    productType: {
      type: String,
      enum: ['keychain', 'fridge-magnet', 'hair-clip', 'flower-pot', 'bouquet'],
      required: [true, 'Please select a product type'],
    },
    color: {
      type: String,
      required: [true, 'Please specify color'],
    },
    customText: {
      type: String,
      maxlength: [100, 'Custom text cannot exceed 100 characters'],
    },
    quantity: {
      type: Number,
      required: [true, 'Please specify quantity'],
      min: [1, 'Quantity must be at least 1'],
    },
    occasion: {
      type: String,
      enum: ['birthday', 'anniversary', 'wedding', 'gift', 'other'],
      default: 'gift',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'in-progress', 'completed', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CustomOrder', customOrderSchema);
