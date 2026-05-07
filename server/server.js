const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

dotenv.config();

const connectDB = require('./config/db');

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const customOrderRoutes = require('./routes/customOrderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const customerRoutes = require('./routes/customerRoutes');
const contactRoutes = require('./routes/contactRoutes');
const siteSettingsRoutes = require('./routes/siteSettingsRoutes');
const authRoutes = require('./routes/authRoutes');

const errorHandler = require('./middleware/errorHandler');

const app = express();

/* =========================
   CORS
========================= */

app.use(cors({
  origin: 'https://handmade-flowers.vercel.app',
  credentials: true,
}));

app.options('*', cors());

/* =========================
   STATIC FILES
========================= */

app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* =========================
   BODY PARSER
========================= */

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

/* =========================
   HEALTH CHECK
========================= */

app.get('/api/health', (_req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;

  res.status(200).json({
    success: true,
    server: 'running',
    database: dbConnected ? 'connected' : 'disconnected',
  });
});

/* =========================
   API ROUTES
========================= */

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/custom-orders', customOrderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/settings', siteSettingsRoutes);

/* =========================
   ERROR HANDLER
========================= */

app.use(errorHandler);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

/* =========================
   SERVER
========================= */

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  process.exit(1);
});