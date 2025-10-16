import mongoose from 'mongoose';

// Cache the database connection in serverless environment
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  try {
    // Check if MONGODB_URI is defined
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    // If we have a cached connection, return it
    if (cached.conn) {
      console.log('Using cached MongoDB connection');
      return cached.conn;
    }

    // If we don't have a cached connection but have a promise, wait for it
    if (!cached.promise) {
      console.log('Creating new MongoDB connection...');
      
      const opts = {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      };

      cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongoose) => {
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
        return mongoose;
      });
    }

    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    cached.promise = null;
    
    // Don't exit process in serverless environment
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
    throw error;
  }
};

export default connectDB;
