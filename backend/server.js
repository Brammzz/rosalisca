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

// Load environment variables
dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Custom CORS middleware to set additional headers
const customCors = (req, res, next) => {
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://rosalisca.vercel.app',
    'https://rosalisca-backend.vercel.app'
  ];
  
  const origin = req.headers.origin;
  
  res.setHeader('Access-Control-Allow-Credentials', true);
  
  // Set specific origin or allow all for development
  if (allowedOrigins.includes(origin) || !origin) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'https://rosalisca.vercel.app');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Cookie'
  );

  // Handle preflight request (OPTIONS)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
};

// CORS configuration for production
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
      // Add your custom domain here
      'https://rosalisca.com',
      'https://www.rosalisca.com'
    ].filter(Boolean); // Remove undefined values
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Middleware
app.use(customCors);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

console.log('Registering API routes...');
// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
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
    await connectDB();
    
    // Only start listening in development (not in Vercel)
    if (process.env.NODE_ENV !== 'production') {
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    }
  } catch (error) {
    console.error('Failed to start server:', error);
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

startServer();

// Export the app for Vercel
export default app;
