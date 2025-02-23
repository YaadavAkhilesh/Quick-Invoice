// Function to validate a username. Let's make sure it's not empty or full of spaces!
const validateUsername = (username) => {
  if (!username) {
    return { isValid: false, message: "Username is required" };
  }
  if (username.includes(" ")) {
    return { isValid: false, message: "Username cannot contain spaces" };
  }
  return { isValid: true, message: "Username is valid" };
};

// Function to validate a password. We need to make sure it's strong and secure!
const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: "Password is required" };
  }
  if (password.length < 8) {
    return { isValid: false, message: "Password must be at least 8 characters long" };
  }
  if (password.length >= 16) {
    return { isValid: false, message: "Password must be less than 16 characters long" };
  }
  if (password.includes(" ")) {
    return { isValid: false, message: "Password cannot contain spaces" };
  }
  return { isValid: true, message: "Password is valid" };
};

// Function to validate a GST number. It should be exactly 15 characters long.
const validateGSTNumber = (gstNo) => {
  return gstNo.length === 15;
};

const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, message: "Email is required" };
  }
  
  // RFC 5322 standard email regex pattern
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Please enter a valid email address" };
  }

  return { isValid: true, message: "Email is valid" };
};

module.exports = {
  validateUsername,
  validatePassword,
  validateGSTNumber,
  validateEmail
};