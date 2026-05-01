# Handmade Flowers E-Commerce Website

A complete, production-ready MERN (MongoDB, Express, React, Node.js) e-commerce website for a handmade artificial pipe cleaner flowers business.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Guide](#setup-guide)
- [API Documentation](#api-documentation)
- [Admin Features](#admin-features)

---

## ✨ Features

### Customer Features
- ✓ Browse products by category
- ✓ View detailed product information
- ✓ Manual UPI QR code payment system
- ✓ Payment screenshot upload verification
- ✓ Custom product order requests
- ✓ Track order status in real-time
- ✓ Responsive design (mobile-friendly)
- ✓ Pastel color theme with minimal design

### Admin Features
- ✓ Secure admin login/registration
- ✓ Dashboard with real-time statistics
- ✓ Add, edit, delete products
- ✓ Manage customer orders
- ✓ Approve/reject orders with payment verification
- ✓ View payment screenshots
- ✓ Manage custom orders
- ✓ Revenue tracking

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **React Router v6** - Navigation
- **Axios** - HTTP client
- **CSS3** - Styling (Pastel design)

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Image uploads
- **Multer** - File handling

---

## 📁 Project Structure

```
handmade-flowers/
├── client/                          # Frontend (React)
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   ├── Footer.js
│   │   │   ├── ProductCard.js
│   │   │   ├── LoadingSpinner.js
│   │   │   └── ProtectedRoute.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Products.js
│   │   │   ├── ProductDetails.js
│   │   │   ├── Checkout.js
│   │   │   ├── CustomOrder.js
│   │   │   ├── About.js
│   │   │   ├── Contact.js
│   │   │   ├── OrderStatus.js
│   │   │   ├── AdminLogin.js
│   │   │   ├── AdminDashboard.js
│   │   │   ├── ManageProducts.js
│   │   │   └── ManageOrders.js
│   │   ├── services/
│   │   │   └── api.js              # API calls
│   │   ├── styles/
│   │   │   └── global.css
│   │   ├── App.js
│   │   └── index.js
│   ├── .env.example
│   └── package.json
│
└── server/                          # Backend (Node.js)
    ├── config/
    │   ├── db.js                    # MongoDB connection
    │   └── cloudinary.js            # Image upload config
    ├── models/
    │   ├── Product.js
    │   ├── Order.js
    │   ├── CustomOrder.js
    │   └── Admin.js
    ├── controllers/
    │   ├── productController.js
    │   ├── orderController.js
    │   ├── customOrderController.js
    │   └── adminController.js
    ├── routes/
    │   ├── productRoutes.js
    │   ├── orderRoutes.js
    │   ├── customOrderRoutes.js
    │   └── adminRoutes.js
    ├── middleware/
    │   ├── auth.js                  # JWT verification
    │   └── errorHandler.js
    ├── .env.example
    ├── server.js
    └── package.json
```

---

## 🚀 Setup Guide

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (free)
- Cloudinary account (free)
- Git

### Step 1: Clone the Repository
```bash
cd handmade-flowers
```

### Step 2: Setup MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (free tier available)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `username` and `password` with your credentials
7. Keep this connection string safe

**Connection String Format:**
```
mongodb+srv://username:password@cluster.mongodb.net/handmade-flowers?retryWrites=true&w=majority
```

### Step 3: Setup Cloudinary

1. Go to [Cloudinary](https://cloudinary.com)
2. Sign up for a free account
3. Go to Dashboard
4. Copy your:
   - Cloud Name
   - API Key
   - API Secret

### Step 4: Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env file with your credentials:
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_random_secret_key
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret
# FRONTEND_URL=http://localhost:3000

# Start the backend server
npm start
# or for development with auto-reload:
npm run dev
```

The server will start on: `http://localhost:5000`

**API Health Check:**
```
GET http://localhost:5000/api/health
```

### Step 5: Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env file:
# REACT_APP_API_URL=http://localhost:5000/api

# Start the frontend
npm start
```

The app will open on: `http://localhost:3000`

### Step 6: Create Admin Account

1. Go to http://localhost:3000/admin/login
2. Click "Register here"
3. Enter your admin credentials
4. Login with your credentials

**Note:** In production, disable registration and create admins via database only.

---

## 📊 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Products API

**Get All Products**
```
GET /products
```

**Get Product by ID**
```
GET /products/:id
```

**Get Products by Category**
```
GET /products/category/:category
```
Categories: `keychain`, `fridge-magnet`, `hair-clip`, `flower-pot`, `bouquet`

**Create Product (Admin)**
```
POST /products
Headers: Authorization: Bearer {token}
Body: FormData
  - name: string
  - price: number
  - description: string
  - category: string
  - image: file
```

**Update Product (Admin)**
```
PUT /products/:id
Headers: Authorization: Bearer {token}
Body: FormData (same as create)
```

**Delete Product (Admin)**
```
DELETE /products/:id
Headers: Authorization: Bearer {token}
```

### Orders API

**Create Order**
```
POST /orders
Body: FormData
  - productId: string
  - customerName: string
  - phone: string (10 digits)
  - address: string
  - amount: number
  - transactionId: string
  - paymentScreenshot: file
```

**Get Order by Transaction ID**
```
GET /orders/status/:transactionId
```

**Get All Orders (Admin)**
```
GET /orders
Headers: Authorization: Bearer {token}
```

**Get Order by ID (Admin)**
```
GET /orders/:id
Headers: Authorization: Bearer {token}
```

**Approve Order (Admin)**
```
PATCH /orders/:id/approve
Headers: Authorization: Bearer {token}
```

**Reject Order (Admin)**
```
PATCH /orders/:id/reject
Headers: Authorization: Bearer {token}
Body: { reason: string }
```

### Custom Orders API

**Create Custom Order**
```
POST /custom-orders
Body:
{
  "name": string,
  "phone": string,
  "address": string,
  "productType": string,
  "color": string,
  "customText": string (optional),
  "quantity": number,
  "occasion": string
}
```

**Get All Custom Orders (Admin)**
```
GET /custom-orders
Headers: Authorization: Bearer {token}
```

**Update Custom Order (Admin)**
```
PATCH /custom-orders/:id
Headers: Authorization: Bearer {token}
Body: { status: string }
```

### Admin API

**Register Admin**
```
POST /admin/register
Body:
{
  "username": string,
  "password": string
}
```

**Login Admin**
```
POST /admin/login
Body:
{
  "username": string,
  "password": string
}
Response: { token: string, data: {...} }
```

**Get Admin Profile**
```
GET /admin/profile
Headers: Authorization: Bearer {token}
```

---

## 🔐 Admin Features

### Admin Dashboard
- View total products, orders, and revenue
- See pending and approved orders count
- Quick access to all management tools

### Product Management
- Add new products with images
- Edit existing product details
- Delete products
- Manage inventory

### Order Management
- View all customer orders
- See payment screenshots
- Approve verified payments
- Reject with reason
- Track order status

### Custom Orders
- View custom order requests
- Update order status
- Communicate with customers

---

## 🎨 Design Features

- **Pastel Color Palette:** Soft pinks, blues, and purples
- **Minimal Design:** Clean, uncluttered interface
- **Responsive Layout:** Works perfectly on mobile, tablet, and desktop
- **Smooth Animations:** Hover effects and transitions
- **Accessible:** Good contrast and readable fonts

---

## 🔄 Order Flow

### Customer Side
1. Browse products
2. Select product or create custom order
3. Proceed to checkout
4. Scan UPI QR code
5. Make payment
6. Upload payment screenshot
7. Enter transaction ID
8. Order submitted
9. Check order status anytime

### Admin Side
1. Login to dashboard
2. View pending orders
3. Check payment screenshot
4. Verify payment details
5. Approve or reject order
6. Customer sees updated status
7. Process order fulfillment

---

## 📝 Payment System

### UPI QR Code Flow
1. Customer clicks "Buy Now"
2. Checkout page shows UPI QR code
3. Customer scans with UPI app
4. Enters amount and pays
5. Gets payment confirmation
6. Takes screenshot
7. Uploads screenshot in form
8. Enters Transaction ID from UPI

### Verification
- Admin views screenshot
- Checks transaction ID
- Verifies payment amount
- Approves if valid
- Rejects if invalid

**Current UPI ID:** `yourbusiness@upi` (update in Checkout.js)

---

## 🚢 Deployment

### Backend Deployment (Heroku/Railway/Render)
```bash
# Create Procfile in server directory
echo "web: node server.js" > Procfile

# Deploy to Heroku
heroku create your-app-name
git push heroku main
```

### Frontend Deployment (Vercel/Netlify)
```bash
# Build the frontend
npm run build

# Deploy to Vercel
vercel
```

### Environment Variables in Production
- Keep all secrets in .env files
- Never commit .env to git
- Use provider's secret management
- Update REACT_APP_API_URL to production backend URL

---

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- Check MongoDB connection string
- Verify IP whitelist in MongoDB Atlas
- Ensure database name is correct

### "Cloudinary upload fails"
- Verify Cloudinary credentials
- Check image file format
- Ensure file size < 5MB

### "CORS errors"
- Check FRONTEND_URL in backend .env
- Ensure frontend and backend URLs match

### "JWT token invalid"
- Clear localStorage
- Re-login to admin panel
- Check JWT_SECRET matches

---

## 📞 Support

For issues or questions:
1. Check the API documentation
2. Review error messages carefully
3. Verify all environment variables
4. Ensure all dependencies are installed

---

## 📄 License

This project is open source and available for commercial use.

---

## 🎉 Ready to Launch!

Your e-commerce website is ready. Start adding products and accepting orders!

**Next Steps:**
1. Add your UPI ID in Checkout.js
2. Upload product images
3. Create admin account
4. Start accepting orders
5. Share with customers

Good luck! 🌸
