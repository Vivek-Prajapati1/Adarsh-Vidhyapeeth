import Student from '../models/Student.js';
import Seat from '../models/Seat.js';
import Pricing from '../models/Pricing.js';
import { createAuditLog } from '../utils/auditLogger.js';
import { createNotification } from './notificationController.js';

// @desc    Get all students
// @route   GET /api/students
// @access  Private
export const getAllStudents = async (req, res) => {
  try {
    const { status, type, includeDeleted } = req.query;
    
    let query = {};
    
    // Admin can see deleted students, directors cannot
    if (req.user.role === 'admin' && includeDeleted === 'true') {
      // Show all including deleted
    } else {
      query.isDeleted = false;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (type) {
      query.studentType = type;
    }

    const students = await Student.find(query)
      .populate('addedBy', 'name username')
      .populate('deletedBy', 'name username')
      .populate('restoredBy', 'name username')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get student by ID
// @route   GET /api/students/:id
// @access  Private
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('addedBy', 'name username')
      .populate('deletedBy', 'name username')
      .populate('restoredBy', 'name username');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Directors cannot see deleted students
    if (req.user.role === 'director' && student.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new student
// @route   POST /api/students
// @access  Private
export const createStudent = async (req, res) => {
  try {
    const { name, mobile, studentType, timePlan, seatNumber, joinDate } = req.body;

    // Validate required fields
    if (!name || !mobile || !studentType || !timePlan || !seatNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Get pricing
    const pricing = await Pricing.findOne({
      studentType,
      timePlan,
      isActive: true
    });

    if (!pricing) {
      return res.status(400).json({
        success: false,
        message: 'Pricing not found for selected type and plan'
      });
    }

    // Check if seat exists and is available
    const seat = await Seat.findOne({ seatId: seatNumber.toUpperCase() });
    
    if (!seat) {
      return res.status(400).json({
        success: false,
        message: 'Invalid seat number'
      });
    }

    if (seat.status === 'occupied') {
      return res.status(400).json({
        success: false,
        message: 'Seat is already occupied'
      });
    }

    // Validate seat type matches student type
    if (seat.seatType !== studentType) {
      return res.status(400).json({
        success: false,
        message: `${studentType === 'regular' ? 'Regular' : 'Premium'} students can only be assigned ${studentType} seats`
      });
    }

    // Calculate expiry date based on time plan
    const join = joinDate ? new Date(joinDate) : new Date();
    const expiry = new Date(join);
    expiry.setMonth(expiry.getMonth() + 1); // 1 month validity

    // Handle student photo if uploaded (Cloudinary URL)
    let photoPath = null;
    if (req.file) {
      photoPath = req.file.path; // Cloudinary URL
    }

    // Create student
    const student = await Student.create({
      name,
      mobile,
      photo: photoPath,
      studentType,
      timePlan,
      seatNumber: seatNumber.toUpperCase(),
      joinDate: join,
      expiryDate: expiry,
      totalFee: pricing.price,
      feePaid: 0,
      feeDue: pricing.price,
      feeStatus: 'due',
      status: 'active',
      addedBy: req.user.id
    });

    // Update seat status
    seat.status = 'occupied';
    seat.occupiedBy = student._id;
    seat.lastOccupiedAt = new Date();
    await seat.save();

    // Create audit log
    await createAuditLog({
      action: 'student_added',
      performedBy: req.user.id,
      performedByName: req.user.name,
      performedByRole: req.user.role,
      targetModel: 'Student',
      targetId: student._id,
      newValues: {
        name: student.name,
        mobile: student.mobile,
        studentType: student.studentType,
        timePlan: student.timePlan,
        seatNumber: student.seatNumber
      },
      ipAddress: req.ip
    });

    await createAuditLog({
      action: 'seat_assigned',
      performedBy: req.user.id,
      performedByName: req.user.name,
      performedByRole: req.user.role,
      targetModel: 'Seat',
      targetId: seat._id,
      newValues: {
        seatId: seat.seatId,
        assignedTo: student.name,
        studentId: student._id
      },
      ipAddress: req.ip
    });

    // Create notification for admin and other directors
    await createNotification({
      type: 'student_added',
      title: 'New Student Added',
      message: `${req.user.name} added a new student: ${student.name} (${student.studentType} - ${student.timePlan})`,
      actorId: req.user.id,
      actorName: req.user.name,
      actorRole: req.user.role,
      relatedId: student._id,
      relatedModel: 'Student'
    });

    res.status(201).json({
      success: true,
      message: 'Student added successfully',
      data: student
    });
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private
export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    if (student.isDeleted) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update deleted student'
      });
    }

    const oldValues = {
      name: student.name,
      mobile: student.mobile,
      studentType: student.studentType,
      timePlan: student.timePlan,
      seatNumber: student.seatNumber
    };

    // Update fields
    const { name, mobile, studentType, timePlan, seatNumber } = req.body;
    
    if (name) student.name = name;
    if (mobile) student.mobile = mobile;
    
    // Handle student type change
    if (studentType && studentType !== student.studentType) {
      student.studentType = studentType;
    }
    
    // Handle time plan change
    if (timePlan && timePlan !== student.timePlan) {
      // Get new pricing
      const pricing = await Pricing.findOne({
        seatType: student.studentType,
        duration: timePlan,
        isActive: true
      });
      
      if (pricing) {
        student.timePlan = timePlan;
        student.totalFee = pricing.price;
        student.feePaid = Number(student.feePaid) || 0;
        student.feeDue = Number(student.totalFee) - Number(student.feePaid);
        
        // Update fee status
        if (student.feePaid > student.totalFee) {
          student.feeStatus = 'advanced';
        } else if (student.feePaid === student.totalFee) {
          student.feeStatus = 'paid';
          student.feeDue = 0;
        } else if (student.feePaid > 0) {
          student.feeStatus = 'partial';
        } else {
          student.feeStatus = 'due';
        }
      }
    }
    
    // Handle seat change
    if (seatNumber && seatNumber !== student.seatNumber) {
      // Free old seat
      await Seat.findOneAndUpdate(
        { seatId: student.seatNumber },
        { status: 'available', occupiedBy: null }
      );
      
      // Occupy new seat
      const newSeat = await Seat.findOne({ seatId: seatNumber });
      if (!newSeat) {
        return res.status(404).json({
          success: false,
          message: 'New seat not found'
        });
      }
      
      if (newSeat.status === 'occupied') {
        return res.status(400).json({
          success: false,
          message: 'Seat is already occupied'
        });
      }
      
      newSeat.status = 'occupied';
      newSeat.occupiedBy = student._id;
      await newSeat.save();
      
      student.seatNumber = seatNumber;
    }
    
    // Handle photo update if uploaded (Cloudinary URL)
    if (req.file) {
      student.photo = req.file.path; // Cloudinary URL
    }

    await student.save();

    // Create audit log
    await createAuditLog({
      action: 'student_updated',
      performedBy: req.user.id,
      performedByName: req.user.name,
      performedByRole: req.user.role,
      targetModel: 'Student',
      targetId: student._id,
      oldValues,
      newValues: {
        name: student.name,
        mobile: student.mobile,
        studentType: student.studentType,
        timePlan: student.timePlan,
        seatNumber: student.seatNumber
      },
      ipAddress: req.ip
    });

    // Create notification for admin and other directors
    await createNotification({
      type: 'student_updated',
      title: 'Student Updated',
      message: `${req.user.name} updated student: ${student.name}`,
      actorId: req.user.id,
      actorName: req.user.name,
      actorRole: req.user.role,
      relatedId: student._id,
      relatedModel: 'Student'
    });

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: student
    });
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Soft delete student
// @route   DELETE /api/students/:id
// @access  Private
export const deleteStudent = async (req, res) => {
  try {
    const { reason } = req.body;
    
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    if (student.isDeleted) {
      return res.status(400).json({
        success: false,
        message: 'Student is already deleted'
      });
    }

    // Soft delete
    student.isDeleted = true;
    student.deletedAt = new Date();
    student.deletedBy = req.user.id;
    student.deletedReason = reason || 'No reason provided';
    student.status = 'deleted';
    await student.save();

    // Free the seat
    await Seat.findOneAndUpdate(
      { seatId: student.seatNumber },
      {
        status: 'available',
        occupiedBy: null,
        lastOccupiedAt: new Date()
      }
    );

    // Create audit log
    await createAuditLog({
      action: 'student_deleted',
      performedBy: req.user.id,
      performedByName: req.user.name,
      performedByRole: req.user.role,
      targetModel: 'Student',
      targetId: student._id,
      reason: reason || 'No reason provided',
      oldValues: {
        status: 'active',
        seatNumber: student.seatNumber
      },
      newValues: {
        status: 'deleted',
        isDeleted: true
      },
      ipAddress: req.ip
    });

    // Create notification for admin and other directors
    await createNotification({
      type: 'student_deleted',
      title: 'Student Deleted',
      message: `${req.user.name} deleted student: ${student.name} - Reason: ${reason || 'No reason provided'}`,
      actorId: req.user.id,
      actorName: req.user.name,
      actorRole: req.user.role,
      relatedId: student._id,
      relatedModel: 'Student'
    });

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully',
      data: student
    });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Restore deleted student (Admin only)
// @route   PUT /api/students/:id/restore
// @access  Private/Admin
export const restoreStudent = async (req, res) => {
  try {
    const { seatNumber } = req.body;
    
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    if (!student.isDeleted) {
      return res.status(400).json({
        success: false,
        message: 'Student is not deleted'
      });
    }

    if (!seatNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide seat number'
      });
    }

    // Check if seat is available
    const seat = await Seat.findOne({ seatId: seatNumber.toUpperCase() });
    
    if (!seat) {
      return res.status(400).json({
        success: false,
        message: 'Invalid seat number'
      });
    }

    if (seat.status === 'occupied') {
      return res.status(400).json({
        success: false,
        message: 'Seat is already occupied'
      });
    }

    if (seat.seatType !== student.studentType) {
      return res.status(400).json({
        success: false,
        message: 'Seat type mismatch'
      });
    }

    // Restore student
    student.isDeleted = false;
    student.restoredAt = new Date();
    student.restoredBy = req.user.id;
    student.status = 'active';
    student.seatNumber = seatNumber.toUpperCase();
    student.expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    await student.save();

    // Occupy seat
    seat.status = 'occupied';
    seat.occupiedBy = student._id;
    seat.lastOccupiedAt = new Date();
    await seat.save();

    // Create audit log
    await createAuditLog({
      action: 'student_restored',
      performedBy: req.user.id,
      performedByName: req.user.name,
      performedByRole: req.user.role,
      targetModel: 'Student',
      targetId: student._id,
      oldValues: {
        status: 'deleted',
        isDeleted: true
      },
      newValues: {
        status: 'active',
        isDeleted: false,
        seatNumber: student.seatNumber
      },
      ipAddress: req.ip
    });

    // Create notification for admin and other directors
    await createNotification({
      type: 'student_restored',
      title: 'Student Restored',
      message: `${req.user.name} restored student: ${student.name} to seat ${student.seatNumber}`,
      actorId: req.user.id,
      actorName: req.user.name,
      actorRole: req.user.role,
      relatedId: student._id,
      relatedModel: 'Student'
    });

    res.status(200).json({
      success: true,
      message: 'Student restored successfully',
      data: student
    });
  } catch (error) {
    console.error('Restore student error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get student statistics
// @route   GET /api/students/stats
// @access  Private
export const getStudentStats = async (req, res) => {
  try {
    const totalActive = await Student.countDocuments({ status: 'active', isDeleted: false });
    const totalExpired = await Student.countDocuments({ status: 'expired', isDeleted: false });
    const totalDeleted = await Student.countDocuments({ isDeleted: true });
    
    const regularActive = await Student.countDocuments({ 
      studentType: 'regular', 
      status: 'active', 
      isDeleted: false 
    });
    
    const premiumActive = await Student.countDocuments({ 
      studentType: 'premium', 
      status: 'active', 
      isDeleted: false 
    });

    // Fee status counts
    const paidCount = await Student.countDocuments({ feeStatus: 'paid', isDeleted: false });
    const partialCount = await Student.countDocuments({ feeStatus: 'partial', isDeleted: false });
    const dueCount = await Student.countDocuments({ feeStatus: 'due', isDeleted: false });
    const advancedCount = await Student.countDocuments({ feeStatus: 'advanced', isDeleted: false });

    // Get students with advanced payment (paid more than fees)
    const advancedStudents = await Student.find({ 
      feeStatus: 'advanced', 
      isDeleted: false 
    }).select('name mobile studentType seatNumber totalFee feePaid feeDue');

    res.status(200).json({
      success: true,
      data: {
        total: {
          active: totalActive,
          expired: totalExpired,
          deleted: totalDeleted
        },
        byType: {
          regular: regularActive,
          premium: premiumActive
        },
        byFeeStatus: {
          paid: paidCount,
          partial: partialCount,
          due: dueCount,
          advanced: advancedCount,
          advancedStudents: advancedStudents
        }
      }
    });
  } catch (error) {
    console.error('Get student stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Recalculate fee status for all students (utility endpoint)
// @route   POST /api/students/recalculate-fees
// @access  Private (Admin only)
export const recalculateFeeStatus = async (req, res) => {
  try {
    const students = await Student.find({ isDeleted: false });
    let updatedCount = 0;

    for (const student of students) {
      const oldStatus = student.feeStatus;
      
      // Ensure numeric values
      const feePaid = Number(student.feePaid) || 0;
      const totalFee = Number(student.totalFee) || 0;
      
      // Recalculate fee status based on current logic
      if (feePaid > totalFee) {
        student.feeStatus = 'advanced';
        student.feeDue = totalFee - feePaid; // Keep negative to show extra
      } else if (feePaid === totalFee && totalFee > 0) {
        student.feeStatus = 'paid';
        student.feeDue = 0;
      } else if (feePaid > 0) {
        student.feeStatus = 'partial';
        student.feeDue = totalFee - feePaid;
      } else {
        student.feeStatus = 'due';
        student.feeDue = totalFee - feePaid;
      }

      if (oldStatus !== student.feeStatus) {
        await student.save();
        updatedCount++;
        console.log(`Updated ${student.name}: ${oldStatus} → ${student.feeStatus}`);
      }
    }

    res.status(200).json({
      success: true,
      message: `Fee status recalculated for ${updatedCount} students`,
      data: {
        totalStudents: students.length,
        updatedCount
      }
    });
  } catch (error) {
    console.error('Recalculate fee status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
