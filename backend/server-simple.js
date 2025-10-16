import express from 'express';
import cors from 'cors';

const app = express();

// Simple CORS - allow all origins for debugging
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Backend is working!', timestamp: new Date().toISOString() });
});

// Test API routes without database
app.get('/api/clients', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        _id: '1',
        name: 'Test Client',
        category: 'government',
        status: 'active',
        projectCount: 5
      }
    ],
    message: 'Test data returned successfully'
  });
});

app.get('/api/projects', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        _id: '1',
        title: 'Test Project',
        company: 'Rosalisca Group',
        category: 'construction',
        status: 'completed'
      }
    ],
    message: 'Test data returned successfully'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not Found', 
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Simple server running on port ${PORT}`);
});

export default app;
