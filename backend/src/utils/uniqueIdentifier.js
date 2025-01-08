// Function to generate a unique ID. Perfect for invoices, orders, or anything that needs a unique identifier!
const generateUniqueId = (prefix) => {
  // Get the current timestamp and convert it to a base-36 string. This makes it shorter and more readable.
  const timestamp = Date.now().toString(36);

  // Generate a random string, also in base-36, and take a slice of it. This adds some randomness to the ID.
  const randomStr = Math.random().toString(36).substring(2, 8);

  // Combine the prefix, timestamp, and random string, then convert it to uppercase for a clean look.
  return `${prefix}${timestamp}${randomStr}`.toUpperCase();
};

// Export the function so it can be used in other parts of the app.
module.exports = { generateUniqueId };