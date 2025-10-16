import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import connectDB from '../src/config/db.js';
import authRoutes from '../src/routes/authRoutes.js';
import adminRoutes from '../src/routes/adminRoutes.js';
import projectRoutes from '../src/routes/projectRoutes.js';
import clientRoutes from '../src/routes/clientRoutes.js';
import contactRoutes from '../src/routes/contactRoutes.js';
import careerRoutes from '../src/routes/careerRoutes.js';
import certificateRoutes from '../src/routes/certificateRoutes.js';
import companyRoutes from '../src/routes/companyRoutes.js';

// Load environment variables
dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Custom CORS middleware to set additional headers
const customCors = (req, res, next) => {
  const origin = req.headers.origin;
  
  // Define allowed origins patterns
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://rosalisca.vercel.app',
    'https://rosalisca-backend.vercel.app'
  ];
  
  // Check if origin matches Vercel deployment pattern
  const isVercelDeployment = origin && (
    origin.includes('rosalisca') && 
    origin.includes('vercel.app')
  );
  
  // Always set these headers first
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Debug logging
  console.log('CORS Request - Origin:', origin);
  console.log('CORS Request - Method:', req.method);

  // Set origin header with broader matching for Vercel deployments
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    console.log('CORS: Allowed origin (exact match):', origin);
  } else if (isVercelDeployment) {
    // Allow any Vercel deployment URL that contains 'rosalisca'
    res.setHeader('Access-Control-Allow-Origin', origin);
    console.log('CORS: Allowed origin (Vercel deployment):', origin);
  } else if (!origin) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    console.log('CORS: No origin, allowing all');
  } else {
    // Fallback to main production URL
    res.setHeader('Access-Control-Allow-Origin', '*');
    console.log('CORS: Fallback to wildcard for origin:', origin);
  }

  // Handle preflight request (OPTIONS)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
};

// Middleware
app.use(customCors); // Apply custom CORS first

// Additional middleware to ensure CORS headers are always present
app.use((req, res, next) => {
  // Log all requests for debugging
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  
  // Ensure CORS headers are always set, even if custom CORS fails
  if (!res.getHeader('Access-Control-Allow-Origin')) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  if (!res.getHeader('Access-Control-Allow-Methods')) {
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  }
  if (!res.getHeader('Access-Control-Allow-Headers')) {
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  next();
});

app.use(express.json());
app.use(cookieParser());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

console.log('Registering API routes...');
// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Rosalisca API is running...',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    routes: ['/api/auth', '/api/projects', '/api/clients', '/api/contacts', '/api/careers', '/api/certificates', '/api/companies']
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/api/debug', (req, res) => {
  res.json({ 
    message: 'Debug endpoint working',
    routes: {
      auth: '/api/auth/login',
      health: '/health',
      projects: '/api/projects',
      clients: '/api/clients'
    },
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/companies', companyRoutes);

// Global error handler for CORS issues
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err);
  
  if (err && err.message && err.message.includes('CORS')) {
    res.status(200).json({ error: 'CORS Error', message: err.message });
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
      '/api/projects',
      '/api/clients',
      '/api/contacts',
      '/api/careers',
      '/api/certificates',
      '/api/companies'
    ]
  });
});

// Initialize database connection once
let dbConnected = false;

const initDB = async () => {
  if (!dbConnected) {
    try {
      console.log('Connecting to database...');
      await connectDB();
      dbConnected = true;
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
  }
};

// Initialize database on module load
initDB().catch(console.error);

// Export the Express app directly for Vercel
export default app;
