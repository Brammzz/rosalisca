// Simple test API handler for debugging
import express from 'express';

const app = express();

// Simple CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
});

app.use(express.json());

// Test routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Simple API test working',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API test endpoint working',
    method: req.method,
    url: req.url,
    headers: req.headers
  });
});

// Mock clients endpoint
app.get('/api/clients', (req, res) => {
  console.log('Clients endpoint called with query:', req.query);
  res.json([
    {
      _id: '1',
      name: 'Test Client 1',
      status: 'active'
    },
    {
      _id: '2', 
      name: 'Test Client 2',
      status: 'active'
    }
  ]);
});

// Mock projects endpoint
app.get('/api/projects', (req, res) => {
  console.log('Projects endpoint called with query:', req.query);
  res.json([
    {
      _id: '1',
      title: 'Test Project 1',
      company: req.query.company || 'Rosalisca Group'
    },
    {
      _id: '2',
      title: 'Test Project 2', 
      company: req.query.company || 'Rosalisca Group'
    }
  ]);
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});

export default app;
