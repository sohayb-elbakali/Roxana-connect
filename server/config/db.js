const mongoose = require("mongoose");

// Connection retry configuration
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

let isConnecting = false;

const connectDB = async (retryCount = 0) => {
  if (isConnecting) return;
  isConnecting = true;

  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error('MONGO_URI environment variable is not defined');
    }

    // MongoDB connection options optimized for stability
    const options = {
      // Timeouts
      serverSelectionTimeoutMS: 30000, // 30 seconds to select server
      socketTimeoutMS: 45000, // 45 seconds socket timeout
      connectTimeoutMS: 30000, // 30 seconds initial connection

      // Connection pool - keep connections alive
      maxPoolSize: 10,
      minPoolSize: 5, // Keep more minimum connections
      maxIdleTimeMS: 60000, // Keep idle connections for 60 seconds

      // Reliability
      retryWrites: true,
      retryReads: true,

      // Heartbeat - check connection more frequently
      heartbeatFrequencyMS: 5000, // Every 5 seconds (faster detection)

      // Keep connection alive
      family: 4, // Use IPv4, skip trying IPv6
    };

    console.log('Connecting to MongoDB...');

    await mongoose.connect(mongoURI, options);

    console.log("Connected to MongoDB Successfully");
    isConnecting = false;

    // Remove old listeners to prevent duplicates
    mongoose.connection.removeAllListeners('disconnected');
    mongoose.connection.removeAllListeners('reconnected');
    mongoose.connection.removeAllListeners('error');
    mongoose.connection.removeAllListeners('close');

    // Handle disconnect - auto reconnect is built into mongoose 6+
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB error:', err.message);
    });

    // Handle close event (when connection is fully closed)
    mongoose.connection.on('close', () => {
      console.log('MongoDB connection closed');
    });

  } catch (err) {
    isConnecting = false;
    console.error(`MongoDB connection error (attempt ${retryCount + 1}/${MAX_RETRIES}):`, err.message);

    if (retryCount < MAX_RETRIES - 1) {
      console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return connectDB(retryCount + 1);
    } else {
      console.error('Max retries reached. Could not connect to MongoDB.');
      console.error('Check: 1) Internet 2) Atlas IP whitelist 3) MONGO_URI');
      process.exit(1);
    }
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (err) {
    console.error('Error during disconnect:', err);
    process.exit(1);
  }
});

module.exports = connectDB;
