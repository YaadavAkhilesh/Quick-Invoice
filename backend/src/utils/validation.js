const validateUsername = (username) => {
    if (!username) {
        return { isValid: false, message: "Username is required" };
    }
    if (username.includes(" ")) {
        return { isValid: false, message: "Username cannot contain spaces" };
    }
    return { isValid: true, message: "Username is valid" };
};

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

const validateGSTNumber = (gstNo) => {
    return gstNo.length === 15;
};

module.exports = {
    validateUsername,
    validatePassword,
    validateGSTNumber,
};