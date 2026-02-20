import Notification from '../models/Notification.js';
import User from '../models/User.js';

// Create notification helper
export const createNotification = async ({
  type,
  title,
  message,
  actorId,
  actorName,
  actorRole,
  relatedId,
  relatedModel
}) => {
  try {
    // Get all admins and directors except the actor
    const users = await User.find({
      _id: { $ne: actorId },
      role: { $in: ['admin', 'director'] },
      isActive: true
    }).select('_id role name');

    console.log('Creating notification for type:', type);
    console.log('Actor:', actorName, '(', actorRole, ')');
    console.log('Recipients found:', users.length, 'users');
    users.forEach(u => console.log('  -', u.name, '(', u.role, ')'));

    const recipientIds = users.map(user => user._id);

    // Create notification for all admins and directors except the actor
    const notification = await Notification.create({
      type,
      title,
      message,
      actorId,
      actorName,
      actorRole,
      recipientIds,
      relatedId,
      relatedModel
    });

    console.log('Notification created successfully with ID:', notification._id);

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Get notifications for a user
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 20, unreadOnly = false } = req.query;

    const query = {
      recipientIds: userId,
      isActive: true
    };

    // Filter for unread only
    if (unreadOnly === 'true') {
      query['readBy.userId'] = { $ne: userId };
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('actorId', 'name email role');

    // Add isRead flag for each notification
    const notificationsWithReadStatus = notifications.map(notification => {
      const isRead = notification.readBy.some(
        read => read.userId.toString() === userId.toString()
      );
      return {
        ...notification.toObject(),
        isRead
      };
    });

    res.json({
      success: true,
      data: notificationsWithReadStatus
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message
    });
  }
};

// Get unread count
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;

    const count = await Notification.countDocuments({
      recipientIds: userId,
      isActive: true,
      'readBy.userId': { $ne: userId }
    });

    res.json({
      success: true,
      count
    });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch unread count',
      error: error.message
    });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Check if already read
    const alreadyRead = notification.readBy.some(
      read => read.userId.toString() === userId.toString()
    );

    if (!alreadyRead) {
      notification.readBy.push({
        userId,
        readAt: new Date()
      });
      await notification.save();
    }

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: error.message
    });
  }
};

// Mark all as read
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({
      recipientIds: userId,
      isActive: true,
      'readBy.userId': { $ne: userId }
    });

    const updates = notifications.map(notification => {
      notification.readBy.push({
        userId,
        readAt: new Date()
      });
      return notification.save();
    });

    await Promise.all(updates);

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read',
      error: error.message
    });
  }
};

// Delete notification (admin only)
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: error.message
    });
  }
};
