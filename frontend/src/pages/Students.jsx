import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import toast from 'react-hot-toast';
import {
  Search,
  Filter,
  Edit2,
  Trash2,
  RefreshCw,
  Eye,
  UserCheck,
  UserX,
  Phone,
  Calendar,
  UserPlus,
  UserCircle,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';

const Students = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('active');
  const [filterFeeStatus, setFilterFeeStatus] = useState('all');
  const [showDeleted, setShowDeleted] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [studentDetail, setStudentDetail] = useState(null);
  const [studentPayments, setStudentPayments] = useState([]);
  const [deleteReason, setDeleteReason] = useState('');
  const [restoreSeat, setRestoreSeat] = useState('');
  const [availableSeats, setAvailableSeats] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, [showDeleted, filterStatus]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (showDeleted && isAdmin) params.append('includeDeleted', 'true');
      if (filterStatus !== 'all') params.append('status', filterStatus);

      const { data } = await api.get(`/students?${params}`);
      setStudents(data.data);
    } catch (error) {
      toast.error('Failed to fetch students');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSeats = async (type) => {
    try {
      const { data } = await api.get(`/seats/available/${type}`);
      setAvailableSeats(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!deleteReason.trim()) {
      toast.error('Please provide a reason for deletion');
      return;
    }

    try {
      await api.delete(`/students/${selectedStudent._id}`, {
        data: { reason: deleteReason }
      });
      toast.success('Student deleted successfully');
      setShowModal(false);
      setDeleteReason('');
      setSelectedStudent(null);
      fetchStudents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete student');
    }
  };

  const handleRestore = async () => {
    if (!restoreSeat.trim()) {
      toast.error('Please select a seat');
      return;
    }

    try {
      await api.put(`/students/${selectedStudent._id}/restore`, {
        seatNumber: restoreSeat
      });
      toast.success('Student restored successfully');
      setShowModal(false);
      setRestoreSeat('');
      setSelectedStudent(null);
      fetchStudents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to restore student');
    }
  };

  const openDeleteModal = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
    setDeleteReason('');
  };

  const openRestoreModal = async (student) => {
    setSelectedStudent(student);
    await fetchAvailableSeats(student.studentType);
    setShowModal(true);
    setRestoreSeat('');
  };

  const openDetailModal = async (student) => {
    try {
      setShowDetailModal(true);
      setStudentDetail(null);
      setStudentPayments([]);
      
      // Fetch student details
      const { data: studentData } = await api.get(`/students/${student._id}`);
      setStudentDetail(studentData.data);
      
      // Fetch payment history
      const { data: paymentsData } = await api.get(`/payments/student/${student._id}`);
      setStudentPayments(paymentsData.data);
    } catch (error) {
      toast.error('Failed to load student details');
      console.error(error);
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.mobile.includes(searchTerm);
    const matchesType = filterType === 'all' || student.studentType === filterType;
    const matchesFeeStatus = filterFeeStatus === 'all' || student.feeStatus === filterFeeStatus;
    return matchesSearch && matchesType && matchesFeeStatus;
  });

  const getStatusBadge = (status) => {
    const badges = {
      active: 'badge-success',
      expired: 'badge-warning',
      deleted: 'badge-danger'
    };
    return badges[status] || 'badge-info';
  };

  const getTypeBadge = (type) => {
    return type === 'premium' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage all student records</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/dashboard/students/add')}
            className="btn btn-primary w-full sm:w-auto"
          >
            <UserPlus className="w-4 h-4 sm:mr-2" />
            <span className="sm:inline">Add Student</span>
          </button>
          <button
            onClick={fetchStudents}
            className="btn btn-secondary w-full sm:w-auto"
          >
            <RefreshCw className="w-4 h-4 sm:mr-2" />
            <span className="sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-lg shadow p-3 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
          {/* Search */}
          <div className="sm:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or mobile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-9 sm:pl-10 text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input text-sm sm:text-base"
            >
              <option value="all">All Types</option>
              <option value="regular">Regular</option>
              <option value="premium">Premium</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input text-sm sm:text-base"
            >
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="all">All Status</option>
            </select>
          </div>

          {/* Fee Status Filter */}
          <div>
            <select
              value={filterFeeStatus}
              onChange={(e) => setFilterFeeStatus(e.target.value)}
              className="input text-sm sm:text-base"
            >
              <option value="all">All Fees</option>
              <option value="due">Due</option>
              <option value="paid">Paid</option>
              <option value="partial">Partial</option>
              <option value="overpaid">Overpaid</option>
            </select>
          </div>
        </div>

        {/* Show Deleted Toggle (Admin Only) */}
        {isAdmin && (
          <div className="mt-4 pt-4 border-t">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showDeleted}
                onChange={(e) => setShowDeleted(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Show deleted students</span>
            </label>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-gray-600">Total Students</div>
          <div className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
            {filteredStudents.length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-gray-600">Active</div>
          <div className="text-xl sm:text-2xl font-bold text-green-600 mt-1">
            {filteredStudents.filter(s => s.status === 'active').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-gray-600">Expired</div>
          <div className="text-xl sm:text-2xl font-bold text-yellow-600 mt-1">
            {filteredStudents.filter(s => s.status === 'expired').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-gray-600">Deleted</div>
          <div className="text-xl sm:text-2xl font-bold text-red-600 mt-1">
            {filteredStudents.filter(s => s.isDeleted).length}
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table min-w-full">
            <thead>
              <tr>
                <th className="text-xs sm:text-sm">Student Details</th>
                <th className="text-xs sm:text-sm hidden md:table-cell">Type & Plan</th>
                <th className="text-xs sm:text-sm">Seat</th>
                <th className="text-xs sm:text-sm hidden lg:table-cell">Dates</th>
                <th className="text-xs sm:text-sm hidden sm:table-cell">Fee Status</th>
                <th className="text-xs sm:text-sm">Status</th>
                <th className="text-xs sm:text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500 text-sm">
                    No students found
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student._id}>
                    <td className="text-xs sm:text-sm">
                      <div>
                        <div className="font-medium text-gray-900">{student.name}</div>
                        <a 
                          href={`tel:${student.mobile}`}
                          className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 flex items-center mt-1 w-fit"
                        >
                          <Phone className="w-3 h-3 mr-1" />
                          {student.mobile}
                        </a>
                      </div>
                    </td>
                    <td className="text-xs sm:text-sm hidden md:table-cell">
                      <div className="space-y-1">
                        <span className={`badge ${getTypeBadge(student.studentType)} text-xs`}>
                          {student.studentType}
                        </span>
                        <div className="text-xs text-gray-600">{student.timePlan}</div>
                      </div>
                    </td>
                    <td className="text-xs sm:text-sm">
                      <span className="font-mono font-semibold text-blue-600">
                        {student.seatNumber}
                      </span>
                    </td>
                    <td className="text-xs sm:text-sm hidden lg:table-cell">
                      <div className="text-xs space-y-1">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-3 h-3 mr-1" />
                          {format(new Date(student.joinDate), 'dd MMM yyyy')}
                        </div>
                        <div className="text-gray-500">
                          → {format(new Date(student.expiryDate), 'dd MMM yyyy')}
                        </div>
                      </div>
                    </td>
                    <td className="text-xs sm:text-sm hidden sm:table-cell">
                      <div className="space-y-1">
                        <span className={`badge text-xs ${
                          student.feeStatus === 'paid' ? 'badge-success' : 
                          student.feeStatus === 'partial' ? 'badge-warning' : 
                          student.feeStatus === 'overpaid' ? 'bg-purple-100 text-purple-800' : 
                          'badge-danger'
                        }`}>
                          {student.feeStatus}
                        </span>
                        <div className="text-xs text-gray-600">
                          ₹{student.feePaid} / ₹{student.totalFee}
                        </div>
                      </div>
                    </td>
                    <td className="text-xs sm:text-sm">
                      <span className={`badge text-xs ${getStatusBadge(student.status)}`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="text-xs sm:text-sm">
                      <div className="flex items-center space-x-2">
                        {!student.isDeleted ? (
                          <>
                            <button
                              className="text-blue-600 hover:text-blue-800 p-1"
                              onClick={() => openDetailModal(student)}
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-800 p-1"
                              onClick={() => openDeleteModal(student)}
                              title="Delete Student"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        ) : isAdmin ? (
                          <button
                            className="text-green-600 hover:text-green-800 p-1"
                            onClick={() => openRestoreModal(student)}
                            title="Restore Student"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete/Restore Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {selectedStudent?.isDeleted ? (
              // Restore Modal
              <>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Restore Student
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600 mb-2">
                      Restoring: <span className="font-semibold">{selectedStudent.name}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Select an available {selectedStudent.studentType} seat:
                    </p>
                  </div>
                  <div>
                    <label className="label">Select Seat</label>
                    <select
                      value={restoreSeat}
                      onChange={(e) => setRestoreSeat(e.target.value)}
                      className="input"
                      required
                    >
                      <option value="">-- Select Seat --</option>
                      {availableSeats.map((seat) => (
                        <option key={seat._id} value={seat.seatId}>
                          {seat.seatId}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => setShowModal(false)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRestore}
                      className="btn btn-success"
                      disabled={!restoreSeat}
                    >
                      Restore Student
                    </button>
                  </div>
                </div>
              </>
            ) : (
              // Delete Modal
              <>
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                  </div>
                </div>
                
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-4">
                  Delete Student
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-700 text-center mb-3">
                      Are you sure you want to delete
                    </p>
                    <p className="text-lg font-semibold text-gray-900 text-center mb-3">
                      {selectedStudent?.name}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-yellow-700 bg-yellow-50 rounded-md py-2 px-3 border border-yellow-200">
                      <CheckCircle className="w-4 h-4" />
                      <span>This will free up seat {selectedStudent?.seatNumber}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Reason for Deletion *
                    </label>
                    <textarea
                      value={deleteReason}
                      onChange={(e) => setDeleteReason(e.target.value)}
                      className="input resize-none"
                      rows="4"
                      placeholder="Please provide a detailed reason for deletion..."
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">This action will be logged in audit history</p>
                  </div>
                  
                  <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t">
                    <button
                      onClick={() => setShowModal(false)}
                      className="btn btn-secondary flex-1 sm:flex-none"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      className="btn btn-danger flex-1 sm:flex-none"
                      disabled={!deleteReason.trim()}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Student
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Detailed Student View Modal */}
      {showDetailModal && (
        <div className="modal-backdrop" onClick={() => setShowDetailModal(false)}>
          <div 
            className="fixed inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 top-4 sm:top-8 bottom-4 sm:bottom-8 sm:w-full sm:max-w-4xl bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-bold">Student Details</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-white hover:text-gray-200 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {!studentDetail ? (
                <div className="flex items-center justify-center h-full">
                  <div className="spinner"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Student Basic Info */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                      {/* Photo */}
                      <div className="flex-shrink-0">
                        {studentDetail.photo ? (
                          <img
                            src={studentDetail.photo}
                            alt={studentDetail.name}
                            className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg object-cover border-4 border-white shadow-lg"
                          />
                        ) : (
                          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 border-4 border-white shadow-lg flex items-center justify-center">
                            <UserCircle className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1 space-y-3">
                        <div>
                          <h4 className="text-2xl font-bold text-gray-900">{studentDetail.name}</h4>
                          <a 
                            href={`tel:${studentDetail.mobile}`}
                            className="text-blue-600 hover:text-blue-800 font-medium flex items-center mt-1 w-fit"
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            {studentDetail.mobile}
                          </a>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-600">Type:</span>
                            <span className={`ml-2 badge ${getTypeBadge(studentDetail.studentType)}`}>
                              {studentDetail.studentType}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Plan:</span>
                            <span className="ml-2 font-medium text-gray-900">{studentDetail.timePlan}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Seat:</span>
                            <span className="ml-2 font-mono font-bold text-blue-600">{studentDetail.seatNumber}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Status:</span>
                            <span className={`ml-2 badge ${getStatusBadge(studentDetail.status)}`}>
                              {studentDetail.status}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center text-sm text-gray-600 pt-2">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>
                            {format(new Date(studentDetail.joinDate), 'dd MMM yyyy')} → {' '}
                            {format(new Date(studentDetail.expiryDate), 'dd MMM yyyy')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Added By Director */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <UserCheck className="w-5 h-5 mr-2 text-green-600" />
                      Student Added By
                    </h5>
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="font-medium text-gray-900">
                        {studentDetail.addedBy?.name || 'Unknown'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {format(new Date(studentDetail.createdAt), 'dd MMM yyyy, hh:mm a')}
                      </div>
                    </div>
                  </div>

                  {/* Fee Summary */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 mb-3">Fee Summary</h5>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="text-xs text-gray-600">Total Fee</div>
                        <div className="text-lg font-bold text-blue-600">₹{studentDetail.totalFee}</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <div className="text-xs text-gray-600">Paid</div>
                        <div className="text-lg font-bold text-green-600">₹{studentDetail.feePaid}</div>
                      </div>
                      <div className="bg-red-50 rounded-lg p-3">
                        <div className="text-xs text-gray-600">Due</div>
                        <div className="text-lg font-bold text-red-600">₹{studentDetail.feeDue}</div>
                      </div>
                      <div className={`rounded-lg p-3 ${
                        studentDetail.feeStatus === 'paid' ? 'bg-green-100' : 
                        studentDetail.feeStatus === 'partial' ? 'bg-yellow-100' : 
                        studentDetail.feeStatus === 'overpaid' ? 'bg-purple-100' :
                        'bg-red-100'
                      }`}>
                        <div className="text-xs text-gray-600">Status</div>
                        <div className={`text-lg font-bold ${
                          studentDetail.feeStatus === 'paid' ? 'text-green-700' : 
                          studentDetail.feeStatus === 'partial' ? 'text-yellow-700' : 
                          studentDetail.feeStatus === 'overpaid' ? 'text-purple-700' :
                          'text-red-700'
                        }`}>
                          {studentDetail.feeStatus}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment History */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 mb-3">Payment History</h5>
                    {studentPayments.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No payments recorded yet
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {studentPayments.map((payment, index) => (
                          <div
                            key={payment._id}
                            className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 border border-gray-200"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-green-600 text-lg">
                                    ₹{payment.amount}
                                  </span>
                                  <span className="badge badge-info text-xs">
                                    {payment.paymentMode}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                  Receipt: {payment.receiptNumber}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {format(new Date(payment.collectionDate), 'dd MMM yyyy, hh:mm a')}
                                </div>
                              </div>
                              
                              <div className="bg-white rounded-lg px-3 py-2 border border-gray-200">
                                <div className="text-xs text-gray-600">Collected By</div>
                                <div className="font-medium text-gray-900">
                                  {payment.collectedBy?.name || 'Unknown'}
                                </div>
                              </div>
                            </div>
                            
                            {payment.notes && (
                              <div className="mt-2 pt-2 border-t border-gray-200">
                                <div className="text-xs text-gray-600">Notes:</div>
                                <div className="text-sm text-gray-700">{payment.notes}</div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Restored Info (if applicable) */}
                  {studentDetail.restoredBy && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <RefreshCw className="w-5 h-5 mr-2 text-blue-600" />
                        Restoration Info
                      </h5>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="font-medium text-gray-900">
                          Restored by: {studentDetail.restoredBy?.name || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {format(new Date(studentDetail.restoredAt), 'dd MMM yyyy, hh:mm a')}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t px-4 sm:px-6 py-4 bg-gray-50">
              <button
                onClick={() => setShowDetailModal(false)}
                className="btn btn-secondary w-full sm:w-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
