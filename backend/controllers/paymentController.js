import Payment from '../models/Payment.js';
import Student from '../models/Student.js';
import { createAuditLog } from '../utils/auditLogger.js';
import { createNotification } from './notificationController.js';

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private
export const getAllPayments = async (req, res) => {
  try {
    const { studentId, directorId, startDate, endDate } = req.query;
    
    let query = {};
    
    if (studentId) {
      query.student = studentId;
    }
    
    if (directorId) {
      query.collectedBy = directorId;
    }
    
    if (startDate || endDate) {
      query.collectionDate = {};
      if (startDate) {
        query.collectionDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.collectionDate.$lte = new Date(endDate);
      }
    }

    const payments = await Payment.find(query)
      .populate('student', 'name mobile studentType seatNumber')
      .populate('collectedBy', 'name username')
      .populate('reversedBy', 'name username')
      .sort({ collectionDate: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get payment by ID
// @route   GET /api/payments/:id
// @access  Private
export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('student', 'name mobile studentType seatNumber')
      .populate('collectedBy', 'name username')
      .populate('reversedBy', 'name username');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add new payment
// @route   POST /api/payments
// @access  Private
export const addPayment = async (req, res) => {
  try {
    console.log('Payment request received:', {
      body: req.body,
      file: req.file ? 'File present' : 'No file',
      user: req.user?.id
    });

    const { studentId, amount, paymentMode, receiptNumber, notes } = req.body;

    // Validate required fields
    if (!studentId || !amount || !paymentMode || !receiptNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if receipt image is uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Receipt image is mandatory'
      });
    }

    // Find student
    const student = await Student.findById(studentId);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    if (student.isDeleted) {
      return res.status(400).json({
        success: false,
        message: 'Cannot add payment for deleted student'
      });
    }

    // Get receipt image URL from Cloudinary
    const receiptPath = req.file.path; // Cloudinary URL
    console.log('Receipt uploaded to Cloudinary:', receiptPath);

    // Create payment
    const payment = await Payment.create({
      student: studentId,
      amount: parseFloat(amount),
      paymentMode,
      receiptNumber,
      receiptImage: receiptPath,
      notes: notes || '',
      collectedBy: req.user.id,
      collectionDate: new Date()
    });

    console.log('Payment created:', payment._id);

    // Update student fee status
    student.feePaid += parseFloat(amount);
    student.feeDue = student.totalFee - student.feePaid;
    
    if (student.feePaid > student.totalFee) {
      student.feeStatus = 'overpaid';
    } else if (student.feeDue <= 0) {
      student.feeStatus = 'paid';
      student.feeDue = 0;
    } else if (student.feePaid > 0) {
      student.feeStatus = 'partial';
    }
    
    await student.save();

    // Create audit log
    await createAuditLog({
      action: 'payment_added',
      performedBy: req.user.id,
      performedByName: req.user.name,
      performedByRole: req.user.role,
      targetModel: 'Payment',
      targetId: payment._id,
      newValues: {
        studentName: student.name,
        amount: payment.amount,
        paymentMode: payment.paymentMode
      },
      ipAddress: req.ip
    });

    const populatedPayment = await Payment.findById(payment._id)
      .populate('student', 'name mobile studentType')
      .populate('collectedBy', 'name username');

    // Create notification for admin and other directors
    await createNotification({
      type: 'payment_collected',
      title: 'Payment Collected',
      message: `${req.user.name} collected ₹${amount} from ${student.name} (${paymentMode})`,
      actorId: req.user.id,
      actorName: req.user.name,
      actorRole: req.user.role,
      relatedId: payment._id,
      relatedModel: 'Payment'
    });

    console.log('Payment successful:', populatedPayment._id);

    res.status(201).json({
      success: true,
      message: 'Payment added successfully',
      data: populatedPayment
    });
  } catch (error) {
    console.error('Add payment error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Reverse payment (Admin only)
// @route   PUT /api/payments/:id/reverse
// @access  Private/Admin
export const reversePayment = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Reason is required for payment reversal'
      });
    }

    const payment = await Payment.findById(req.params.id).populate('student');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    if (payment.isReversed) {
      return res.status(400).json({
        success: false,
        message: 'Payment is already reversed'
      });
    }

    // Mark payment as reversed
    payment.isReversed = true;
    payment.reversedAt = new Date();
    payment.reversedBy = req.user.id;
    payment.reversedReason = reason;
    await payment.save();

    // Update student fee status
    const student = payment.student;
    student.feePaid -= payment.amount;
    student.feeDue = student.totalFee - student.feePaid;
    
    if (student.feePaid > student.totalFee) {
      student.feeStatus = 'overpaid';
    } else if (student.feeDue >= student.totalFee) {
      student.feeStatus = 'due';
    } else if (student.feePaid >= student.totalFee) {
      student.feeStatus = 'paid';
      student.feeDue = 0;
    } else if (student.feePaid > 0) {
      student.feeStatus = 'partial';
    }
    
    await student.save();

    // Create audit log
    await createAuditLog({
      action: 'payment_reversed',
      performedBy: req.user.id,
      performedByName: req.user.name,
      performedByRole: req.user.role,
      targetModel: 'Payment',
      targetId: payment._id,
      reason,
      oldValues: {
        isReversed: false,
        amount: payment.amount
      },
      newValues: {
        isReversed: true
      },
      ipAddress: req.ip
    });

    res.status(200).json({
      success: true,
      message: 'Payment reversed successfully',
      data: payment
    });
  } catch (error) {
    console.error('Reverse payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get collection statistics
// @route   GET /api/payments/stats/collection
// @access  Private
export const getCollectionStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateQuery = { isReversed: false };
    
    if (startDate || endDate) {
      dateQuery.collectionDate = {};
      if (startDate) {
        dateQuery.collectionDate.$gte = new Date(startDate);
      }
      if (endDate) {
        dateQuery.collectionDate.$lte = new Date(endDate);
      }
    }

    // Total collection
    const totalResult = await Payment.aggregate([
      { $match: dateQuery },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);
    const totalCollection = totalResult.length > 0 ? totalResult[0].total : 0;

    // Today's collection
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayResult = await Payment.aggregate([
      {
        $match: {
          isReversed: false,
          collectionDate: { $gte: today }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);
    const todayCollection = todayResult.length > 0 ? todayResult[0].total : 0;

    // Director-wise collection
    const directorWise = await Payment.aggregate([
      { $match: dateQuery },
      {
        $group: {
          _id: '$collectedBy',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'director'
        }
      },
      {
        $unwind: '$director'
      },
      {
        $project: {
          directorId: '$_id',
          directorName: '$director.name',
          total: 1,
          count: 1
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);

    // Regular vs Premium collection
    const typeWise = await Payment.aggregate([
      { $match: dateQuery },
      {
        $lookup: {
          from: 'students',
          localField: 'student',
          foreignField: '_id',
          as: 'studentInfo'
        }
      },
      {
        $unwind: '$studentInfo'
      },
      {
        $group: {
          _id: '$studentInfo.studentType',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const regularCollection = typeWise.find(t => t._id === 'regular')?.total || 0;
    const premiumCollection = typeWise.find(t => t._id === 'premium')?.total || 0;

    res.status(200).json({
      success: true,
      data: {
        totalCollection,
        todayCollection,
        directorWise,
        typeWise: {
          regular: regularCollection,
          premium: premiumCollection
        }
      }
    });
  } catch (error) {
    console.error('Get collection stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get payments by student
// @route   GET /api/payments/student/:studentId
// @access  Private
export const getPaymentsByStudent = async (req, res) => {
  try {
    const payments = await Payment.find({
      student: req.params.studentId
    })
      .populate('collectedBy', 'name username')
      .populate('reversedBy', 'name username')
      .sort({ collectionDate: -1 });

    const totalPaid = payments
      .filter(p => !p.isReversed)
      .reduce((sum, p) => sum + p.amount, 0);

    res.status(200).json({
      success: true,
      count: payments.length,
      totalPaid,
      data: payments
    });
  } catch (error) {
    console.error('Get payments by student error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
