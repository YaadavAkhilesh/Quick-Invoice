// controllers/connectUsController.js
const ConnectUs = require('../models/ConnectUs');

const connectUsController = {
  submitFeedback: async (req, res) => {
    try {
      const { subject, problem, rating, contactInfo, message, vendorId } = req.body;

      if (!subject || !problem || !rating || !contactInfo || !message || !vendorId) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const feedback = new ConnectUs({
        subject,
        problem,
        rating,
        contactInfo,
        message,
        vendorId
      });
      await feedback.save();

      return res.status(201).json({
        message: "Thank you for your feedback!"
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      return res.status(500).json({ message: "Error submitting feedback" });
    }
  }
};

module.exports = connectUsController;