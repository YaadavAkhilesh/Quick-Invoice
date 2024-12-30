export const validateRegistration = (data) => {
  const errors = [];

  if (!/^[a-zA-Z0-9]+$/.test(data.username)) {
    errors.push("Username must contain only letters and numbers");
  }

  if (data.password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/^[a-zA-Z0-9!@#$%^&*()]+$/.test(data.password)) {
    errors.push(
      "Password can only contain letters, numbers, and special characters (!@#$%^&*())"
    );
  }

  if (data.gst_no.length !== 15) {
    errors.push("GST number must be exactly 15 characters long");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Invalid email format");
  }

  if (!/^\d{10}$/.test(data.mobile)) {
    errors.push("Mobile number must be 10 digits");
  }

  if (!/^\d{10}$/.test(data.telephone)) {
    errors.push("Telephone number must be 10 digits");
  }

  if (data.name.trim().length === 0) {
    errors.push("Name is required");
  }

  if (data.address.trim().length === 0) {
    errors.push("Address is required");
  }

  if (data.business_type.trim().length === 0) {
    errors.push("Business type is required");
  }

  return errors;
};
