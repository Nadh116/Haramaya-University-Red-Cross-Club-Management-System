#!/bin/bash

echo "🚀 Installing Gallery and Contact Backend Dependencies..."

# Navigate to backend directory
cd backend

# Install new dependencies
echo "📦 Installing nodemailer and sharp..."
npm install nodemailer@^6.9.4 sharp@^0.32.5

# Create upload directory
echo "📁 Creating upload directories..."
mkdir -p uploads/gallery

# Set permissions (Linux/Mac)
if [[ "$OSTYPE" == "linux-gnu"* ]] || [[ "$OSTYPE" == "darwin"* ]]; then
    chmod 755 uploads
    chmod 755 uploads/gallery
    echo "✅ Upload directory permissions set"
fi

echo ""
echo "✅ Backend dependencies installed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Add email configuration to your .env file (see backend/GALLERY_CONTACT_ENV.md)"
echo "2. Start your backend server: npm run dev"
echo "3. Test the new endpoints with Postman or your frontend"
echo ""
echo "📚 Documentation:"
echo "- Backend features: backend/GALLERY_CONTACT_BACKEND.md"
echo "- Environment setup: backend/GALLERY_CONTACT_ENV.md"
echo "- Frontend features: frontend/GALLERY_CONTACT_FEATURES.md"
echo ""
echo "🎉 Gallery and Contact features are ready to use!"