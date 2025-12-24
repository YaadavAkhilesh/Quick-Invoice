// Function to generate a unique ID.
const generateUniqueId = (prefix) => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${prefix}${timestamp}${randomStr}`.toUpperCase();
};

module.exports = { generateUniqueId };