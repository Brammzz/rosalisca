import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Don't exit process in production (Vercel serverless)
    if (mongoose.connection.readyState === 1) {
      console.log('MongoDB already connected');
      return;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      maxPoolSize: 10 // Maintain up to 10 socket connections
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    
    // Don't exit process in production (causes serverless function to fail)
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    } else {
      throw error; // Re-throw for proper error handling
    }
  }
};

export default connectDB;
