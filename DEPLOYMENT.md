# Deployment Guide

## 🚀 Deploy Your E-Commerce Website

This guide covers deploying both frontend and backend for production.

---

## Option 1: Deploy with Vercel (Easiest)

### Deploy Frontend to Vercel

**Prerequisites:**
- Vercel account (free at vercel.com)
- GitHub account with your code

**Steps:**

1. **Push to GitHub**
```bash
cd handmade-flowers
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/handmade-flowers.git
git push -u origin main
```

2. **Import to Vercel**
- Go to vercel.com
- Click "New Project"
- Select your GitHub repository
- Configure:
  - Framework: Next.js (or React)
  - Root directory: `client`
  - Environment variables:
    - `REACT_APP_API_URL` = your backend URL

3. **Deploy**
- Click "Deploy"
- Your frontend is live!

---

## Option 2: Deploy Backend to Render

### Deploy Node.js Backend to Render

**Steps:**

1. **Create Render Account**
- Go to render.com
- Sign up (free)

2. **Create New Web Service**
- Click "New+" → "Web Service"
- Connect GitHub repository
- Configuration:
  - Name: `handmade-flowers-api`
  - Runtime: Node
  - Build command: `npm install`
  - Start command: `node server.js`
  - Root directory: `server`

3. **Add Environment Variables**
In Render dashboard:
```
MONGODB_URI = your_mongodb_connection_string
JWT_SECRET = your_secret_key
CLOUDINARY_CLOUD_NAME = your_cloud_name
CLOUDINARY_API_KEY = your_key
CLOUDINARY_API_SECRET = your_secret
FRONTEND_URL = https://your-vercel-url.vercel.app
```

4. **Deploy**
- Click "Create Web Service"
- Render builds and deploys automatically
- You get a live URL: `https://your-app.onrender.com`

---

## Option 3: Deploy to Railway (Good Alternative)

### Backend on Railway

**Steps:**

1. **Create Railway Account**
- Go to railway.app
- Sign up with GitHub

2. **Create New Project**
- Click "Create New"
- Select "GitHub Repo"
- Choose your repository

3. **Add MongoDB**
- In project, click "Add"
- Select "MongoDB"
- Railway provisions free tier

4. **Configure Variables**
- Right-click service → "Variables"
- Add all environment variables

5. **Deploy**
- Automatic from GitHub pushes

---

## Option 4: Deploy on Heroku

### Deploy Backend to Heroku

**Steps:**

1. **Install Heroku CLI**
```bash
# Windows: Download from heroku.com
# Mac: brew install heroku/brew/heroku
# Linux: npm install -g heroku
```

2. **Login to Heroku**
```bash
heroku login
```

3. **Create Procfile**
In `server` directory, create file `Procfile`:
```
web: node server.js
```

4. **Deploy**
```bash
cd server
heroku create your-app-name
git push heroku main
```

5. **Add Variables**
```bash
heroku config:set MONGODB_URI=your_mongodb_url
heroku config:set JWT_SECRET=your_secret
# ... add all other variables
```

---

## Post-Deployment Checklist

After deploying, verify everything works:

### 1. Test APIs
```bash
# Replace with your URL
curl https://your-backend-url/api/health

# Should return: { "message": "Server is running" }
```

### 2. Test Frontend
- Visit your deployed frontend URL
- Check all pages load
- Test product browsing
- Test checkout flow

### 3. Test Admin Panel
- Login with admin credentials
- Add a test product
- Create a test order
- Approve/reject order

### 4. Check Database
- Verify MongoDB data is saving
- Check Cloudinary uploads working
- Confirm order images saved

### 5. Monitor Errors
- Check Vercel deployment logs
- Check Render/Railway logs
- Watch for any error patterns

---

## Update Frontend API URL

After backend deployment, update frontend:

**client/.env production**
```
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

Or in Vercel dashboard:
- Go to Settings
- Environment Variables
- Update `REACT_APP_API_URL`
- Redeploy

---

## Domain Setup

### Buy Custom Domain
1. Buy from: GoDaddy, Namecheap, or Domain.com
2. Cost: Usually ₹200-500/year

### Connect Domain to Vercel
1. In Vercel project → Settings → Domains
2. Add your domain
3. Follow DNS configuration
4. Usually takes 15-30 minutes

### Connect Domain to Backend
1. Update API URL in frontend to use domain
2. Get SSL certificate (free on Render/Railway)
3. Update FRONTEND_URL in backend .env

---

## Database Backup

### Backup MongoDB Data

```bash
# Export data
mongodump --uri="your_mongodb_connection_string" --out=./backup

# Import data
mongorestore --uri="your_mongodb_connection_string" ./backup
```

Or use MongoDB Atlas:
1. Atlas → Backup → Snapshots
2. Create backup
3. Download/restore as needed

---

## Scaling for Growth

### If Getting More Traffic

**Frontend:**
- Vercel auto-scales (included)
- Use CDN (Vercel provides)
- Optimize images

**Backend:**
- Upgrade Render/Railway tier
- Add Redis caching
- Database indexes (MongoDB)
- Load balancing

**Database:**
- Upgrade MongoDB tier
- Add read replicas
- Archive old orders

---

## Monitor Production

### Tools to Use

1. **Monitor Uptime**
   - UptimeRobot (free)
   - Pingdom

2. **Monitor Errors**
   - Sentry (free tier)
   - Rollbar

3. **Monitor Performance**
   - Google PageSpeed
   - Lighthouse
   - GTmetrix

4. **Monitor Users**
   - Google Analytics
   - Mixpanel

---

## Disaster Recovery

### Regular Backups
```bash
# Every week
mongodump --uri="..." --out=./backup-$(date +%Y%m%d)
```

### Version Control
- Always use Git
- Tag releases: `v1.0.0`
- Keep changelog

### Documentation
- Document all changes
- Keep admin runbooks
- List all credentials (secure)

---

## SSL/HTTPS

Most platforms provide free SSL:
- Vercel: Automatic
- Render: Automatic
- Railway: Automatic
- Heroku: Auto for .herokuapp.com

For custom domains: LetsEncrypt (free)

---

## Cost Estimates

### Free Tier
- Frontend (Vercel): Free
- Backend (Render): Free (limited)
- Database (MongoDB): Free (512MB)
- Images (Cloudinary): Free (10GB)
- **Total: ₹0**

### Paid Tier (Recommended)
- Frontend (Vercel): $20/month
- Backend (Render): $7/month
- Database (MongoDB): $57/month
- Images (Cloudinary): $0
- **Total: ₹2,000/month**

---

## Troubleshooting Deployment

### Issue: "Cannot find module"
**Solution:**
```bash
npm install
npm list
```

### Issue: "MongoDB connection fails"
**Solution:**
- Check connection string
- Verify IP whitelist
- Check database exists

### Issue: "Cloudinary fails"
**Solution:**
- Check API credentials
- Verify folder settings
- Check file upload limits

### Issue: "CORS errors in production"
**Solution:**
- Update FRONTEND_URL in backend
- Check allowed origins
- Verify domain matches

---

## After Going Live

1. Share with customers
2. Monitor daily for issues
3. Update inventory regularly
4. Respond to orders quickly
5. Collect customer feedback
6. Plan improvements

---

## Next Steps

1. Choose deployment platform
2. Set up accounts
3. Configure environment variables
4. Deploy and test thoroughly
5. Set up domain and SSL
6. Monitor and optimize
7. Start taking orders!

---

**Your e-commerce business is now online! 🚀🌸**
