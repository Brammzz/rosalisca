# Deployment Fix Instructions

## Issues Found and Solutions

### 1. MongoDB Connection Issue
**Problem**: The current `.env` file uses `mongodb://localhost:27017/rosaliscaDB` which doesn't work in Vercel's serverless environment.

**Solution**: You need to set up a cloud MongoDB database:

#### Option A: MongoDB Atlas (Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Get your connection string (it will look like: `mongodb+srv://username:password@cluster.mongodb.net/rosaliscaDB`)
4. Set this as an environment variable in Vercel

#### Option B: Other MongoDB cloud providers
- MongoDB Atlas
- DigitalOcean Managed Databases
- AWS DocumentDB

### 2. Environment Variables in Vercel
You need to set these environment variables in your Vercel project:

1. Go to your Vercel dashboard
2. Select your `rosalisca-backend` project
3. Go to Settings → Environment Variables
4. Add these variables:

```
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/rosaliscaDB
JWT_SECRET=your-super-secret-key-that-is-long-and-random-and-very-secure
NODE_ENV=production
```

### 3. File Changes Made
- ✅ Updated `vercel.json` to include src files
- ✅ Added better error handling in database connection
- ✅ Added production environment detection
- ✅ Created `.env.example` for reference

### 4. Next Steps
1. **Set up MongoDB Atlas** (or another cloud MongoDB service)
2. **Update Vercel environment variables** with the new MongoDB URI
3. **Redeploy** your backend to Vercel

### 5. Testing Locally
The server runs fine locally with the current localhost MongoDB setup. To test with a cloud database:
1. Update your local `.env` file with the cloud MongoDB URI
2. Run `npm run dev` to test

### 6. Deployment Command
After setting up the MongoDB URI in Vercel environment variables, redeploy:
```bash
vercel --prod
```

## Environment Variables Template
Copy this to your Vercel environment variables:

```
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/rosaliscaDB
JWT_SECRET=your-super-secret-jwt-key-make-it-long-and-random
NODE_ENV=production
```

## MongoDB Atlas Setup Guide
1. Create account at https://www.mongodb.com/atlas
2. Create a new cluster (choose the free tier)
3. Create a database user
4. Whitelist your IP addresses (or use 0.0.0.0/0 for all IPs)
5. Get the connection string
6. Replace `<password>` with your actual password in the connection string
