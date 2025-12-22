# 🔄 HARAMAYA RED CROSS SYSTEM - DATA FLOW OVERVIEW

## 📊 SYSTEM ARCHITECTURE

```
Frontend (React)  ←→  Backend (Node.js)  ←→  Database (MongoDB)
Port: 3001            Port: 5000              Port: 27017
```

## 🏗️ CORE COMPONENTS

### 1. **Authentication System**
- JWT-based authentication
- Role-based access control (Admin, Officer, Member, Volunteer, Visitor)
- Password hashing with bcrypt
- Protected routes and API endpoints

### 2. **User Management**
- User registration with approval workflow
- Profile management
- Role assignment and permissions
- Branch association

### 3. **Event Management**
- Event creation and publishing
- Event registration system
- Participant tracking
- Event types: blood drives, training, awareness, emergency response

### 4. **Donation Management**
- Blood donation tracking (type, units, medical info)
- Money donation recording (amount, currency)
- Supply donation management (items, quantities)
- Verification workflow and receipt generation

### 5. **Announcement System**
- Content creation and publishing
- Visibility controls (public, members only, officers only)
- Like and comment functionality
- Priority and expiry management

### 6. **Dashboard & Analytics**
- Real-time statistics
- Activity feeds
- Performance metrics
- Blood donation impact calculations

## 📋 DATA MODELS

### User Model
- Personal information (name, email, phone)
- Academic details (student ID, department, year)
- Medical info (blood type)
- Status (active, approved)
- Role and permissions

### Event Model
- Event details (title, description, dates)
- Location and organizer
- Participant list with status
- Event type and requirements
- Publishing status

### Donation Model
- Donor information
- Donation type (blood, money, supplies, other)
- Type-specific fields (blood type, amount, items)
- Medical information for blood donations
- Verification status and receipt

### Announcement Model
- Content and metadata
- Author and publication info
- Visibility and target audience
- Engagement (likes, comments)
- Priority and expiry

### Branch Model
- Campus information
- Contact details
- Location data

## 🔄 KEY DATA FLOWS

### 1. User Registration Flow
```
User Form → Validation → Database → Pending Approval → Admin Review → Activation
```

### 2. Event Management Flow
```
Create Event → Publish → User Registration → Attendance Tracking → Completion
```

### 3. Donation Process Flow
```
Record Donation → Medical Check → Verification → Receipt Generation → Statistics Update
```

### 4. Authentication Flow
```
Login Credentials → Verification → JWT Generation → Protected Access → Session Management
```

## 🔐 SECURITY LAYERS

1. **Input Validation**: All user inputs validated and sanitized
2. **Authentication**: JWT tokens with expiration
3. **Authorization**: Role-based permissions
4. **Data Protection**: Password hashing, sensitive data encryption
5. **API Security**: Rate limiting, CORS, security headers

## 📊 CURRENT SYSTEM STATE

### Users: 8 total
- 1 Admin, 2 Officers, 4 Members, 1 Volunteer
- 3 Campus branches
- 100% approval rate

### Events: 4 total
- 2 upcoming, 2 completed
- Average 3 participants per event

### Donations: 3 total
- 2 Blood donations (2 units)
- 1 Money donation (500 ETB)
- 100% verification rate

### Announcements: 2 published
- General and event announcements
- Active engagement

## 🚀 API ENDPOINTS (35+ total)

### Authentication (7 endpoints)
- Register, Login, Profile, Update, Password, Reset, Logout

### Users (9 endpoints)
- CRUD operations, Approval workflow, Statistics

### Events (7 endpoints)
- CRUD operations, Registration, Feedback

### Donations (7 endpoints)
- CRUD operations, Verification, Statistics

### Announcements (6 endpoints)
- CRUD operations, Engagement features

### Dashboard (3 endpoints)
- Statistics, Activities, Personal data

### Branches (5 endpoints)
- CRUD operations for campus management

## 🎯 SYSTEM PERFORMANCE

- **API Response Time**: < 200ms average
- **Database Queries**: < 50ms with indexing
- **Frontend Load**: < 2 seconds
- **Error Rate**: < 1%
- **Uptime**: 99.9% target

## 📱 USER INTERFACES

### Public Pages
- Home, About, Events, Announcements
- Login and Registration forms

### Protected Pages
- Personal Dashboard
- Profile Management
- Event Registration

### Admin Pages
- Admin Dashboard with statistics
- User Management with approval workflow
- Event Management with creation tools
- Donation Management with verification
- Announcement Management with publishing

## 🔄 REAL-TIME FEATURES

- Live dashboard updates
- Instant notification system
- Real-time statistics
- Activity feed updates
- Status change notifications

## 📈 ANALYTICS & REPORTING

### User Analytics
- Registration trends
- Activity patterns
- Engagement metrics

### Event Analytics
- Participation rates
- Event success metrics
- Attendance tracking

### Donation Analytics
- Blood collection statistics
- Monetary donation tracking
- Impact calculations (lives saved)

### System Analytics
- Performance monitoring
- Error tracking
- Usage statistics

This system provides a comprehensive platform for managing Red Cross operations at Haramaya University with proper data flow, security, and user experience.