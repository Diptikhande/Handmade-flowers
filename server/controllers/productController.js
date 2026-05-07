const Product = require('../models/Product');

const path = require('path');

const normalizeImageUrl = (raw) => {
  if (!raw) return raw;
  
  // If it's a Cloudinary URL, keep it as-is
  if (/^https?:\/\/res\.cloudinary\.com/i.test(raw)) {
    return raw;
  }
  
  // If it's any other http(s) URL, convert to relative path
  if (/^https?:\/\//i.test(raw)) {
    // Extract path after /uploads/
    const match = raw.match(/\/uploads\/(.*)/);
    if (match) {
      return `/uploads/${match[1]}`;
    }
    return raw;
  }
  
  // Handle local paths
  const clean = String(raw).replace(/\\/g, '/');
  if (clean.startsWith('/uploads/')) return clean;
  if (clean.includes('/uploads/')) return clean.slice(clean.indexOf('/uploads/'));
  
  return `/uploads/${clean.split(/[/\\]/).pop()}`;
};

const getUploadedUrl = (file) => {
  if (!file) return null;
  
  // Cloudinary upload - returns full URL (keep as-is)
  if (file.secure_url) {
    return file.secure_url;
  }
  if (file.url) {
    return file.url;
  }
  
  // Local disk storage - always return relative path
  if (file.filename) {
    return `/uploads/${file.filename}`;
  }
  
  // Fallback for path-based storage
  if (file.path) {
    return normalizeImageUrl(file.path);
  }
  
  return null;
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    
    try {
      const products = await Product.find(filter).sort({ createdAt: -1 });
      
      // Normalize image URLs for existing products with full paths
      const normalizedProducts = products.map((product) => {
        const productObj = product.toObject();
        productObj.imageUrl = normalizeImageUrl(productObj.imageUrl);
        return productObj;
      });
      
      return res.status(200).json({ success: true, count: normalizedProducts.length, data: normalizedProducts });
    } catch (dbError) {
      // Check if it's a connection error or another type of error
      if (dbError.name === 'MongooseError' || dbError.code === 'ENOTFOUND') {
        console.warn('⚠️  Database unavailable for products, returning empty list');
        return res.status(200).json({ success: true, count: 0, data: [] });
      }
      // Re-throw other errors
      throw dbError;
    }
  } catch (error) {
    next(error);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Normalize image URL for existing products with full paths
    const productObj = product.toObject();
    productObj.imageUrl = normalizeImageUrl(productObj.imageUrl);

    res.status(200).json({ success: true, data: productObj });
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { name, price, description, category, shortDescription, stock } = req.body;
    const imageUrl = getUploadedUrl(req.file);

    if (!imageUrl) {
      return res.status(400).json({ success: false, message: 'Product image is required' });
    }

    const product = await Product.create({
      name,
      price,
      description,
      category,
      shortDescription,
      stock,
      imageUrl,
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { name, price, description, category, shortDescription, stock } = req.body;
    const updateData = { name, price, description, category, shortDescription, stock };

    const uploadedImageUrl = getUploadedUrl(req.file);
    if (uploadedImageUrl) {
      updateData.imageUrl = uploadedImageUrl;
    }

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined || updateData[key] === '') {
        delete updateData[key];
      }
    });

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getProductsByCategory = async (req, res, next) => {
  try {
    const products = await Product.find({ category: req.params.category });
    
    // Normalize image URLs for existing products with full paths
    const normalizedProducts = products.map((product) => {
      const productObj = product.toObject();
      productObj.imageUrl = normalizeImageUrl(productObj.imageUrl);
      return productObj;
    });
    
    res.status(200).json({ success: true, count: normalizedProducts.length, data: normalizedProducts });
  } catch (error) {
    next(error);
  }
};
