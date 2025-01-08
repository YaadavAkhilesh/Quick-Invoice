// Import the mongoose library, which is used to interact with MongoDB
const mongoose = require('mongoose');

// Define an asynchronous function to connect to the MongoDB database
const connectDB = async () => {
  try {
    // Check if the MongoDB connection URI is defined in the environment variables
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    // Try to connect to the MongoDB database using the URI from the environment variables.
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true, // Use the new URL parser to avoid deprecation warnings.
      useUnifiedTopology: true, // Use the new unified topology layer for better performancee
    });

    // Log a success message with the host of the connected database
    console.log(`Successfully connected to MongoDB at: ${connection.connection.host}`);
  } catch (error) {
    // If an error occurs, log the error message
    console.error(`Connection error: ${error.message}`);
    // Exit the process with a failure code (1). This stops the app from running because we can't work without a database.
    process.exit(1);
  }
};

// Export the connectDB function so it can be used in other parts of the application
module.exports = connectDB;