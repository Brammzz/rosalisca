#!/bin/bash

# Script untuk setup environment variables untuk deployment Vercel

echo "🚀 Setting up Vercel deployment configuration..."

# Create or update .env.production for frontend
echo "📝 Creating frontend .env.production..."
cat > frontend/.env.production << EOF
# Production Environment Variables for Frontend
VITE_API_URL=https://rosalisca-backend.vercel.app/api

# Optional: Add other production-specific variables
# VITE_ANALYTICS_ID=your_analytics_id
# VITE_SENTRY_DSN=your_sentry_dsn
EOF

# Create or update .env.example for backend
echo "📝 Updating backend .env.example..."

echo "✅ Configuration files created!"
echo ""
echo "📋 Next steps for Vercel deployment:"
echo ""
echo "BACKEND DEPLOYMENT:"
echo "1. cd backend"
echo "2. git init (if not already initialized)"
echo "3. git add ."
echo "4. git commit -m 'Initial backend commit'"
echo "5. Push to GitHub repository"
echo "6. Connect to Vercel and deploy"
echo "7. Set environment variables in Vercel dashboard:"
echo "   - MONGODB_URI (MongoDB Atlas connection string)"
echo "   - JWT_SECRET (strong secret key)"
echo "   - NODE_ENV=production"
echo "   - FRONTEND_URL=https://rosalisca.vercel.app"
echo ""
echo "FRONTEND DEPLOYMENT:"
echo "1. cd frontend"
echo "2. Update VITE_API_URL in .env.production with your backend URL"
echo "3. git add ."
echo "4. git commit -m 'Update for production deployment'"
echo "5. Push to GitHub repository"
echo "6. Connect to Vercel and deploy"
echo ""
echo "🔧 IMPORTANT CONFIGURATION:"
echo "- Make sure MongoDB Atlas is set up with proper IP whitelist"
echo "- Update CORS origins in backend server.js with your frontend URLs"
echo "- Set proper environment variables in Vercel dashboard"
echo ""
echo "📖 For detailed instructions, check the deployment guide in README.md"
