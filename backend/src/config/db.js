const mongoose = require('mongoose');

// Clear all models before connecting
Object.keys(mongoose.models).forEach(key => {
  delete mongoose.models[key];
});

const connectDB = async () => {
  try {
    // Use a default local MongoDB URI if not provided in environment variables
    const mongoURI = process.env.MONGODB_URI;
    const connection = await mongoose.connect(mongoURI);
    console.log(`✅ Successfully connected to MongoDB at — ${connection.connection.host}`);
  } catch (error) {
    console.error(`❎ Connection error — ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;