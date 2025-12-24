const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Generating a 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Storig OTPs with expiry
const otpStore = new Map();

const sendOTP = async (email) => {
    const otp = generateOTP();
    
    // Storing OTP with 30 seconds expiry
    otpStore.set(email, {
        otp,
        expiry: Date.now() + 30000
    });

    // Email content
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Email Verification OTP',
        html: `
            <h1>Email Verification</h1>
            <p>Your OTP for email verification is: <strong>${otp}</strong></p>
            <p>This OTP will expire in 30 seconds.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

const verifyOTP = (email, userOTP) => {
    const storedData = otpStore.get(email);
    
    if (!storedData) {
        return { isValid: false, message: "OTP has expired or not sent" };
    }

    if (Date.now() > storedData.expiry) {
        otpStore.delete(email);
        return { isValid: false, message: "OTP has expired" };
    }

    if (storedData.otp !== userOTP) {
        return { isValid: false, message: "Invalid OTP" };
    }

    // Clearing the OTP after successful verification
    otpStore.delete(email);
    return { isValid: true, message: "OTP verified successfully" };
};

module.exports = {
    sendOTP,
    verifyOTP
}; 