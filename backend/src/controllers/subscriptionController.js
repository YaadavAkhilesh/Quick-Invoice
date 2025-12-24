const Razorpay = require('razorpay');
const crypto = require('crypto');
const Subscription = require('../models/Subscription');
const Vendor = require('../models/Vendor');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const subscriptionController = {
  // Create a new subscription order
  createOrder: async (req, res) => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }

      const vendorId = req.user.v_id || req.user.id;
      if (!vendorId) {
        throw new Error('Vendor ID not found');
      }

      const amount = 1500; // $15 in cents
      const currency = 'USD';
      
      const options = {
        amount,
        currency,
        receipt: `subscription_${Date.now()}`
      };

      const order = await razorpay.orders.create(options);
      
      // Create a pending subscription record
      const subscription = new Subscription({
        vendor_id: vendorId,
        plan: 'premium',
        amount: amount / 100, // Convert to dollars
        razorpay_order_id: order.id,
        status: 'pending'
      });
      
      await subscription.save();

      res.json({
        order_id: order.id,
        currency: order.currency,
        amount: order.amount
      });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ message: 'Error creating subscription order' });
    }
  },

  // Verify payment and activate subscription
  verifyPayment: async (req, res) => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }

      const vendorId = req.user.v_id || req.user.id;
      if (!vendorId) {
        throw new Error('Vendor ID not found');
      }

      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      } = req.body;

      // Verify signature
      const sign = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSign = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(sign.toString())
        .digest('hex');

      if (razorpay_signature !== expectedSign) {
        return res.status(400).json({ message: 'Invalid payment signature' });
      }

      // Update subscription
      const subscription = await Subscription.findOne({
        razorpay_order_id: razorpay_order_id,
        vendor_id: vendorId
      });

      if (!subscription) {
        return res.status(404).json({ message: 'Subscription not found' });
      }

      subscription.status = 'completed';
      subscription.razorpay_payment_id = razorpay_payment_id;
      subscription.razorpay_signature = razorpay_signature;
      subscription.start_date = new Date();
      subscription.end_date = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year
      await subscription.save();

      // Update vendor subscription status
      await Vendor.findOneAndUpdate(
        { v_id: vendorId },
        {
          v_plan: 'premium',
          v_subscription_status: 'active',
          v_subscription_end_date: subscription.end_date,
          v_pro_status: true
        }
      );

      res.json({
        message: 'Payment verified and subscription activated successfully'
      });
    } catch (error) {
      console.error('Error verifying payment:', error);
      res.status(500).json({ message: 'Error verifying payment' });
    }
  },

  // Get subscription status
  getStatus: async (req, res) => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }

      const vendorId = req.user.v_id || req.user.id;
      if (!vendorId) {
        throw new Error('Vendor ID not found');
      }

      const vendor = await Vendor.findOne({ v_id: vendorId });
      
      if (!vendor) {
        return res.status(404).json({ message: 'Vendor not found' });
      }

      res.json({
        plan: vendor.v_plan,
        status: vendor.v_subscription_status,
        end_date: vendor.v_subscription_end_date,
        template_count: vendor.v_template_count,
        templates_created: vendor.v_templates_created
      });
    } catch (error) {
      console.error('Error getting subscription status:', error);
      res.status(500).json({ message: 'Error getting subscription status' });
    }
  }
};


const activateSubscriptionWithAdminKey = async (req, res) => {
  const { adminKey } = req.body;
  const serverAdminKey = process.env.ADMIN_SUBSCRIPTION_KEY;

  console.log('Raw received adminKey (JSON):', JSON.stringify(adminKey));
  console.log('Raw received adminKey (length):', adminKey.length);
  console.log('Raw received adminKey (hex):', Buffer.from(adminKey, 'utf8').toString('hex'));


  if (!adminKey || adminKey.trim() !== process.env.ADMIN_SUBSCRIPTION_KEY.trim()) {
    return res.status(401).json({ message: 'Invalid Admin Subscription Key' });
  }


  try {
    const vendorId = req.user.v_id || req.user.id;
    if (!vendorId) throw new Error('Vendor ID not found');

    let subscription = await Subscription.findOne({
      vendor_id: vendorId,
      plan: 'premium'
    });

    if (!subscription) {
      subscription = new Subscription({
        vendor_id: vendorId,
        plan: 'premium',
        amount: 15,
        status: 'completed',
        start_date: new Date(),
        end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
      });
      await subscription.save();
    } else {
      subscription.status = 'completed';
      subscription.start_date = new Date();
      subscription.end_date = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
      await subscription.save();
    }

    await Vendor.findOneAndUpdate(
      { v_id: vendorId },
      {
        v_plan: 'premium',
        v_subscription_status: 'active',
        v_subscription_end_date: subscription.end_date,
        v_pro_status: true
      }
    );

    res.json({ message: 'Subscription activated successfully' });
  } catch (error) {
    console.error('Error activating subscription with admin key:', error);
    res.status(500).json({ message: 'Error activating subscription' });
  }
};

module.exports = {
  ...subscriptionController,
  activateSubscriptionWithAdminKey
};


// module.exports = subscriptionController; 