# Quick Start Guide - Handmade Flowers E-Commerce

## 🚀 Get Started in 5 Minutes

Follow these simple steps to get your e-commerce website running locally.

---

## Step 1: Setup Your Credentials (10 minutes)

### MongoDB Atlas Setup
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (M0 free tier)
4. Click "Connect" → "Connect your application"
5. Choose "Drivers" → "Node.js"
6. Copy your connection string: `mongodb+srv://...`

### Cloudinary Setup
1. Go to https://cloudinary.com
2. Create free account
3. Go to Dashboard
4. Note your:
   - Cloud Name
   - API Key
   - API Secret

---

## Step 2: Start the Backend (5 minutes)

```bash
# Navigate to server folder
cd server

# Install all dependencies
npm install

# Create .env file
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env

# Edit .env and add:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/handmade-flowers?retryWrites=true&w=majority
# JWT_SECRET=your_super_secret_key_12345
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=123456789
# CLOUDINARY_API_SECRET=your_secret
# FRONTEND_URL=http://localhost:3000

# Start backend
npm start
```

**✓ Backend should run on: http://localhost:5000**

---

## Step 3: Start the Frontend (5 minutes)

```bash
# Open NEW terminal, navigate to client folder
cd client

# Install all dependencies
npm install

# Create .env file
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env

# Edit .env and add:
# REACT_APP_API_URL=http://localhost:5000/api

# Start frontend
npm start
```

**✓ Frontend should open on: http://localhost:3000**

---

## Step 4: Create Admin Account (2 minutes)

1. Go to: http://localhost:3000/admin/login
2. Click "Register here"
3. Enter any username (min 4 characters)
4. Enter password (min 6 characters)
5. Click "Create Account"
6. You're now logged in as admin!

---

## Step 5: Add Your First Product (2 minutes)

1. Go to Dashboard → "Manage Products"
2. Click "+ Add Product"
3. Fill in:
   - Name: "Red Roses Bouquet"
   - Price: 299
   - Category: "bouquet"
   - Description: "Beautiful handmade bouquet"
   - Upload an image (any flower image)
4. Click "Add Product"
5. Done! Your product appears on the website

---

## Step 6: Test the Website (2 minutes)

### Customer Flow
1. Go to http://localhost:3000
2. Click "Shop Now"
3. Select a product
4. Click "Buy Now"
5. Fill checkout form
6. Upload any image as payment proof
7. Submit order

### Admin Flow
1. Go to Dashboard
2. See pending orders
3. Click "Verify Orders"
4. View payment proof
5. Click "Approve Order"
6. Customer will see "Order Confirmed"

---

## 📋 Checklist

- [ ] MongoDB Atlas account created
- [ ] Cloudinary account created
- [ ] Backend .env file created with credentials
- [ ] Backend running on localhost:5000
- [ ] Frontend .env file created
- [ ] Frontend running on localhost:3000
- [ ] Admin account created
- [ ] First product added
- [ ] Test order completed

---

## 🔧 Customize for Your Business

### 1. Update Business Info
- Open `client/src/pages/Contact.js`
- Change email, phone, address
- Update business hours

### 2. Update UPI ID
- Open `client/src/pages/Checkout.js`
- Find "yourbusiness@upi"
- Replace with your actual UPI ID

### 3. Change Colors (Optional)
- Open `client/src/styles/global.css`
- Look for `--primary-dark: #f06292`
- Change to your preferred color
- All colors will update automatically

### 4. Add Business Logo/Images
- Update the flower emoji in Header
- Add your actual business image

---

## 📱 View on Mobile

1. Get your computer's IP address:
   ```
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```

2. On your phone, visit:
   ```
   http://YOUR_IP:3000
   ```

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"
**Solution:**
- Check MongoDB connection string in .env
- Ensure username:password are correct
- Check IP whitelist: MongoDB Atlas → Network Access → Add current IP

### Issue: "Cloudinary upload fails"
**Solution:**
- Verify Cloudinary credentials in .env
- Check image format (jpg, png, gif supported)
- Ensure image is < 5MB

### Issue: "Port 5000 or 3000 already in use"
**Solution:**
```bash
# Windows - Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux - Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### Issue: "npm command not found"
**Solution:**
- Install Node.js from nodejs.org
- Restart your computer
- Try again

---

## 🚀 Next Steps

### Deploy to Internet (Free Options)

**Backend:**
- Render.com (free tier)
- Railway.app (free tier)
- Vercel (free tier)

**Frontend:**
- Vercel (free tier)
- Netlify (free tier)
- GitHub Pages

### Improve Your Business
- Add more products
- Customize order messages
- Add business story/images
- Setup email notifications
- Accept more payment methods

---

## 💡 Pro Tips

1. **Backup regularly:** Export your MongoDB data
2. **Monitor orders:** Check dashboard daily
3. **Update inventory:** Keep stock numbers updated
4. **Customer communication:** Respond to orders quickly
5. **Product quality:** Use high-quality images

---

## 📞 Need Help?

- Check the main README.md for detailed docs
- Review API endpoints in README
- Check console errors (F12 → Console)
- Verify all credentials are correct
- Ensure internet connection is stable

---

## 🎉 You're Ready!

Your e-commerce website is now running. Start accepting orders and growing your business!

**Good luck! 🌸**
