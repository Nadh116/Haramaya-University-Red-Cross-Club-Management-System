# User Registration & Approval Workflow

## Overview
The Haramaya Red Cross system implements a comprehensive user registration and approval workflow to ensure proper vetting of members and volunteers.

## 🔄 Complete Workflow Process

### 1. User Registration Process

#### Frontend Registration Form (`/register`)
- **Location**: `frontend/src/pages/auth/Register.js`
- **Access**: Public (anyone can register)
- **Required Information**:
  - **Personal**: First Name, Last Name, Email, Phone
  - **Academic**: Campus Branch, Student ID (optional), Department, Year of Study
  - **Medical**: Blood Type
  - **Security**: Password (with validation)

#### Registration Form Features:
- ✅ Real-time form validation
- ✅ Password strength requirements
- ✅ Campus branch selection dropdown
- ✅ Blood type selection
- ✅ Student ID validation
- ✅ Terms and conditions acceptance

#### Backend Registration Logic (`POST /api/auth/register`)
- **Controller**: `backend/controllers/authController.js`
- **Process**:
  1. Validates branch exists
  2. Sets default role based on student ID:
     - **With Student ID** → `member` role
     - **Without Student ID** → `visitor` role
  3. Creates user with `isApproved: false`, `isActive: true`
  4. Hashes password automatically via User model middleware
  5. Returns JWT token for immediate login

### 2. User Status After Registration

```javascript
// New user default status
{
  isApproved: false,  // Requires admin/officer approval
  isActive: true,     // Can login but limited access
  role: 'member',     // Based on student ID presence
  approvedBy: null,   // Will be set when approved
  approvedAt: null    // Will be set when approved
}
```

### 3. Admin/Officer Approval Process

#### User Management Interface (`/admin/users`)
- **Location**: `frontend/src/pages/admin/UserManagement.js`
- **Access**: Admin and Officer roles only
- **Features**:
  - ✅ View all users with filtering
  - ✅ Search by name, email, or student ID
  - ✅ Filter by role, branch, approval status
  - ✅ Paginated results
  - ✅ Pending approvals highlighted

#### Pending Approvals View
- **API Endpoint**: `GET /api/users/pending`
- **Shows**: Users with `isApproved: false` and `isActive: true`
- **Filters**: Only `member` and `volunteer` roles need approval
- **Admin/Officer roles**: Auto-approved during creation

#### Approval Actions Available:

##### ✅ Approve User (`PUT /api/users/:id/approve`)
```javascript
// What happens when approved:
{
  isApproved: true,
  approvedBy: adminUserId,
  approvedAt: new Date(),
  // User gains full system access
}
```

##### ❌ Reject User (`PUT /api/users/:id/reject`)
```javascript
// What happens when rejected:
{
  isApproved: false,
  isActive: false,      // User cannot login
  approvedBy: null,
  approvedAt: null
}
```

##### 🗑️ Deactivate User (`DELETE /api/users/:id`)
```javascript
// Soft delete - deactivates user:
{
  isActive: false  // User cannot login
}
```

### 4. User Access Levels

#### Before Approval (`isApproved: false`)
- ✅ Can login to system
- ✅ Can view public pages (Home, Events, Announcements)
- ❌ Limited dashboard access
- ❌ Cannot register for events
- ❌ Cannot make donations
- ❌ Cannot access member-only features

#### After Approval (`isApproved: true`)
- ✅ Full system access
- ✅ Complete dashboard functionality
- ✅ Event registration
- ✅ Donation capabilities
- ✅ Profile management
- ✅ All member/volunteer features

### 5. Role-Based Approval Authority

#### Admin Role
- ✅ Can approve/reject all user types
- ✅ Can deactivate any user
- ✅ Can view all user statistics
- ✅ Full user management access

#### Officer Role
- ✅ Can approve/reject members and volunteers
- ✅ Can view pending approvals
- ✅ Limited user management access
- ❌ Cannot manage admin accounts

#### Member/Volunteer Roles
- ❌ No approval authority
- ✅ Can view their own profile
- ✅ Can update personal information

### 6. Technical Implementation

#### Database Schema (User Model)
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  role: ['admin', 'officer', 'member', 'volunteer', 'visitor'],
  studentId: String (optional, unique),
  phone: String,
  branch: ObjectId (ref: Branch),
  department: String,
  yearOfStudy: Number,
  bloodType: String,
  isActive: Boolean (default: true),
  isApproved: Boolean (default: false),
  approvedBy: ObjectId (ref: User),
  approvedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### API Endpoints
- `POST /api/auth/register` - User registration
- `GET /api/users` - List all users (admin/officer)
- `GET /api/users/pending` - Get pending approvals
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id/approve` - Approve user
- `PUT /api/users/:id/reject` - Reject user
- `DELETE /api/users/:id` - Deactivate user
- `GET /api/users/stats` - User statistics

### 7. Frontend Components

#### Registration Form Features
- **Validation**: Real-time form validation with error messages
- **Branch Selection**: Dynamic dropdown from database
- **Password Security**: Strength requirements and confirmation
- **User Experience**: Progressive form sections with clear labels

#### User Management Interface
- **Filtering**: Multiple filter options (role, branch, status)
- **Search**: Full-text search across user fields
- **Pagination**: Efficient handling of large user lists
- **Actions**: Quick approve/reject buttons with confirmations
- **Details Modal**: Complete user information display

### 8. Security Considerations

#### Password Security
- ✅ Minimum length requirements
- ✅ Complexity validation (uppercase, lowercase, numbers, symbols)
- ✅ Bcrypt hashing with salt rounds
- ✅ Password confirmation matching

#### Access Control
- ✅ JWT token-based authentication
- ✅ Role-based authorization middleware
- ✅ Protected routes for admin functions
- ✅ User session management

#### Data Validation
- ✅ Server-side validation for all inputs
- ✅ Email format validation
- ✅ Phone number format validation
- ✅ Student ID uniqueness checks
- ✅ Branch existence validation

### 9. User Experience Flow

```
1. User visits /register
   ↓
2. Fills comprehensive registration form
   ↓
3. Submits form → Account created (isApproved: false)
   ↓
4. User can login but sees "Pending Approval" status
   ↓
5. Admin/Officer sees user in pending approvals
   ↓
6. Admin/Officer reviews user information
   ↓
7. Admin/Officer approves or rejects
   ↓
8. User gains full access (if approved) or loses access (if rejected)
```

### 10. Monitoring & Statistics

#### Admin Dashboard Metrics
- Total users by role
- Pending approvals count
- Users by branch
- Approval rates
- Recent registrations

#### User Management Analytics
- Registration trends
- Approval processing times
- User activity levels
- Branch distribution

## 🚀 Testing the Workflow

### Manual Testing Steps:
1. **Register New User**: Visit http://localhost:3000/register
2. **Login as Admin**: Use admin@haramaya.edu.et / admin123
3. **View Pending**: Go to http://localhost:3000/admin/users
4. **Approve User**: Click approve button for pending user
5. **Verify Access**: Login as approved user to test full access

### Automated Testing:
Run the workflow test script:
```bash
cd backend
node test-user-registration-workflow.js
```

## 📋 Summary

The user registration and approval workflow ensures:
- ✅ Proper user vetting before full system access
- ✅ Role-based access control
- ✅ Comprehensive user information collection
- ✅ Efficient admin management interface
- ✅ Security and data validation
- ✅ Clear user status tracking
- ✅ Audit trail for approvals

This system provides a robust foundation for managing Red Cross volunteers and members while maintaining security and proper oversight.