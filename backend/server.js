import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import projectRoutes from './src/routes/projectRoutes.js';
import clientRoutes from './src/routes/clientRoutes.js';
import contactRoutes from './src/routes/contactRoutes.js';
import careerRoutes from './src/routes/careerRoutes.js';
import certificateRoutes from './src/routes/certificateRoutes.js';
import companyRoutes from './src/routes/companyRoutes.js';
import dashboardRoutes from './src/routes/dashboardRoutes.js';

// Load environment variables
dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS configuration - SIMPLIFIED for better compatibility
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173', // Local development
      'http://localhost:3000', // Alternative local port
      'https://rosalisca.vercel.app', // Production frontend
      'https://rosalisca-backend.vercel.app', // Production backend
      process.env.FRONTEND_URL, // Dynamic frontend URL from env
    ].filter(Boolean); // Remove undefined values
    
    console.log(`CORS Check: origin=${origin}, allowed=${allowedOrigins.includes(origin)}`);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // For development, allow any localhost
      if (origin && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
        callback(null, true);
      } else {
        console.log('Blocked by CORS:', origin);
        callback(null, true); // Allow all for now to avoid blocking
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200
};

// Middleware - USE ONLY ONE CORS SETUP
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

console.log('Registering API routes...');
// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Rosalisca API is running from server.js!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    routes: ['/api/auth', '/api/dashboard', '/api/projects', '/api/clients', '/api/contacts', '/api/careers', '/api/certificates', '/api/companies']
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Environment check endpoint
app.get('/api/env-check', (req, res) => {
  res.json({
    status: 'Environment Check',
    environment: {
      NODE_ENV: process.env.NODE_ENV || 'development',
      MONGODB_URI: process.env.MONGODB_URI ? '✅ configured' : '❌ missing',
      JWT_SECRET: process.env.JWT_SECRET ? '✅ configured' : '❌ missing',
      FRONTEND_URL: process.env.FRONTEND_URL || 'not set',
      PORT: process.env.PORT || '5000'
    },
    routes_available: [
      '/api/auth/login',
      '/api/auth/register',
      '/api/dashboard/overview',
      '/api/projects',
      '/api/clients',
      '/api/contacts',
      '/api/careers',
      '/api/certificates',
      '/api/companies'
    ],
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/companies', companyRoutes);

// Global error handler for CORS issues
app.use((err, req, res, next) => {
  if (err && err.message && err.message.includes('CORS')) {
    res.status(200).json({ error: 'CORS Error', message: err.message });
  } else {
    next(err);
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    availableRoutes: [
      '/api/auth',
      '/api/admin',
      '/api/dashboard', 
      '/api/projects',
      '/api/clients',
      '/api/contacts',
      '/api/careers',
      '/api/certificates',
      '/api/companies'
    ]
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await connectDB();
    console.log('✅ Database connected successfully');
    
    // Auto-create admin user if not exists
    await createDefaultAdmin();
    
    // Only start listening in development (not in Vercel)
    if (process.env.NODE_ENV !== 'production') {
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    }
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

// Function to create default admin user
const createDefaultAdmin = async () => {
  try {
    const User = (await import('./src/models/User.js')).default;
    
    const adminEmail = 'admin@gmail.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      const bcrypt = (await import('bcryptjs')).default;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      const admin = new User({
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
      
      await admin.save();
      console.log('✅ Default admin user created:', adminEmail);
    } else {
      console.log('ℹ️ Admin user already exists:', adminEmail);
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    // Don't throw error, just log it
  }
};

startServer();

// Export the app for Vercel
export default app;
