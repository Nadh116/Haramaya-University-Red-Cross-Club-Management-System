# Deployment Guide

## Vercel Deployment (Frontend Only)

This guide explains how to deploy the Haramaya Red Cross frontend to Vercel.

### Prerequisites

1. **Backend Deployment**: Deploy your backend to a service like Railway, Render, or Heroku first
2. **Environment Variables**: Get your backend API URL

### Step 1: Prepare for Deployment

The project is now configured with:
- ✅ Root `package.json` for Vercel compatibility
- ✅ `vercel.json` configuration
- ✅ `.vercelignore` to exclude backend files
- ✅ Production environment configuration

### Step 2: Deploy to Vercel

1. **Connect to Vercel:**
   ```bash
   # Install Vercel CLI (if not installed)
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel
   ```

2. **Set Environment Variables in Vercel Dashboard:**
   - Go to your project settings in Vercel
   - Add environment variable:
     - Name: `REACT_APP_API_URL`
     - Value: `https://your-backend-url.com/api`

### Step 3: Backend Deployment Options

#### Option A: Railway (Recommended)
1. Connect your GitHub repo to Railway
2. Select the `backend` folder as root directory
3. Set environment variables from `backend/.env.example`

#### Option B: Render
1. Create new Web Service
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Set root directory: `backend`

#### Option C: Heroku
1. Create new app
2. Set buildpack to Node.js
3. Configure environment variables
4. Deploy from GitHub

### Step 4: Update API URL

After backend deployment, update the frontend:

1. **In Vercel Dashboard:**
   - Go to Settings → Environment Variables
   - Update `REACT_APP_API_URL` with your actual backend URL

2. **Redeploy:**
   ```bash
   vercel --prod
   ```

### Step 5: Test Deployment

1. **Frontend**: Visit your Vercel URL
2. **Backend**: Test API endpoints
3. **Integration**: Test login and admin features

### Environment Variables Reference

#### Frontend (.env.production)
```
REACT_APP_API_URL=https://your-backend-url.com/api
GENERATE_SOURCEMAP=false
```

#### Backend (.env)
```
NODE_ENV=production
PORT=5000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
# ... other variables from .env.example
```

### Troubleshooting

#### Build Errors
- Ensure all dependencies are in `frontend/package.json`
- Check for TypeScript errors
- Verify environment variables

#### API Connection Issues
- Verify `REACT_APP_API_URL` is correct
- Check CORS configuration in backend
- Test backend endpoints directly

#### Authentication Issues
- Ensure JWT_SECRET is set in backend
- Check token expiration settings
- Verify user roles and permissions

### Production Checklist

- [ ] Backend deployed and accessible
- [ ] Database connected and seeded
- [ ] Environment variables configured
- [ ] CORS properly configured
- [ ] Admin user created
- [ ] Frontend deployed to Vercel
- [ ] API URL updated in Vercel
- [ ] Login functionality tested
- [ ] Admin features tested

### Security Notes

- Never commit `.env` files
- Use strong JWT secrets in production
- Enable HTTPS for both frontend and backend
- Configure proper CORS origins
- Set secure headers (already configured in vercel.json)

### Support

If you encounter issues:
1. Check Vercel build logs
2. Check backend logs
3. Test API endpoints with Postman
4. Verify environment variables