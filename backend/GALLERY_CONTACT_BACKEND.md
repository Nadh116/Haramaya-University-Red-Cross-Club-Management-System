# Gallery and Contact Backend Features

## Overview
Complete backend implementation for Gallery and Contact functionality with full CRUD operations, file upload, email notifications, and admin management.

## 🖼️ Gallery Features

### Models
- **Gallery Model** (`models/Gallery.js`)
  - Image metadata and file paths
  - Categories and tags
  - View counts and likes
  - SEO data and thumbnails
  - User associations and branch linking

### API Endpoints

#### Public Endpoints
- `GET /api/gallery` - Get all published images with filtering
- `GET /api/gallery/featured` - Get featured images
- `GET /api/gallery/statistics` - Get gallery statistics
- `GET /api/gallery/:id` - Get single image (increments view count)

#### Protected Endpoints (Authenticated Users)
- `POST /api/gallery/:id/like` - Toggle like on image

#### Admin Endpoints (Admin/Moderator Only)
- `POST /api/gallery` - Upload new image
- `PUT /api/gallery/:id` - Update image details
- `DELETE /api/gallery/:id` - Delete image and files

### Features
- **File Upload**: Multer integration with file validation
- **Image Processing**: Sharp for thumbnail generation and optimization
- **Categories**: blood-donation, training, community, events, general
- **Filtering**: By category, featured status, publication status
- **Pagination**: Configurable page size and navigation
- **Search**: Full-text search across title, description, and tags
- **Statistics**: View counts, like counts, category breakdowns
- **File Management**: Automatic cleanup of deleted images

### Query Parameters
```javascript
// GET /api/gallery
{
  page: 1,           // Page number
  limit: 12,         // Items per page
  category: 'all',   // Filter by category
  featured: 'true',  // Only featured images
  published: 'true', // Only published images
  sortBy: 'createdAt', // Sort field
  sortOrder: 'desc', // Sort direction
  search: 'blood'    // Search term
}
```

## 📞 Contact Features

### Models
- **Contact Model** (`models/Contact.js`)
  - Contact form submissions
  - Inquiry types and priorities
  - Status tracking and responses
  - Email notifications and metadata

### API Endpoints

#### Public Endpoints
- `POST /api/contact` - Submit contact form

#### Admin Endpoints (Admin/Moderator Only)
- `GET /api/contact` - Get all contacts with filtering
- `GET /api/contact/statistics` - Get contact statistics
- `GET /api/contact/:id` - Get single contact
- `PUT /api/contact/:id/status` - Update contact status
- `POST /api/contact/:id/response` - Add response to contact
- `DELETE /api/contact/:id` - Delete contact

### Features
- **Form Validation**: Express-validator integration
- **Email Notifications**: Automatic confirmation and admin alerts
- **Status Tracking**: new, in-progress, resolved, closed
- **Priority System**: Automatic priority based on inquiry type
- **Response System**: Admin can respond with email notifications
- **Metadata Tracking**: IP address, user agent, referrer
- **Statistics**: Contact counts, inquiry type breakdowns

### Inquiry Types
- `general` - General information
- `volunteer` - Volunteer opportunities
- `emergency` - Emergency assistance (auto-priority: urgent)
- `donation` - Blood donation inquiries
- `training` - Training programs
- `partnership` - Partnership opportunities
- `complaint` - Complaints and issues
- `suggestion` - Suggestions and feedback

### Email Templates
- **Confirmation Email**: Sent to user upon form submission
- **Admin Notification**: Sent to admin for new submissions
- **Response Email**: Sent when admin responds to inquiry

## 🔧 Installation & Setup

### 1. Install Dependencies
```bash
cd backend
npm install nodemailer sharp
```

### 2. Environment Variables
Add to your `.env` file:
```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@haramayaredcross.org
ADMIN_EMAIL=admin@haramayaredcross.org
ADMIN_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=10485760
IMAGE_QUALITY=80
THUMBNAIL_SIZE=300
```

### 3. Create Upload Directory
```bash
mkdir -p uploads/gallery
```

### 4. Database Migration
The models will automatically create the necessary collections when first used.

## 📁 File Structure
```
backend/
├── models/
│   ├── Gallery.js          # Gallery image model
│   └── Contact.js          # Contact form model
├── controllers/
│   ├── galleryController.js # Gallery CRUD operations
│   └── contactController.js # Contact form handling
├── routes/
│   ├── gallery.js          # Gallery API routes
│   └── contact.js          # Contact API routes
├── uploads/
│   └── gallery/            # Image upload directory
└── server.js               # Updated with new routes
```

## 🔐 Security Features
- **File Validation**: Only image files allowed
- **File Size Limits**: Configurable upload limits
- **Rate Limiting**: Prevents spam submissions
- **Input Validation**: Comprehensive form validation
- **Authentication**: Protected admin endpoints
- **Authorization**: Role-based access control

## 📊 Statistics & Analytics
Both Gallery and Contact features include comprehensive statistics:

### Gallery Statistics
- Total images and published count
- Total views and likes
- Category breakdowns
- Upload trends

### Contact Statistics
- Total contacts by status
- Inquiry type distributions
- Monthly submission trends
- Response time analytics

## 🚀 Usage Examples

### Upload Image (Admin)
```javascript
const formData = new FormData();
formData.append('image', file);
formData.append('title', 'Blood Drive 2024');
formData.append('description', 'Annual blood donation event');
formData.append('category', 'blood-donation');
formData.append('tags', 'blood,donation,health');

const response = await fetch('/api/gallery', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

### Submit Contact Form
```javascript
const contactData = {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+251911234567',
  subject: 'Volunteer Inquiry',
  message: 'I would like to volunteer...',
  inquiryType: 'volunteer'
};

const response = await fetch('/api/contact', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(contactData)
});
```

## 🔍 Testing
- Use Postman or similar tools to test API endpoints
- Test file uploads with various image formats
- Verify email functionality with test SMTP service
- Test form validation with invalid data

## 📈 Performance Considerations
- Images are automatically optimized and thumbnails generated
- Database indexes for efficient querying
- Pagination to handle large datasets
- File cleanup for deleted images
- Email queue for high-volume notifications

## 🛠️ Maintenance
- Regular cleanup of orphaned files
- Monitor email delivery rates
- Archive old contact submissions
- Optimize image storage and delivery