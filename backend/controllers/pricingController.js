import Pricing from '../models/Pricing.js';
import { createAuditLog } from '../utils/auditLogger.js';

// @desc    Get all pricing
// @route   GET /api/pricing
// @access  Private
export const getAllPricing = async (req, res) => {
  try {
    const pricing = await Pricing.find({ isActive: true })
      .sort({ studentType: 1, timePlan: 1 });

    res.status(200).json({
      success: true,
      data: pricing
    });
  } catch (error) {
    console.error('Get pricing error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update pricing by ID
// @route   PUT /api/pricing/:id
// @access  Private/Admin
export const updatePricingById = async (req, res) => {
  try {
    const { id } = req.params;
    const { price } = req.body;

    if (!price || price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid price is required'
      });
    }

    const pricing = await Pricing.findById(id);

    if (!pricing) {
      return res.status(404).json({
        success: false,
        message: 'Pricing not found'
      });
    }

    const oldPrice = pricing.price;
    pricing.price = price;
    pricing.updatedBy = req.user.id;
    await pricing.save();

    // Create audit log
    await createAuditLog({
      action: 'pricing_changed',
      performedBy: req.user.id,
      performedByName: req.user.name,
      performedByRole: req.user.role,
      targetModel: 'Pricing',
      targetId: pricing._id,
      oldValues: { price: oldPrice },
      newValues: { price: price },
      ipAddress: req.ip
    });

    res.status(200).json({
      success: true,
      message: 'Pricing updated successfully',
      data: pricing
    });
  } catch (error) {
    console.error('Update pricing error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update pricing
// @route   PUT /api/pricing/:type/:plan
// @access  Private/Admin
export const updatePricing = async (req, res) => {
  try {
    const { type, plan } = req.params;
    const { price } = req.body;

    if (!price || price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid price is required'
      });
    }

    const pricing = await Pricing.findOne({
      studentType: type,
      timePlan: plan
    });

    if (!pricing) {
      return res.status(404).json({
        success: false,
        message: 'Pricing not found'
      });
    }

    const oldPrice = pricing.price;
    pricing.price = price;
    pricing.updatedBy = req.user.id;
    await pricing.save();

    // Create audit log
    await createAuditLog({
      action: 'pricing_changed',
      performedBy: req.user.id,
      performedByName: req.user.name,
      performedByRole: req.user.role,
      targetModel: 'Pricing',
      targetId: pricing._id,
      oldValues: { price: oldPrice },
      newValues: { price: price },
      ipAddress: req.ip
    });

    res.status(200).json({
      success: true,
      message: 'Pricing updated successfully',
      data: pricing
    });
  } catch (error) {
    console.error('Update pricing error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get price for student type and plan
// @route   GET /api/pricing/:type/:plan
// @access  Private
export const getPriceByTypePlan = async (req, res) => {
  try {
    const { type, plan } = req.params;

    const pricing = await Pricing.findOne({
      studentType: type,
      timePlan: plan,
      isActive: true
    });

    if (!pricing) {
      return res.status(404).json({
        success: false,
        message: 'Pricing not found for this combination'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        studentType: pricing.studentType,
        timePlan: pricing.timePlan,
        price: pricing.price
      }
    });
  } catch (error) {
    console.error('Get price error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
