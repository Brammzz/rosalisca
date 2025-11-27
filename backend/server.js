import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
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

// CORS configuration
app.use(cors({
  origin: ['https://rosalisca.vercel.app', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Rosalisca API is running!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/companies', companyRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
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

// Export for Vercel
export default app;
