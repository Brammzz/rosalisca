import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables first
dotenv.config();

const app = express();

// Simple CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://rosalisca.vercel.app',
    'https://rosalisca-frontend.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Rosalisca Backend API', 
    status: 'running',
    timestamp: new Date().toISOString(),
    env: {
      nodeEnv: process.env.NODE_ENV,
      port: process.env.PORT,
      mongoUri: process.env.MONGODB_URI ? 'configured' : 'missing',
      jwtSecret: process.env.JWT_SECRET ? 'configured' : 'missing'
    }
  });
});

// Test routes without database dependency
app.get('/api/clients', async (req, res) => {
  try {
    // Mock data for testing
    const mockClients = [
      {
        _id: '670e1234567890abcdef0001',
        name: 'PT Pertamina',
        category: 'bumn',
        status: 'active',
        projectCount: 15,
        logo: '/uploads/logo-pertamina.png',
        createdAt: new Date().toISOString()
      },
      {
        _id: '670e1234567890abcdef0002', 
        name: 'Kementerian PUPR',
        category: 'government',
        status: 'active',
        projectCount: 8,
        logo: '/uploads/logo-pupr.png',
        createdAt: new Date().toISOString()
      }
    ];

    res.json({
      success: true,
      data: mockClients,
      pagination: {
        page: 1,
        limit: 10,
        total: mockClients.length,
        pages: 1
      },
      statistics: {
        total: mockClients.length,
        government: 1,
        private: 0,
        bumn: 1,
        totalProjects: 23
      }
    });
  } catch (error) {
    console.error('Error in /api/clients:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

app.get('/api/projects', async (req, res) => {
  try {
    const mockProjects = [
      {
        _id: '670e1234567890abcdef0003',
        title: 'Pembangunan Jalan Tol Jakarta-Bandung',
        company: 'Rosalisca Group',
        category: 'infrastructure',
        year: '2024',
        location: 'Jakarta - Bandung',
        description: 'Proyek pembangunan jalan tol dengan teknologi terkini',
        image: '/uploads/project-tol.jpg',
        status: 'ongoing',
        client: 'Kementerian PUPR',
        duration: '24 bulan',
        createdAt: new Date().toISOString()
      }
    ];

    res.json(mockProjects);
  } catch (error) {
    console.error('Error in /api/projects:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error', 
      error: error.message
    });
  }
});

// Add other basic routes
app.get('/api/companies', (req, res) => {
  res.json({
    success: true,
    data: [{
      _id: '1',
      name: 'Rosalisca Group',
      type: 'parent',
      description: 'Leading construction company in Indonesia'
    }]
  });
});

app.get('/api/contacts', (req, res) => {
  res.json({
    success: true,
    data: [],
    pagination: { page: 1, limit: 10, total: 0, pages: 0 }
  });
});

app.get('/api/careers', (req, res) => {
  res.json({
    success: true,
    data: []
  });
});

app.get('/api/certificates', (req, res) => {
  res.json({
    success: true,
    data: []
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.originalUrl
  });
});

const PORT = process.env.PORT || 5000;

// Start server without database dependency for testing
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 MongoDB: ${process.env.MONGODB_URI ? '✅ Configured' : '❌ Missing'}`);
  console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET ? '✅ Configured' : '❌ Missing'}`);
});

export default app;
