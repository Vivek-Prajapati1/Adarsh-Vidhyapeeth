import AuditLog from '../models/AuditLog.js';

// @desc    Get all audit logs
// @route   GET /api/audit-logs
// @access  Private (Admin sees all, Directors see filtered)
export const getAllAuditLogs = async (req, res) => {
  try {
    const { action, performedBy, targetModel, targetId, startDate, endDate, limit = 100 } = req.query;
    
    let query = {};
    
    if (action) {
      query.action = action;
    }
    
    if (performedBy) {
      query.performedBy = performedBy;
    }
    
    if (targetModel) {
      query.targetModel = targetModel;
    }
    
    if (targetId) {
      query.targetId = targetId;
    }
    
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) {
        query.timestamp.$gte = new Date(startDate);
      }
      if (endDate) {
        query.timestamp.$lte = new Date(endDate);
      }
    }
    
    // Directors cannot see admin actions
    if (req.user.role === 'director') {
      query.performedByRole = { $ne: 'admin' };
    }

    const logs = await AuditLog.find(query)
      .populate('performedBy', 'name username role')
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get audit log by ID
// @route   GET /api/audit-logs/:id
// @access  Private (Admin sees all, Directors see filtered)
export const getAuditLogById = async (req, res) => {
  try {
    const log = await AuditLog.findById(req.params.id)
      .populate('performedBy', 'name username role');

    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Audit log not found'
      });
    }
    
    // Directors cannot see admin actions
    if (req.user.role === 'director' && log.performedByRole === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      data: log
    });
  } catch (error) {
    console.error('Get audit log error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get audit logs by target
// @route   GET /api/audit-logs/target/:model/:id
// @access  Private (Admin sees all, Directors see filtered)
export const getAuditLogsByTarget = async (req, res) => {
  try {
    const { model, id } = req.params;

    let query = {
      targetModel: model,
      targetId: id
    };
    
    // Directors cannot see admin actions
    if (req.user.role === 'director') {
      query.performedByRole = { $ne: 'admin' };
    }

    const logs = await AuditLog.find(query)
      .populate('performedBy', 'name username role')
      .sort({ timestamp: -1 });

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    console.error('Get audit logs by target error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get audit log statistics
// @route   GET /api/audit-logs/stats
// @access  Private/Admin
export const getAuditLogStats = async (req, res) => {
  try {
    const totalLogs = await AuditLog.countDocuments();
    
    const actionCounts = await AuditLog.aggregate([
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const userActivity = await AuditLog.aggregate([
      {
        $group: {
          _id: '$performedBy',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          userId: '$_id',
          userName: '$user.name',
          userRole: '$user.role',
          count: 1
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalLogs,
        actionCounts,
        topActiveUsers: userActivity
      }
    });
  } catch (error) {
    console.error('Get audit log stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
