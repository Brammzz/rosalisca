// Development server - used for local development only
import app from './server.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Development server running on port ${PORT}`);
  console.log(`📡 API available at: http://localhost:${PORT}/api`);
});
