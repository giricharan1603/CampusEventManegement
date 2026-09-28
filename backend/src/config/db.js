import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cems';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[Database] Could not connect to primary MongoDB at ${uri}: ${error.message}`);
    
    // In development mode, fallback to in-memory MongoDB so the app works seamlessly
    if (process.env.NODE_ENV !== 'production') {
      try {
        console.log('[Database] Starting in-memory MongoDB fallback...');
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const memUri = mongod.getUri();
        const conn = await mongoose.connect(memUri);
        console.log(`[Database] In-Memory MongoDB Connected at: ${memUri}`);
        return conn;
      } catch (memError) {
        console.error('[Database] Failed to start in-memory MongoDB:', memError.message);
        throw error;
      }
    } else {
      throw error;
    }
  }
};
