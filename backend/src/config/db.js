const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`Successfully connected to MongoDB at: ${connection.connection.host}`);
  } catch (error) {
    console.error(`Connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;