const Vendor = require('../models/Vendor');
const Invoice = require('../models/Invoice');
const Template = require('../models/Template');

const adminController = {
    // Get all users with their details
    getAllUsers: async (req, res) => {
        try {
            const users = await Vendor.aggregate([
                {
                    $lookup: {
                        from: 'invoices',
                        localField: 'v_id',
                        foreignField: 'v_id',
                        as: 'invoices'
                    }
                },
                {
                    $lookup: {
                        from: 'templates',
                        localField: 'v_id',
                        foreignField: 'v_id',
                        as: 'templates'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        brandName: '$v_brand_name',
                        ownerName: '$v_name',  
                        email: '$v_mail',  
                        invoiceCount: '$v_invoice_count', 
                        templateCount: '$v_template_count', 
                        subscriptionPlan: { 
                            $cond: { 
                                if: { $eq: ['$v_plan', 'premium'] }, 
                                then: 'Premium',
                                else: { 
                                    $cond: {
                                        if: { $eq: ['$v_plan', 'free'] },
                                        then: 'Free',
                                        else: { $ifNull: ['$v_plan', 'Free'] }
                                    }
                                }
                            }
                        },
                        subscriptionEndDate: {
                            $cond: {
                                if: { $eq: ['$v_plan', 'premium'] },
                                then: '$v_subscription_end_date',
                                else: null
                            }
                        },
                        lastLoginAt: '$updatedAt',  
                        isLoggedIn: {
                            $cond: {
                                if: {
                                    $and: [
                                        { $ne: ['$updatedAt', null] },
                                        { 
                                            $gt: [
                                                '$updatedAt',
                                                { $subtract: [new Date(), 24 * 60 * 60 * 1000] }  
                                            ]
                                        }
                                    ]
                                },
                                then: true,
                                else: false
                            }
                        }
                    }
                }
            ]);

            // Get total active users count
            const activeUsers = users.filter(user => user.isLoggedIn).length;

            res.json({
                success: true,
                data: users,
                activeUsers: activeUsers
            });
        } catch (error) {
            console.error('Error in getAllUsers:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    },

    // Delete a user
    deleteUser: async (req, res) => {
        try {
            const { userId } = req.params;

            // Delete associated data
            await Promise.all([
                // Delete the vendor
                Vendor.findByIdAndDelete(userId),
                // Delete all invoices for this vendor
                Invoice.deleteMany({ v_id: userId }),
                // Delete all templates for this vendor
                Template.deleteMany({ t_vendor_id: userId })
            ]);
            
            res.json({
                success: true,
                message: 'User and associated data deleted successfully'
            });
        } catch (error) {
            console.error('Error in deleteUser:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
};

module.exports = adminController;
