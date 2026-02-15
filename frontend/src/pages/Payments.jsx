import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import toast from 'react-hot-toast';
import {
  Plus,
  RefreshCw,
  IndianRupee,
  Receipt,
  Calendar,
  User,
  RotateCcw,
  Eye,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';

const Payments = () => {
  const { isAdmin } = useAuth();
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReverseModal, setShowReverseModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Add Payment Form State
  const [formData, setFormData] = useState({
    studentId: '',
    amount: '',
    paymentMode: 'cash',
    receiptNumber: '',
    notes: ''
  });
  const [receiptFile, setReceiptFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Reverse Payment State
  const [reverseReason, setReverseReason] = useState('');

  useEffect(() => {
    fetchPayments();
    fetchStudents();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/payments');
      setPayments(data.data);
    } catch (error) {
      toast.error('Failed to fetch payments');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const { data } = await api.get('/students?status=active');
      setStudents(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setReceiptFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!receiptFile) {
      toast.error('Receipt image is mandatory');
      return;
    }

    const submitData = new FormData();
    submitData.append('studentId', formData.studentId);
    submitData.append('amount', formData.amount);
    submitData.append('paymentMode', formData.paymentMode);
    submitData.append('receiptNumber', formData.receiptNumber);
    submitData.append('notes', formData.notes);
    submitData.append('receiptImage', receiptFile);

    try {
      setSubmitting(true);
      await api.post('/payments', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000 // 120 second timeout for file upload to Cloudinary
      });
      toast.success('Payment recorded successfully');
      setShowAddModal(false);
      resetForm();
      fetchPayments();
      fetchStudents(); // Refresh to update fee status
    } catch (error) {
      console.error('Payment submission error:', error);
      if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
        toast.error('Cannot connect to server. Please check if backend is running.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to record payment');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleReverse = async () => {
    if (!reverseReason.trim()) {
      toast.error('Please provide a reason for reversal');
      return;
    }

    try {
      await api.put(`/payments/${selectedPayment._id}/reverse`, {
        reason: reverseReason
      });
      toast.success('Payment reversed successfully');
      setShowReverseModal(false);
      setReverseReason('');
      setSelectedPayment(null);
      fetchPayments();
      fetchStudents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reverse payment');
    }
  };

  const resetForm = () => {
    setFormData({
      studentId: '',
      amount: '',
      paymentMode: 'cash',
      receiptNumber: '',
      notes: ''
    });
    setReceiptFile(null);
  };

  const openReverseModal = (payment) => {
    setSelectedPayment(payment);
    setShowReverseModal(true);
    setReverseReason('');
  };

  const stats = {
    total: payments.filter((p) => !p.isReversed).reduce((sum, p) => sum + p.amount, 0),
    reversed: payments.filter((p) => p.isReversed).reduce((sum, p) => sum + p.amount, 0),
    count: payments.filter((p) => !p.isReversed).length,
    reversedCount: payments.filter((p) => p.isReversed).length
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
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Record and manage all payments</p>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button onClick={fetchPayments} className="btn btn-secondary flex-1 sm:flex-none">
            <RefreshCw className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary flex-1 sm:flex-none">
            <Plus className="w-4 h-4 sm:mr-2" />
            <span className="sm:inline">Add Payment</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-gray-600">Total Payments</div>
          <div className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{stats.count}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-gray-600">Total Amount</div>
          <div className="text-xl sm:text-2xl font-bold text-green-600 mt-1">₹{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-gray-600">Reversed Payments</div>
          <div className="text-xl sm:text-2xl font-bold text-red-600 mt-1">{stats.reversedCount}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-gray-600">Reversed Amount</div>
          <div className="text-xl sm:text-2xl font-bold text-red-600 mt-1">₹{stats.reversed}</div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table min-w-full">
            <thead>
              <tr>
                <th className="text-xs sm:text-sm">Date</th>
                <th className="text-xs sm:text-sm">Receipt #</th>
                <th className="text-xs sm:text-sm">Student</th>
                <th className="text-xs sm:text-sm">Amount</th>
                <th className="text-xs sm:text-sm hidden md:table-cell">Mode</th>
                <th className="text-xs sm:text-sm hidden lg:table-cell">Recorded By</th>
                <th className="text-xs sm:text-sm">Status</th>
                <th className="text-xs sm:text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-gray-500 text-sm">
                    No payments recorded yet
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment._id} className={payment.isReversed ? 'bg-red-50' : ''}>
                    <td className="text-xs sm:text-sm">
                      <div className="flex flex-col">
                        <Calendar className="w-4 h-4 text-gray-500 mb-1" />
                        <span>{format(new Date(payment.createdAt), 'dd MMM yy')}</span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(payment.createdAt), 'HH:mm')}
                        </span>
                      </div>
                    </td>
                    <td className="text-xs sm:text-sm">
                      <span className="font-mono">{payment.receiptNumber}</span>
                    </td>
                    <td className="text-xs sm:text-sm">
                      <div>
                        <div className="font-medium">{payment.student?.name || 'N/A'}</div>
                        <div className="text-xs sm:text-sm text-gray-500 hidden sm:block">{payment.student?.mobile}</div>
                        {payment.student?.feeStatus && (
                          <span className={`text-xs px-2 py-0.5 rounded mt-1 inline-block ${
                            payment.student.feeStatus === 'paid' 
                              ? 'bg-green-100 text-green-700' 
                              : payment.student.feeStatus === 'partial'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {payment.student.feeStatus === 'paid' ? 'Full Paid' : 
                             payment.student.feeStatus === 'partial' ? 'Partial' : 'Due'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="text-xs sm:text-sm">
                      <span className="font-bold text-green-600">₹{payment.amount}</span>
                    </td>
                    <td className="text-xs sm:text-sm hidden md:table-cell">
                      <span className="badge bg-gray-100 text-gray-800 capitalize">
                        {payment.paymentMode}
                      </span>
                    </td>
                    <td className="text-xs sm:text-sm hidden lg:table-cell">
                      <div>{payment.collectedBy?.name || 'N/A'}</div>
                    </td>
                    <td className="text-xs sm:text-sm">
                      {payment.isReversed ? (
                        <span className="badge badge-danger text-xs">Reversed</span>
                      ) : (
                        <span className="badge badge-success text-xs">Active</span>
                      )}
                    </td>
                    <td className="text-xs sm:text-sm">
                      <div className="flex items-center space-x-2">
                        {payment.receiptImage && (
                          <a
                            href={payment.receiptImage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="View Receipt"
                          >
                            <Receipt className="w-4 h-4" />
                          </a>
                        )}
                        {!payment.isReversed && isAdmin && (
                          <button
                            onClick={() => openReverseModal(payment)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Reverse Payment"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Payment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 sm:p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <IndianRupee className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold">Record Payment</h3>
                    <p className="text-green-100 text-xs sm:text-sm mt-1">Add new payment with receipt</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="w-8 h-8 sm:w-9 sm:h-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition text-white text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Student Selection */}
              <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
                <label className="label flex items-center text-blue-900 text-sm sm:text-base">
                  <User className="w-4 h-4 mr-2" />
                  Select Student *
                </label>
                <select
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  className="input mt-2 border-blue-300 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  required
                >
                  <option value="">-- Select Student --</option>
                  {students.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.name} - {student.mobile} - Seat: {student.seatNumber} - Type: {student.studentType}
                    </option>
                  ))}
                </select>
              </div>

              {/* Payment Details */}
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
                  <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" />
                  Payment Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="label text-sm sm:text-base">Amount * (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm sm:text-base">
                        ₹
                      </span>
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        className="input pl-8 text-sm sm:text-base"
                        placeholder="Enter amount"
                        required
                        min="1"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label text-sm sm:text-base">Payment Mode *</label>
                    <select
                      name="paymentMode"
                      value={formData.paymentMode}
                      onChange={handleChange}
                      className="input text-sm sm:text-base"
                      required
                    >
                      <option value="cash">💵 Cash</option>
                      <option value="upi">📱 UPI</option>
                      <option value="card">💳 Card</option>
                      <option value="bank_transfer">🏦 Bank Transfer</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Receipt Details */}
              <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
                  <Receipt className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-yellow-600" />
                  Receipt Information
                </h4>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="label text-sm sm:text-base">Receipt Number *</label>
                    <input
                      type="text"
                      name="receiptNumber"
                      value={formData.receiptNumber}
                      onChange={handleChange}
                      className="input border-yellow-300 focus:ring-yellow-500 focus:border-yellow-500 text-sm sm:text-base"
                      placeholder="e.g., RCP-001 or AUTO-001"
                      required
                    />
                  </div>

                  <div>
                    <label className="label flex items-center text-red-700 text-sm sm:text-base">
                      <span className="bg-red-100 px-2 py-0.5 rounded text-xs font-bold mr-2">
                        REQUIRED
                      </span>
                      Upload Receipt Image *
                    </label>
                    <div className="mt-2">
                      <label className="flex items-center justify-center w-full p-3 sm:p-4 border-2 border-dashed border-yellow-400 rounded-lg cursor-pointer hover:bg-yellow-100 transition bg-white">
                        <div className="text-center">
                          <FileText className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-yellow-600 mb-2" />
                          <span className="text-xs sm:text-sm font-medium text-gray-700">
                            {receiptFile ? receiptFile.name : 'Click to upload receipt image'}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG, JPEG up to 5MB
                          </p>
                        </div>
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="hidden"
                          accept="image/*"
                          required
                        />
                      </label>
                    </div>
                    {receiptFile && (
                      <div className="mt-2 flex items-center text-xs sm:text-sm text-green-700 bg-green-50 px-3 py-2 rounded">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                        Receipt uploaded successfully
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="label text-sm sm:text-base">Additional Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="input text-sm sm:text-base"
                  rows="3"
                  placeholder="Add any additional information about this payment..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="btn btn-secondary w-full sm:w-auto"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary bg-green-600 hover:bg-green-700 w-full sm:w-auto" 
                  disabled={submitting || !receiptFile}
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Recording...
                    </>
                  ) : (
                    <>
                      <IndianRupee className="w-4 h-4 mr-2" />
                      Record Payment
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reverse Payment Modal */}
      {showReverseModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowReverseModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 sm:p-5 rounded-t-2xl">
              <h3 className="text-xl font-bold">Reverse Payment</h3>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
                <p className="text-sm text-yellow-800 font-semibold">⚠️ Warning</p>
                <p className="text-sm text-yellow-700 mt-1">
                  This action will reverse the payment and update student's fee status
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Student:</span>
                  <span className="font-semibold">{selectedPayment.student?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Amount:</span>
                  <span className="font-semibold text-red-600">₹{selectedPayment.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Receipt:</span>
                  <span className="font-mono text-sm">{selectedPayment.receiptNumber}</span>
                </div>
              </div>

              <div>
                <label className="label">Reason for Reversal *</label>
                <textarea
                  value={reverseReason}
                  onChange={(e) => setReverseReason(e.target.value)}
                  className="input"
                  rows="3"
                  placeholder="Please provide a reason for reversing this payment..."
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowReverseModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReverse}
                  className="btn btn-danger"
                  disabled={!reverseReason.trim()}
                >
                  Reverse Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
