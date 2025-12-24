const Vendor = require('../models/Vendor');

const checkTemplateLimits = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ v_id: req.vendor.v_id });

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // For free plan users
    if (vendor.v_plan === 'free') {
      // Check if they've already created 10 templates
      if (vendor.v_templates_created >= 10) {
        return res.status(403).json({
          message: 'Free plan limit reached. Please upgrade to premium for unlimited templates.',
          upgrade_required: true
        });
      }
    }

    // For premium users, check if subscription is active
    if (vendor.v_plan === 'premium' && vendor.v_subscription_status !== 'active') {
      return res.status(403).json({
        message: 'Your premium subscription has expired. Please renew to continue creating templates.',
        subscription_expired: true
      });
    }

    next();
  } catch (error) {
    console.error('Error in template limits middleware:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = checkTemplateLimits; 