# Vercel Deployment Troubleshooting

## Current Configuration

### Backend (Express.js)
- **Framework**: Express.js (serverless)
- **Entry Point**: `server.js`
- **Build**: Not required (Node.js)
- **Routes**: All routes handled by Express app

### Frontend (Vite + React)
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **SPA Routing**: Handled by vercel.json

## Configuration Files

### Backend vercel.json
```json
{
  "version": 2,
  "name": "rosalisca-backend",
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/uploads/(.*)",
      "dest": "/uploads/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ],
  "functions": {
    "server.js": {
      "maxDuration": 30
    }
  }
}
```

### Frontend vercel.json
```json
{
  "version": 2,
  "name": "rosalisca-frontend",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "routes": [
    {
      "src": "/assets/(.*)",
      "headers": {
        "cache-control": "max-age=31536000, immutable"
      }
    },
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## Common Issues & Solutions

### Backend Issues

**1. "Cannot resolve module" Error**
- Ensure all imports use `.js` extensions
- Check that all dependencies are in package.json

**2. "Database connection failed"**
- Verify MongoDB URI in environment variables
- Check IP whitelist in MongoDB Atlas

**3. "Function timeout"**
- Increase maxDuration in vercel.json
- Optimize database queries

### Frontend Issues

**1. "Build failed" Error**
- Check TypeScript errors: `npm run type-check`
- Verify all dependencies are installed

**2. "404 on page refresh"**
- Ensure SPA routing is configured in vercel.json
- Check route configuration

**3. "API calls failing in production"**
- Verify VITE_API_URL in environment variables
- Check CORS configuration in backend

## Deployment Checklist

### Pre-deployment
- [ ] All code committed and pushed to GitHub
- [ ] MongoDB Atlas cluster configured
- [ ] Environment variables prepared
- [ ] CORS origins updated for production URLs

### Backend Deployment
- [ ] Project imported in Vercel
- [ ] Root directory set to `backend`
- [ ] Environment variables configured
- [ ] First deployment successful
- [ ] API endpoints tested

### Frontend Deployment
- [ ] Project imported in Vercel
- [ ] Root directory set to `frontend`
- [ ] Build command set to `npm run build`
- [ ] Output directory set to `dist`
- [ ] VITE_API_URL environment variable set
- [ ] First deployment successful
- [ ] Frontend loads correctly
- [ ] API integration working

### Post-deployment
- [ ] CORS updated with production URLs
- [ ] Backend redeployed with updated CORS
- [ ] All features tested in production
- [ ] File uploads working
- [ ] Admin panel accessible

## Testing Commands

```bash
# Test API health
curl https://rosalisca-backend.vercel.app/api

# Test specific endpoints
curl https://rosalisca-backend.vercel.app/api/projects
curl https://rosalisca-backend.vercel.app/api/clients
curl https://rosalisca-backend.vercel.app/api/companies

# Test frontend
open https://rosalisca.vercel.app
```

## Environment Variables

### Backend
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rosalisca
JWT_SECRET=your_very_long_and_secure_jwt_secret_key_here
FRONTEND_URL=https://rosalisca.vercel.app
```

### Frontend
```
VITE_API_URL=https://rosalisca-backend.vercel.app/api
```
