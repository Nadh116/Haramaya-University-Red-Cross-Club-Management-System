# Haramaya University Red Cross Club Management System

A complete web-based management system for digitizing and managing all activities of the Haramaya University Red Cross Club.

## Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose ODM
- JWT Authentication
- bcrypt for password hashing
- RESTful API architecture

### Frontend
- React.js (Functional Components)
- React Router
- Axios
- Context API
- Tailwind CSS
- Responsive design

## Project Structure

```
haramaya-redcross/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
└── README.md
```

## Setup Instructions

### Backend Setup
1. Navigate to backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create `.env` file with required environment variables
4. Start server: `npm run dev`

### Frontend Setup
1. Navigate to frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start development server: `npm start`

## Features

- User Authentication & Authorization (Role-based)
- Member Management
- Volunteer Management
- Event Management
- Donation Management
- Announcement System
- Dashboard & Reports
- Multi-campus support (Main, Technology, Veterinary)

## User Roles

1. **System Administrator** - Full system access
2. **Club Officer** - Manage events, volunteers, donations
3. **Member/Volunteer** - View events, apply for volunteering
4. **Public Visitor** - View public information, register

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/members` - Get members
- `POST /api/events` - Create event
- `POST /api/donations` - Record donation
- `GET /api/announcements` - Get announcements

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- Role-based access control
- Environment variables for sensitive data