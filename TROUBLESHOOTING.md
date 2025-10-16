# 🚨 TROUBLESHOOTING GUIDE - ROSALISCA PROJECT

## Current Issue: Authentication Login Error (404)

### Error Details
```
POST https://rosalisca-backend.vercel.app/api/auth/login 404 (Not Found)
```

## 🔍 Root Cause Analysis

The 404 error on `/api/auth/login` indicates that:
1. ❌ Environment variables are missing in Vercel deployment
2. ❌ Database connection is failing due to missing MONGODB_URI
3. ❌ JWT authentication cannot work without JWT_SECRET

## ✅ STEP-BY-STEP SOLUTION

### 1. Check Current Status
Visit these URLs to diagnose:
- **Environment Check**: https://rosalisca-backend.vercel.app/api/env-check
- **Health Check**: https://rosalisca-backend.vercel.app/health
- **Debug Info**: https://rosalisca-backend.vercel.app/api/debug

### 2. Configure Environment Variables in Vercel

Go to [Vercel Dashboard](https://vercel.com/dashboard) → Select your project → Settings → Environment Variables

Add these variables:

| Variable Name | Value | Example |
|---------------|-------|---------|
| `MONGODB_URI` | Your MongoDB connection string | `mongodb+srv://username:password@cluster.mongodb.net/rosalisca` |
| `JWT_SECRET` | Strong random string | `your-super-secret-jwt-key-here` |
| `NODE_ENV` | production | `production` |
| `FRONTEND_URL` | Frontend domain | `https://rosalisca.vercel.app` |

### 3. Get MongoDB URI
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Login to your account
3. Go to Clusters → Connect → Connect your application
4. Copy the connection string
5. Replace `<password>` with your database user password

### 4. Generate JWT Secret
Run this in any JavaScript console:
```javascript
require('crypto').randomBytes(64).toString('hex')
```

### 5. Redeploy
After adding environment variables:
1. Go to Vercel dashboard
2. Go to Deployments tab
3. Click "Redeploy" on the latest deployment
4. Wait for deployment to complete

## 🧪 Test After Setup

### 1. Check Environment Status
```bash
curl https://rosalisca-backend.vercel.app/api/env-check
```

Expected response:
```json
{
  "status": "Environment Check",
  "database": "connected",
  "environment": {
    "NODE_ENV": "production",
    "MONGODB_URI": "✅ configured",
    "JWT_SECRET": "✅ configured",
    "FRONTEND_URL": "https://rosalisca.vercel.app"
  }
}
```

### 2. Test Admin Login
Default admin credentials:
- **Email**: `admin@gmail.com`
- **Password**: `admin123`

```bash
curl -X POST https://rosalisca-backend.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"admin123"}'
```

Expected response:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "admin@gmail.com",
    "role": "admin"
  }
}
```

## 🔗 Useful URLs for Testing

| Purpose | URL |
|---------|-----|
| Frontend | https://rosalisca.vercel.app |
| Backend Health | https://rosalisca-backend.vercel.app/health |
| Environment Check | https://rosalisca-backend.vercel.app/api/env-check |
| Debug Info | https://rosalisca-backend.vercel.app/api/debug |
| Login API | https://rosalisca-backend.vercel.app/api/auth/login |

## 🆘 If Still Not Working

1. **Check Vercel Function Logs**:
   - Go to Vercel Dashboard → Functions tab
   - Look for error messages in logs

2. **Verify MongoDB Connection**:
   - Test your MongoDB URI in MongoDB Compass
   - Ensure database user has read/write permissions

3. **Check Environment Variables**:
   - Verify all variables are set in Vercel
   - No typos in variable names
   - Values are correctly copied

4. **Contact Support**:
   - Share the output of `/api/env-check` endpoint
   - Include any error messages from Vercel logs

## 📋 Quick Checklist

- [ ] MongoDB Atlas cluster is running
- [ ] Database user is created with password
- [ ] MONGODB_URI is added to Vercel environment variables
- [ ] JWT_SECRET is added to Vercel environment variables
- [ ] NODE_ENV=production is set
- [ ] FRONTEND_URL is set to correct domain
- [ ] Project is redeployed after adding variables
- [ ] Environment check endpoint shows all ✅
- [ ] Admin login test is successful

---

**Last Updated**: $(date)
**Status**: Waiting for environment variables configuration
