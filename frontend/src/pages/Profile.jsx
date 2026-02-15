import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { User, Lock, Save, Eye, EyeOff } from 'lucide-react';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    currentPassword: '',
    newPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    if (!formData.username.trim()) {
      toast.error('Username is required');
      return;
    }

    // If changing password, validate
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        toast.error('Current password is required to set new password');
        return;
      }
      if (formData.newPassword.length < 6) {
        toast.error('New password must be at least 6 characters');
        return;
      }
    }

    try {
      setLoading(true);
      
      const updateData = {
        name: formData.name,
        username: formData.username
      };

      // Only include password fields if changing password
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const { data } = await api.put('/auth/profile', updateData);

      // Update user context
      setUser(data.user);

      toast.success('Profile updated successfully!');
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: ''
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="text-blue-100">Update your account information and password</p>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Info Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              User Information
            </h2>
            
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="label">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter your name"
                  required
                />
              </div>

              {/* Username */}
              <div>
                <label className="label">Username *</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter username"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  This is used for logging in
                </p>
              </div>

              {/* Role (Read-only) */}
              <div>
                <label className="label">Role</label>
                <input
                  type="text"
                  value={user?.role || ''}
                  className="input bg-gray-50"
                  disabled
                />
              </div>

              {/* Mobile (Read-only) */}
              {user?.mobile && (
                <div>
                  <label className="label">Mobile</label>
                  <input
                    type="text"
                    value={user.mobile}
                    className="input bg-gray-50"
                    disabled
                  />
                </div>
              )}
            </div>
          </div>

          {/* Password Section */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Lock className="w-5 h-5 mr-2" />
              Change Password
            </h2>
            
            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="label">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="input pr-10"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="label">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="input pr-10"
                    placeholder="Enter new password (min 6 characters)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Leave blank if you don't want to change password
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex items-center"
            >
              {loading ? (
                <>
                  <div className="spinner-small mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Security Tips</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use a strong password with at least 6 characters</li>
          <li>• Don't share your password with anyone</li>
          <li>• Change your password regularly for better security</li>
          <li>• If you forget your password, contact the administrator</li>
        </ul>
      </div>
    </div>
  );
};

export default Profile;
