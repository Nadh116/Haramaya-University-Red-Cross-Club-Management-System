# Login Troubleshooting Guide

## 🔐 Admin Credentials
- **Email:** `admin@haramaya.edu.et`
- **Password:** `admin123`

## 🧪 Testing Methods

### Method 1: Direct API Test (WORKING ✅)
```bash
# Test login API directly
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@haramaya.edu.et","password":"admin123"}'
```

### Method 2: Test HTML File
1. Open `test-login.html` in your browser
2. Click "Test Login" button
3. Should show success with user details

### Method 3: React Frontend
1. Go to: `http://localhost:3002/login`
2. Enter: `admin@haramaya.edu.et`
3. Enter: `admin123`
4. Click Login

## 🔍 Common Issues & Solutions

### Issue 1: "Invalid credentials"
**Solution:** Make sure database is seeded
```bash
cd backend
node utils/seedDatabase.js
```

### Issue 2: Frontend not loading
**Check:**
- Frontend running on port 3002: `http://localhost:3002`
- Backend running on port 5000: `http://localhost:5000/api/health`

### Issue 3: CORS errors
**Check backend CORS config in server.js:**
```javascript
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3002'],
    credentials: true
}));
```

### Issue 4: Network errors
**Check:**
1. Both servers running:
   ```bash
   # Backend
   cd backend && npm run dev
   
   # Frontend  
   cd frontend && npm start
   ```

2. Ports not blocked by firewall

## 🚀 Quick Test Commands

### Test Backend Health
```bash
curl http://localhost:5000/api/health
```

### Test Frontend Access
```bash
curl http://localhost:3002
```

### Test Login API
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@haramaya.edu.et","password":"admin123"}'
```

## 📊 Expected Responses

### Successful Login Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "firstName": "System",
    "lastName": "Administrator", 
    "email": "admin@haramaya.edu.et",
    "role": "admin"
  }
}
```

### Failed Login Response:
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

## 🛠️ Debug Steps

1. **Check Backend Logs:**
   - Look for login attempts in backend console
   - Check for any error messages

2. **Check Frontend Console:**
   - Open browser DevTools (F12)
   - Look for network errors or JavaScript errors

3. **Verify Database:**
   - Check if admin user exists
   - Verify password hash is correct

4. **Test Network:**
   - Ensure no proxy/VPN blocking requests
   - Check if ports 3002 and 5000 are accessible

## 🔧 Reset Instructions

If login still doesn't work:

1. **Reset Database:**
   ```bash
   cd backend
   node utils/seedDatabase.js
   ```

2. **Restart Servers:**
   ```bash
   # Stop both servers (Ctrl+C)
   # Then restart:
   cd backend && npm run dev
   cd frontend && npm start
   ```

3. **Clear Browser Cache:**
   - Clear localStorage
   - Hard refresh (Ctrl+Shift+R)

## 📞 Alternative Test Accounts

If admin doesn't work, try these:

**Officer Account:**
- Email: `meron.tadesse@haramaya.edu.et`
- Password: `officer123`

**Member Account:**
- Email: `sara.ahmed@student.haramaya.edu.et`  
- Password: `member123`

## ✅ Verification Checklist

- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 3002
- [ ] Database seeded with admin user
- [ ] No CORS errors in browser console
- [ ] Network requests reaching backend
- [ ] Correct credentials entered
- [ ] No JavaScript errors in console