import Seat from '../models/Seat.js';
import Student from '../models/Student.js';

// @desc    Get all seats
// @route   GET /api/seats
// @access  Private
export const getAllSeats = async (req, res) => {
  try {
    const { type, status } = req.query;
    
    let query = {};
    
    if (type) {
      query.seatType = type;
    }
    
    if (status) {
      query.status = status;
    }

    const seats = await Seat.find(query)
      .populate('occupiedBy', 'name mobile studentType')
      .sort({ seatType: 1, seatNumber: 1 });

    res.status(200).json({
      success: true,
      count: seats.length,
      data: seats
    });
  } catch (error) {
    console.error('Get seats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get available seats by type
// @route   GET /api/seats/available/:type
// @access  Private
export const getAvailableSeatsByType = async (req, res) => {
  try {
    const { type } = req.params;

    const seats = await Seat.find({
      seatType: type,
      status: 'available'
    }).sort({ seatNumber: 1 });

    res.status(200).json({
      success: true,
      count: seats.length,
      data: seats
    });
  } catch (error) {
    console.error('Get available seats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get seat statistics
// @route   GET /api/seats/stats
// @access  Private
export const getSeatStats = async (req, res) => {
  try {
    const regularTotal = await Seat.countDocuments({ seatType: 'regular' });
    const regularOccupied = await Seat.countDocuments({ seatType: 'regular', status: 'occupied' });
    const regularAvailable = regularTotal - regularOccupied;

    const premiumTotal = await Seat.countDocuments({ seatType: 'premium' });
    const premiumOccupied = await Seat.countDocuments({ seatType: 'premium', status: 'occupied' });
    const premiumAvailable = premiumTotal - premiumOccupied;

    res.status(200).json({
      success: true,
      data: {
        regular: {
          total: regularTotal,
          occupied: regularOccupied,
          available: regularAvailable
        },
        premium: {
          total: premiumTotal,
          occupied: premiumOccupied,
          available: premiumAvailable
        },
        overall: {
          total: regularTotal + premiumTotal,
          occupied: regularOccupied + premiumOccupied,
          available: regularAvailable + premiumAvailable
        }
      }
    });
  } catch (error) {
    console.error('Get seat stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Free expired seats (automated cleanup)
// @route   POST /api/seats/cleanup
// @access  Private
export const cleanupExpiredSeats = async (req, res) => {
  try {
    const now = new Date();
    
    // Find expired students
    const expiredStudents = await Student.find({
      status: 'active',
      expiryDate: { $lt: now }
    });

    for (const student of expiredStudents) {
      // Update student status
      student.status = 'expired';
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
    }

    res.status(200).json({
      success: true,
      message: `Cleaned up ${expiredStudents.length} expired seats`,
      count: expiredStudents.length
    });
  } catch (error) {
    console.error('Cleanup seats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
