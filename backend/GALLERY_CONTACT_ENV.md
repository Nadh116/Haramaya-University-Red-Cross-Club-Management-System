# Environment Variables for Gallery and Contact Features

Add these environment variables to your `.env` file for the Gallery and Contact features to work properly:

## Email Configuration (for Contact Form)
```env
# SMTP Configuration for sending emails
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Email addresses
FROM_EMAIL=noreply@haramayaredcross.org
ADMIN_EMAIL=admin@haramayaredcross.org

# Admin panel URL (for email links)
ADMIN_URL=http://localhost:3000
```

## File Upload Configuration
```env
# Maximum file size for image uploads (in bytes)
MAX_FILE_SIZE=10485760

# Upload directory (relative to backend root)
UPLOAD_DIR=uploads
```

## Optional Configuration
```env
# Image processing quality (1-100)
IMAGE_QUALITY=80

# Thumbnail size (pixels)
THUMBNAIL_SIZE=300

# Gallery pagination default
GALLERY_DEFAULT_LIMIT=12

# Contact form rate limiting
CONTACT_RATE_LIMIT=5
```

## Gmail Setup Instructions

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password in `SMTP_PASS`

## Example .env file addition:
```env
# Gallery and Contact Features
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=haramayaredcross@gmail.com
SMTP_PASS=your-16-character-app-password
FROM_EMAIL=noreply@haramayaredcross.org
ADMIN_EMAIL=admin@haramayaredcross.org
ADMIN_URL=http://localhost:3000
MAX_FILE_SIZE=10485760
IMAGE_QUALITY=80
THUMBNAIL_SIZE=300
```

## Testing Email Functionality

You can test the email functionality using:
- **Mailtrap** (for development): https://mailtrap.io/
- **Gmail** (for production)
- **SendGrid** (alternative service)

For Mailtrap testing:
```env
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-mailtrap-username
SMTP_PASS=your-mailtrap-password
```