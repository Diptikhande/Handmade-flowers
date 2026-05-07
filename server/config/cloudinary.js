const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary');
const CloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');

const hasCloudinaryConfig =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

let storage;
let isCloudinaryEnabled = false;

// Try to initialize Cloudinary storage only if credentials exist
if (hasCloudinaryConfig) {
  try {
    // Configure cloudinary v2 with provided credentials
    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Verify cloudinary is properly configured
    const configCheck = cloudinary.v2.config();
    if (!configCheck.cloud_name || !configCheck.api_key) {
      throw new Error('Cloudinary config incomplete after initialization');
    }

    // CloudinaryStorage expects the main cloudinary object with v2 property
    storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'handmade-flowers',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        max_file_size: 5242880, // 5MB
      },
    });
    isCloudinaryEnabled = true;
    console.log('✓ Using Cloudinary for image uploads (cloud:', process.env.CLOUDINARY_CLOUD_NAME, ')');
  } catch (error) {
    console.warn('⚠️  Cloudinary initialization failed:', error.message);
    console.warn('    Falling back to local disk storage');
    isCloudinaryEnabled = false;
  }
}

// Fall back to local disk storage if Cloudinary isn't available
if (!isCloudinaryEnabled) {
  storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname || '.jpg');
      const timestamp = Date.now();
      const random = Math.round(Math.random() * 1e9);
      cb(null, `${timestamp}-${random}${ext}`);
    },
  });

  if (hasCloudinaryConfig) {
    console.log('ℹ️  Cloudinary configured but not initialized; using local disk storage');
  } else {
    console.log('ℹ️  Cloudinary not configured; using local disk storage for uploads');
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = new Set([
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
    ]);

    if (file.mimetype && allowed.has(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, WEBP, or GIF images are allowed'), false);
    }
  },
});

module.exports = { cloudinary, upload };
