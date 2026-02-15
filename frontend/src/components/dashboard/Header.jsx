import { useAuth } from '../../contexts/AuthContext';
import { LogOut, Bell, Menu, User, ChevronDown, UserPlus, IndianRupee, Trash2, RefreshCw as Restore } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { formatDistanceToNow } from 'date-fns';

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const { data } = await api.get('/notifications/unread-count');
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/notifications?limit=10');
      setNotifications(data.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      fetchUnreadCount();
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      fetchUnreadCount();
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    const iconClass = "w-4 h-4 sm:w-5 sm:h-5";
    switch (type) {
      case 'student_added':
        return <UserPlus className={`${iconClass} text-blue-600`} />;
      case 'payment_collected':
        return <IndianRupee className={`${iconClass} text-green-600`} />;
      case 'student_deleted':
        return <Trash2 className={`${iconClass} text-red-600`} />;
      case 'student_restored':
        return <Restore className={`${iconClass} text-purple-600`} />;
      case 'student_updated':
        return <UserPlus className={`${iconClass} text-yellow-600`} />;
      default:
        return <Bell className={`${iconClass} text-gray-600`} />;
    }
  };

  // Fetch data on mount and set interval
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (showNotifications) {
      fetchNotifications();
    }
  }, [showNotifications]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 sm:h-18 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 shadow-sm">
      <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
        {/* Hamburger Menu for Mobile */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 transition-all duration-300 flex-shrink-0"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>

        <div className="min-w-0 flex-1">
          <h2 className="text-base sm:text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 truncate">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 hidden sm:block truncate">
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl hover:bg-gradient-to-br hover:from-orange-50 hover:to-orange-100 transition-all duration-300 group"
          >
            <Bell className="w-6 h-6 text-gray-600 group-hover:text-orange-600 transition-colors" />
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse border-2 border-white">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-3 w-96 sm:max-w-[calc(100vw-2rem)] max-w-[calc(100vw-1rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 z-20 overflow-hidden max-h-[70vh] sm:max-h-[600px] flex flex-col">
                {/* Header */}
                <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-br from-orange-50 to-orange-100 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-blue-600 hover:text-blue-700 font-semibold whitespace-nowrap"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="overflow-y-auto flex-1">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="spinner"></div>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="text-center py-6 sm:py-8 text-gray-500 px-4">
                      <Bell className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-xs sm:text-sm">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification._id}
                        onClick={() => !notification.isRead && markAsRead(notification._id)}
                        className={`px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                          !notification.isRead ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-2 sm:space-x-3">
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            notification.type === 'student_added' ? 'bg-blue-100' :
                            notification.type === 'payment_collected' ? 'bg-green-100' :
                            notification.type === 'student_deleted' ? 'bg-red-100' :
                            notification.type === 'student_restored' ? 'bg-purple-100' :
                            notification.type === 'student_updated' ? 'bg-yellow-100' :
                            'bg-gray-100'
                          }`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-xs sm:text-sm font-semibold text-gray-900 break-words">{notification.title}</p>
                              {!notification.isRead && (
                                <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mt-0.5 sm:mt-1 break-words">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="px-3 sm:px-4 py-2 bg-gray-50 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        // Navigate to notifications page if you have one
                      }}
                      className="text-xs text-center w-full text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      View all notifications
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2 sm:space-x-3 px-3 py-2 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 border-2 border-transparent hover:border-blue-200"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm sm:text-base">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="hidden md:block text-left">
              <span className="block text-sm font-semibold text-gray-800">
                {user?.name}
              </span>
              <span className="block text-xs text-gray-500 capitalize">{user?.role}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-20 overflow-hidden">
                {/* Header */}
                <div className="px-4 py-3 bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <span className="text-white font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-600 capitalize flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                        {user?.role}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Menu Items */}
                <Link
                  to="/dashboard/profile"
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-medium">My Profile</span>
                </Link>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                    <LogOut className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
