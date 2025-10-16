import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
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

// CORS configuration for production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://rosalisca.vercel.app',
      'https://rosalisca-backend.vercel.app',
      process.env.FRONTEND_URL,
      'https://rosalisca.com',
      'https://www.rosalisca.com'
    ].filter(Boolean);
    
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
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Rosalisca API is running...',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/companies', companyRoutes);

// Initialize database connection
let isConnected = false;

const connectToDatabase = async () => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
  }
};

// Serverless function handler
export default async (req, res) => {
  try {
    await connectToDatabase();
    return app(req, res);
  } catch (error) {
    console.error('Error in serverless function:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
