# 🚀 Complete Deployment Guide

## Overview
This guide will help you deploy both backend and frontend to Vercel in the correct order.

## Prerequisites
- GitHub repository with your code
- Vercel account
- MongoDB Atlas database (or other MongoDB hosting)

## 🔥 DEPLOYMENT STEPS

### STEP 1: Deploy Backend First

1. **Run the backend deployment script:**
   ```powershell
   .\deploy-backend.ps1
   ```

2. **Or manually deploy backend:**
   ```bash
   cd backend
   vercel login
   vercel --prod
   ```

3. **Set Backend Environment Variables in Vercel:**
   - Go to Vercel Dashboard → Your Backend Project → Settings → Environment Variables
   - Add these variables:
     ```
     MONGODB_URI=your-mongodb-connection-string
     JWT_SECRET=your-jwt-secret-key
     NODE_ENV=production
     PORT=5000
     ```

4. **Test Backend:**
   - Visit: `https://your-backend-url.vercel.app/api/health`
   - Should return: `{"success": true, "message": "Haramaya Red Cross API is running"}`

### STEP 2: Deploy Frontend

1. **Copy your backend URL** from Vercel dashboard

2. **Run the frontend deployment script:**
   ```powershell
   .\deploy-frontend.ps1
   ```

3. **Or manually deploy frontend:**
   ```bash
   vercel login
   vercel --prod
   ```

4. **Set Frontend Environment Variables in Vercel:**
   - Go to Vercel Dashboard → Your Frontend Project → Settings → Environment Variables
   - Add this variable:
     ```
     REACT_APP_API_URL=https://your-backend-url.vercel.app/api
     ```

5. **Redeploy Frontend:**
   - After adding environment variables, redeploy to apply them
   - Go to Deployments tab and click "Redeploy"

### STEP 3: Test Complete Application

1. **Visit your frontend URL**
2. **Test login with admin credentials:**
   - Email: `admin@haramaya.edu.et`
   - Password: `admin123`
3. **Test admin features:**
   - Contact management: `/contact/admin`
   - Gallery management: `/gallery/admin`
   - User management: `/admin/users`

## 🔧 Environment Variables Reference

### Backend (.env)
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-very-long-and-secure-jwt-secret-key
JWT_EXPIRE=30d
BCRYPT_SALT_ROUNDS=12

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@haramayaredcross.org
ADMIN_EMAIL=admin@haramayaredcross.org
```

### Frontend (Vercel Environment Variables)
```
REACT_APP_API_URL=https://your-backend-url.vercel.app/api
```

## 🚨 Troubleshooting

### Backend Issues
- **MongoDB Connection:** Ensure MONGODB_URI is correct
- **CORS Errors:** Check if frontend URL is in CORS origins
- **API Not Found:** Verify routes are working with `/api/health`

### Frontend Issues
- **API Connection:** Verify REACT_APP_API_URL is set correctly
- **Build Errors:** Check for TypeScript/JavaScript errors
- **Authentication:** Ensure backend is deployed and working

### Common Fixes
1. **Clear Vercel Cache:** Redeploy with "Clear Cache" option
2. **Check Logs:** View function logs in Vercel dashboard
3. **Test Locally:** Ensure everything works locally first

## 📋 Deployment Checklist

### Backend Deployment
- [ ] Backend deployed to Vercel
- [ ] Environment variables set
- [ ] `/api/health` endpoint working
- [ ] Database connected
- [ ] Admin user exists in database

### Frontend Deployment
- [ ] Frontend deployed to Vercel
- [ ] REACT_APP_API_URL environment variable set
- [ ] Frontend can reach backend API
- [ ] Login functionality working
- [ ] Admin features accessible

### Final Testing
- [ ] Complete user registration flow
- [ ] Admin login and dashboard access
- [ ] Contact form submission
- [ ] Gallery image upload
- [ ] All admin management features

## 🎉 Success!

If all steps are completed successfully, you should have:
- ✅ Backend API running on Vercel
- ✅ Frontend app running on Vercel
- ✅ Database connected and seeded
- ✅ Authentication working
- ✅ All admin features functional

## 📞 Support

If you encounter issues:
1. Check Vercel function logs
2. Test API endpoints directly
3. Verify environment variables
4. Ensure database is accessible
5. Check CORS configuration