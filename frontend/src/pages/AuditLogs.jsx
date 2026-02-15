import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { RefreshCw, Search, Calendar, User, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';

const AuditLogs = () => {
  const { isAdmin, user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterUser, setFilterUser] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expandedLog, setExpandedLog] = useState(null);

  useEffect(() => {
    if (!isAdmin) {
      toast.error('Access denied: Admin only');
      return;
    }
    fetchLogs();
  }, [isAdmin]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterAction !== 'all') params.append('action', filterAction);
      if (filterUser !== 'all') params.append('userId', filterUser);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const { data } = await api.get(`/audit-logs?${params}`);
      setLogs(data.data);
    } catch (error) {
      toast.error('Failed to fetch audit logs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (logId) => {
    setExpandedLog(expandedLog === logId ? null : logId);
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.performedBy?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Format values for display (remove IDs and format nicely)
  const formatValues = (values) => {
    if (!values || Object.keys(values).length === 0) return null;
    
    // Filter out ID fields
    const filtered = Object.keys(values)
      .filter(key => !key.toLowerCase().includes('id') && key !== '_id')
      .reduce((obj, key) => {
        obj[key] = values[key];
        return obj;
      }, {});
    
    return filtered;
  };

  // Render formatted values as readable list
  const renderFormattedValues = (values) => {
    const formatted = formatValues(values);
    if (!formatted || Object.keys(formatted).length === 0) {
      return <p className="text-xs sm:text-sm text-gray-500 italic">No details available</p>;
    }
    
    return (
      <div className="space-y-2">
        {Object.entries(formatted).map(([key, value]) => (
          <div key={key} className="flex items-start gap-2">
            <span className="text-xs sm:text-sm font-semibold text-gray-700 min-w-[100px] capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}:
            </span>
            <span className="text-xs sm:text-sm text-gray-600">
              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const actionTypes = [
    'all',
    'login',
    'logout',
    'student_added',
    'student_updated',
    'student_deleted',
    'student_restored',
    'payment_added',
    'payment_reversed',
    'director_created',
    'director_updated',
    'pricing_updated',
    'seat_allocated',
    'seat_freed'
  ];

  const getActionBadge = (action) => {
    const badges = {
      login: 'bg-blue-100 text-blue-800',
      logout: 'bg-gray-100 text-gray-800',
      student_added: 'bg-green-100 text-green-800',
      student_updated: 'bg-yellow-100 text-yellow-800',
      student_deleted: 'bg-red-100 text-red-800',
      student_restored: 'bg-purple-100 text-purple-800',
      payment_added: 'bg-green-100 text-green-800',
      payment_reversed: 'bg-red-100 text-red-800',
      director_created: 'bg-blue-100 text-blue-800',
      director_updated: 'bg-yellow-100 text-yellow-800',
      pricing_updated: 'bg-orange-100 text-orange-800',
      seat_allocated: 'bg-indigo-100 text-indigo-800',
      seat_freed: 'bg-pink-100 text-pink-800'
    };
    return badges[action] || 'bg-gray-100 text-gray-800';
  };

  if (!isAdmin) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-semibold">Access Denied</h3>
        <p className="text-red-600 mt-2">Only administrators can view audit logs</p>
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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-white">
            <h1 className="text-xl sm:text-2xl font-bold">Audit Logs</h1>
            <p className="text-purple-100 mt-1 text-sm sm:text-base">Complete system activity history (Admin only)</p>
          </div>
          <button onClick={fetchLogs} className="btn bg-white text-purple-600 hover:bg-purple-50 w-full sm:w-auto">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-3 sm:p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-9 sm:pl-10 text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Action Filter */}
          <div>
            <select
              value={filterAction}
              onChange={(e) => {
                setFilterAction(e.target.value);
              }}
              className="input text-sm sm:text-base"
            >
              <option value="all">All Actions</option>
              {actionTypes.filter((a) => a !== 'all').map((action) => (
                <option key={action} value={action}>
                  {action.replace(/_/g, ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Apply Filters Button */}
          <div>
            <button onClick={fetchLogs} className="btn btn-primary w-full text-sm sm:text-base">
              Apply Filters
            </button>
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
          <div>
            <label className="label text-sm sm:text-base">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="label text-sm sm:text-base">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input text-sm sm:text-base"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow p-3 sm:p-4 border border-gray-200">
          <div className="text-xs sm:text-sm text-gray-600">Total Logs</div>
          <div className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{filteredLogs.length}</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow p-3 sm:p-4 border border-blue-200">
          <div className="text-xs sm:text-sm text-gray-600">Login Activities</div>
          <div className="text-xl sm:text-2xl font-bold text-blue-600 mt-1">
            {filteredLogs.filter((l) => l.action === 'login').length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow p-3 sm:p-4 border border-green-200">
          <div className="text-xs sm:text-sm text-gray-600">Student Actions</div>
          <div className="text-xl sm:text-2xl font-bold text-green-600 mt-1">
            {filteredLogs.filter((l) => l.action.startsWith('student_')).length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow p-3 sm:p-4 border border-purple-200">
          <div className="text-xs sm:text-sm text-gray-600">Payment Actions</div>
          <div className="text-xl sm:text-2xl font-bold text-purple-600 mt-1">
            {filteredLogs.filter((l) => l.action.startsWith('payment_')).length}
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
              <tr>
                <th className="text-xs sm:text-sm">Timestamp</th>
                <th className="text-xs sm:text-sm">Action</th>
                <th className="text-xs sm:text-sm">Performed By</th>
                <th className="text-xs sm:text-sm">Target</th>
                <th className="text-xs sm:text-sm">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm sm:text-base">No audit logs found</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <>
                    <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                      <td>
                        <div className="text-xs sm:text-sm">
                          <div className="flex items-center text-gray-900">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-gray-500" />
                            {format(new Date(log.timestamp), 'dd MMM yyyy')}
                          </div>
                          <div className="text-xs text-gray-500 ml-4 sm:ml-6">
                            {format(new Date(log.timestamp), 'HH:mm:ss')}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge text-xs sm:text-sm ${getActionBadge(log.action)}`}>
                          {log.action.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center">
                          <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-gray-500" />
                          <div>
                            <div className="font-medium text-xs sm:text-sm">{log.performedBy?.name || 'System'}</div>
                            <div className="text-xs text-gray-500 capitalize">{log.performedBy?.role}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="text-xs sm:text-sm">
                          <div className="font-medium">{log.targetModel || 'N/A'}</div>
                        </div>
                      </td>
                      <td>
                        <button
                          onClick={() => toggleExpand(log._id)}
                          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          {expandedLog === log._id ? (
                            <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
                          ) : (
                            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                    {expandedLog === log._id && (
                      <tr>
                        <td colSpan="5" className="bg-gradient-to-br from-gray-50 to-gray-100">
                          <div className="p-3 sm:p-4 space-y-3">
                            <div>
                              <div className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Description:</div>
                              <div className="text-xs sm:text-sm text-gray-600 bg-white p-2 sm:p-3 rounded-lg">{log.details}</div>
                            </div>

                            {log.oldValues && Object.keys(log.oldValues).length > 0 && (
                              <div>
                                <div className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Previous Information:</div>
                                <div className="bg-white p-2 sm:p-3 rounded-lg border border-gray-200">
                                  {renderFormattedValues(log.oldValues)}
                                </div>
                              </div>
                            )}

                            {log.newValues && Object.keys(log.newValues).length > 0 && (
                              <div>
                                <div className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Updated Information:</div>
                                <div className="bg-white p-2 sm:p-3 rounded-lg border border-gray-200">
                                  {renderFormattedValues(log.newValues)}
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
