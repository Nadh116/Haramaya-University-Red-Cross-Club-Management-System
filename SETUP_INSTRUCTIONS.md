# Haramaya University Red Cross Club Management System - Setup Instructions

## 🚀 Quick Start Guide

This guide will help you set up and run the complete Haramaya University Red Cross Club Management System on your local machine.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v16.0.0 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v5.0 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/downloads)
- **Code Editor** (VS Code recommended) - [Download here](https://code.visualstudio.com/)

## 🛠️ Installation Steps

### 1. Clone or Download the Project

If you have the project files, ensure your directory structure looks like this:

```
haramaya-redcross/
├── backend/
├── frontend/
├── README.md
└── SETUP_INSTRUCTIONS.md
```

### 2. Backend Setup

#### 2.1 Navigate to Backend Directory
```bash
cd backend
```

#### 2.2 Install Dependencies
```bash
npm install
```

#### 2.3 Environment Configuration
Create a `.env` file in the backend directory:

```bash
# Copy the example file
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/haramaya_redcross
JWT_SECRET=your_super_secret_jwt_key_make_it_very_long_and_secure_for_production
JWT_EXPIRE=30d
BCRYPT_SALT_ROUNDS=12

# Email Configuration (Optional - for production)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# File Upload
MAX_FILE_SIZE=5000000
UPLOAD_PATH=./uploads
```

#### 2.4 Start MongoDB
Make sure MongoDB is running on your system:

**Windows:**
```bash
# If MongoDB is installed as a service
net start MongoDB

# Or run manually
mongod
```

**macOS/Linux:**
```bash
# If installed via Homebrew (macOS)
brew services start mongodb-community

# Or run manually
mongod
```

#### 2.5 Seed the Database (Optional but Recommended)
```bash
node utils/seedDatabase.js
```

This will create sample data including:
- Admin user: `admin@haramaya.edu.et` / `admin123`
- Officer user: `meron.tadesse@haramaya.edu.et` / `officer123`
- Member user: `sara.ahmed@student.haramaya.edu.et` / `member123`
- Sample branches, events, and announcements

#### 2.6 Start the Backend Server
```bash
# Development mode with auto-restart
npm run dev

# Or production mode
npm start
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

#### 3.1 Open New Terminal and Navigate to Frontend Directory
```bash
cd frontend
```

#### 3.2 Install Dependencies
```bash
npm install
```

#### 3.3 Environment Configuration (Optional)
Create a `.env` file in the frontend directory if you need custom API URL:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

#### 3.4 Start the Frontend Development Server
```bash
npm start
```

The frontend will start on `http://localhost:3000` and automatically open in your browser.

## 🎯 Testing the Application

### 1. Access the Application
Open your browser and go to `http://localhost:3000`

### 2. Test User Accounts
Use these pre-seeded accounts to test different user roles:

**System Administrator:**
- Email: `admin@haramaya.edu.et`
- Password: `admin123`
- Access: Full system access

**Club Officer:**
- Email: `meron.tadesse@haramaya.edu.et`
- Password: `officer123`
- Access: Event management, user approval, donations

**Member/Volunteer:**
- Email: `sara.ahmed@student.haramaya.edu.et`
- Password: `member123`
- Access: Event registration, profile management

### 3. Test Registration
- Go to `/register` to create a new account
- Fill in the registration form
- New members will need approval from admin/officer

## 📁 Project Structure

### Backend Structure
```
backend/
├── config/          # Database configuration
├── controllers/     # Route controllers
├── middleware/      # Custom middleware (auth, validation, etc.)
├── models/          # MongoDB/Mongoose models
├── routes/          # API routes
├── utils/           # Utility functions and database seeder
├── .env.example     # Environment variables template
├── package.json     # Dependencies and scripts
└── server.js        # Main server file
```

### Frontend Structure
```
frontend/
├── public/          # Static files
├── src/
│   ├── components/  # Reusable React components
│   ├── context/     # React Context (Auth, etc.)
│   ├── pages/       # Page components
│   ├── services/    # API service functions
│   ├── utils/       # Utility functions
│   ├── App.js       # Main App component
│   └── index.js     # Entry point
├── package.json     # Dependencies and scripts
└── tailwind.config.js # Tailwind CSS configuration
```

## 🔧 Development Tools

### Recommended VS Code Extensions
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- MongoDB for VS Code
- Thunder Client (for API testing)
- Prettier - Code formatter

### API Testing
Use tools like:
- **Thunder Client** (VS Code extension)
- **Postman** - [Download here](https://www.postman.com/)
- **Insomnia** - [Download here](https://insomnia.rest/)

Base API URL: `http://localhost:5000/api`

### Key API Endpoints
```
Authentication:
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me

Users:
GET  /api/users
POST /api/users
PUT  /api/users/:id/approve

Events:
GET  /api/events
POST /api/events
POST /api/events/:id/register

Donations:
GET  /api/donations
POST /api/donations
PUT  /api/donations/:id/verify

Announcements:
GET  /api/announcements
POST /api/announcements
```

## 🚨 Troubleshooting

### Common Issues and Solutions

#### 1. MongoDB Connection Error
**Error:** `MongoNetworkError: failed to connect to server`

**Solutions:**
- Ensure MongoDB is running: `mongod`
- Check if MongoDB service is started
- Verify the connection string in `.env`
- Try: `mongodb://127.0.0.1:27017/haramaya_redcross`

#### 2. Port Already in Use
**Error:** `EADDRINUSE: address already in use :::5000`

**Solutions:**
- Kill the process using the port: `npx kill-port 5000`
- Change the port in `.env`: `PORT=5001`
- Find and stop the conflicting process

#### 3. JWT Secret Error
**Error:** `secretOrPrivateKey has a value`

**Solution:**
- Ensure JWT_SECRET is set in `.env`
- Make it at least 32 characters long

#### 4. CORS Issues
**Error:** `Access to fetch blocked by CORS policy`

**Solutions:**
- Ensure backend is running on port 5000
- Check CORS configuration in `server.js`
- Verify frontend proxy in `package.json`

#### 5. Module Not Found Errors
**Error:** `Module not found: Can't resolve`

**Solutions:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Clear npm cache: `npm cache clean --force`

## 🔒 Security Notes

### For Development
- Default JWT secret is provided for development
- Sample users have simple passwords
- CORS is configured for localhost

### For Production
- Change all default passwords
- Use strong JWT secret (32+ characters)
- Configure proper CORS origins
- Set up SSL/HTTPS
- Use environment variables for all secrets
- Enable MongoDB authentication
- Set up proper logging and monitoring

## 📚 Additional Resources

### Documentation
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Learning Resources
- [Node.js Tutorial](https://nodejs.org/en/docs/guides/)
- [React Tutorial](https://reactjs.org/tutorial/tutorial.html)
- [MongoDB University](https://university.mongodb.com/)

## 🤝 Support

If you encounter any issues:

1. Check this troubleshooting guide
2. Verify all prerequisites are installed
3. Ensure all environment variables are set correctly
4. Check that both frontend and backend servers are running
5. Look at browser console and terminal for error messages

## 🎉 Success!

If everything is set up correctly, you should see:
- Backend server running on `http://localhost:5000`
- Frontend application on `http://localhost:3000`
- Ability to login with the provided test accounts
- Full navigation through the application

The system is now ready for development and testing!

---

**Happy Coding! 🚀**

*Haramaya University Red Cross Club Management System*