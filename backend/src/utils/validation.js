// Function to validate a username.
const validateUsername = (username) => {
  if (!username) {
    return { isValid: false, message: "Username is required" };
  }
  
  // Check length (6-10 characters)
  if (username.length < 6 || username.length > 10) {
    return { isValid: false, message: "Username must be between 6 and 10 characters" };
  }

  // Only allow alphanumeric and underscore
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return { isValid: false, message: "Username can only contain letters, numbers, and underscore" };
  }

  return { isValid: true };
};

// Function to validate a password.
const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: "Password is required" };
  }

  // Minimum 8 characters, at least one uppercase letter, one lowercase letter, 
  // one number and one special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return { 
      isValid: false, 
      message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character" 
    };
  }

  if (password.length > 16) {
    return { isValid: false, message: 'Password must not exceed 16 characters' };
  }

  return { isValid: true };
};

// Function to validate a GST number.
const validateGSTNumber = (gstNo) => {
  if (!gstNo) {
    return { isValid: false, message: "GST number is required" };
  }

  // GST number format validation (15 characters, alphanumeric)
  if (gstNo.length !== 15) {
    return { isValid: false, message: 'GST number must be exactly 15 characters' };
  }

  const gstRegex = /^[0-9A-Z]{15}$/;
  if (!gstRegex.test(gstNo)) {
    return { isValid: false, message: "Invalid GST number format" };
  }

  return { isValid: true };
};

const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, message: "Email is required" };
  }
  
  // RFC 5322 Official Standard Email Regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_\`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Invalid email format" };
  }

  return { isValid: true };
};

const validateBrandName = (brandName) => {
  if (!brandName) {
    return { isValid: false, message: "Brand name is required" };
  }

  // Allow letters, spaces, dots, and Ltd/Pvt
  const brandNameRegex = /^[a-zA-Z\s.]+$/;
  if (!brandNameRegex.test(brandName)) {
    return { isValid: false, message: "Brand name can only contain letters, spaces, and dots" };
  }

  return { isValid: true };
};

const validateOwnerName = (ownerName) => {
  if (!ownerName) {
    return { isValid: false, message: "Owner name is required" };
  }

  // Only allow letters and spaces
  const ownerNameRegex = /^[a-zA-Z\s]+$/;
  if (!ownerNameRegex.test(ownerName)) {
    return { isValid: false, message: "Owner name can only contain letters and spaces" };
  }

  return { isValid: true };
};

const validateTelephone = (telephone) => {
  if (!telephone) {
    return { isValid: false, message: "Telephone number is required" };
  }

  // Only allow numbers, 10 digits
  const telephoneRegex = /^\d{10}$/;
  if (!telephoneRegex.test(telephone)) {
    return { isValid: false, message: "Telephone number must be 10 digits" };
  }

  return { isValid: true };
};

const validateBusinessCode = (code) => {
  if (!code) {
    return { isValid: false, message: "Business code is required" };
  }

  // Alphanumeric validation
  const businessCodeRegex = /^[a-zA-Z0-9]+$/;
  if (!businessCodeRegex.test(code)) {
    return { isValid: false, message: "Business code can only contain letters and numbers" };
  }

  if (code.length !== 15) {
    return { isValid: false, message: 'Business code must be exactly 15 characters' };
  }

  return { isValid: true };
};

module.exports = {
  validateUsername,
  validatePassword,
  validateGSTNumber,
  validateEmail,
  validateBrandName,
  validateOwnerName,
  validateTelephone,
  validateBusinessCode
};