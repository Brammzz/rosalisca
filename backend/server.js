import express from 'express';
import dotenv from 'dotenv';
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

// Custom CORS middleware - Simple and effective
app.use(function (req, res, next) {
    // Log incoming requests for debugging
    console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin || 'no-origin'}`);
    
    // Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE,PATCH");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    
    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        console.log('Handling OPTIONS preflight request for:', req.path);
        res.status(200).end();
        return;
    }
    
    next();
});
app.use(express.json());
app.use(cookieParser());

// Serve static files from uploads directory (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
} else {
  // In production (Vercel), handle uploads differently
  app.get('/uploads/*', (req, res) => {
    res.status(404).json({ 
      message: 'Static files not available in serverless environment',
      suggestion: 'Use cloud storage for file uploads'
    });
  });
}

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

// Safely import and use routes with error handling
try {
  app.use('/api/auth', authRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/clients', clientRoutes);
  app.use('/api/contacts', contactRoutes);
  app.use('/api/careers', careerRoutes);
  app.use('/api/certificates', certificateRoutes);
  app.use('/api/companies', companyRoutes);
  console.log('✅ All routes registered successfully');
} catch (error) {
  console.error('❌ Error registering routes:', error);
  
  // Fallback routes if imports fail
  app.use('/api/*', (req, res) => {
    res.status(503).json({
      error: 'Service Temporarily Unavailable',
      message: 'Routes failed to load',
      suggestion: 'Please check environment variables and try again'
    });
  });
}

// Global error handler for CORS issues
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err);
  
  if (err && err.message && err.message.includes('CORS')) {
    res.status(200).json({ error: 'CORS Error', message: err.message });
  } else if (err && err.message && err.message.includes('ENOENT')) {
    res.status(500).json({ 
      error: 'File System Error', 
      message: 'File or directory not found (serverless environment)',
      suggestion: 'This might be a serverless environment limitation'
    });
  } else {
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: err.message || 'Something went wrong!',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
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
    // Only connect to database if environment variables are set
    if (process.env.MONGODB_URI) {
      console.log('🔄 Connecting to database...');
      await connectDB();
      console.log('✅ Database connected successfully');
      
      // Auto-create admin user if not exists (only if DB connected)
      await createDefaultAdmin();
    } else {
      console.log('⚠️ No MONGODB_URI found, skipping database connection');
    }
    
    // Only start listening in development (not in Vercel)
    if (process.env.NODE_ENV !== 'production') {
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    }
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    // In production, don't exit process - let Vercel handle it
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

// Function to create default admin user
const createDefaultAdmin = async () => {
  try {
    // Only try to create admin if database is connected
    if (!process.env.MONGODB_URI) {
      console.log('⚠️ Skipping admin creation - no database connection');
      return;
    }

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
