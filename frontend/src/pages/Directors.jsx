import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { Plus, RefreshCw, UserCheck, UserX, Edit2, Shield } from 'lucide-react';
import { format } from 'date-fns';

const Directors = () => {
  const { isAdmin } = useAuth();
  const [directors, setDirectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedDirector, setSelectedDirector] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    mobile: '',
    password: ''
  });

  useEffect(() => {
    if (!isAdmin) {
      toast.error('Access denied: Admin only');
      return;
    }
    fetchDirectors();
  }, [isAdmin]);

  const fetchDirectors = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/directors');
      setDirectors(data.data);
    } catch (error) {
      toast.error('Failed to fetch directors');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editMode && selectedDirector) {
        await api.put(`/directors/${selectedDirector._id}`, formData);
        toast.success('Director updated successfully');
      } else {
        await api.post('/directors', formData);
        toast.success('Director created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchDirectors();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const toggleStatus = async (director) => {
    try {
      await api.put(`/directors/${director._id}`, {
        isActive: !director.isActive
      });
      toast.success(`Director ${!director.isActive ? 'activated' : 'deactivated'}`);
      fetchDirectors();
    } catch (error) {
      toast.error('Failed to update director status');
    }
  };

  const openAddModal = () => {
    setEditMode(false);
    setSelectedDirector(null);
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (director) => {
    setEditMode(true);
    setSelectedDirector(director);
    setFormData({
      name: director.name,
      username: director.username,
      mobile: director.mobile || '',
      password: '' // Don't populate password
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      username: '',
      mobile: '',
      password: ''
    });
  };

  if (!isAdmin) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-semibold">Access Denied</h3>
        <p className="text-red-600 mt-2">Only administrators can manage directors</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Directors Management</h1>
          <p className="text-gray-600 mt-1">Manage director accounts (Admin only)</p>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={fetchDirectors} className="btn btn-secondary">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <button onClick={openAddModal} className="btn btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Director
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Total Directors</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{directors.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Active</div>
          <div className="text-2xl font-bold text-green-600 mt-1">
            {directors.filter((d) => d.isActive).length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Inactive</div>
          <div className="text-2xl font-bold text-red-600 mt-1">
            {directors.filter((d) => !d.isActive).length}
          </div>
        </div>
      </div>

      {/* Directors Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Username</th>
                <th>Mobile</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {directors.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    No directors found
                  </td>
                </tr>
              ) : (
                directors.map((director) => (
                  <tr key={director._id}>
                    <td>
                      <div className="flex items-center">
                        <Shield className="w-4 h-4 mr-2 text-blue-600" />
                        <span className="font-medium">{director.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm text-gray-600">{director.username}</span>
                    </td>
                    <td>
                      <span className="text-sm text-gray-600">
                        {director.mobile || 'N/A'}
                      </span>
                    </td>
                    <td>
                      {director.isActive ? (
                        <span className="badge badge-success">Active</span>
                      ) : (
                        <span className="badge badge-danger">Inactive</span>
                      )}
                    </td>
                    <td>
                      <span className="text-sm text-gray-600">
                        {format(new Date(director.createdAt), 'dd MMM yyyy')}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openEditModal(director)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="Edit Director"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleStatus(director)}
                          className={`p-1 ${director.isActive ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
                          title={director.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {director.isActive ? (
                            <UserX className="w-4 h-4" />
                          ) : (
                            <UserCheck className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {editMode ? 'Edit Director' : 'Add New Director'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div>
                <label className="label">Username *</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter unique username"
                  required
                />
              </div>

              <div>
                <label className="label">Mobile</label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="input"
                  placeholder="10-digit mobile"
                  pattern="[0-9]{10}"
                />
              </div>

              <div>
                <label className="label">
                  Password {editMode ? '(Leave blank to keep current)' : '*'}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter password"
                  required={!editMode}
                  minLength="6"
                />
                {!editMode && (
                  <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editMode ? 'Update Director' : 'Create Director'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Directors;
