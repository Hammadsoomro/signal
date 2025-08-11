import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://Hammad:Soomro@connectlify.tdwqdvi.mongodb.net/?retryWrites=true&w=majority&appName=Connectlify';

export const connectDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('📦 MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error('🔥 MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('📪 MongoDB disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔌 MongoDB connection closed through app termination');
  process.exit(0);
});
