import { useState, useEffect } from 'react';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { RefreshCw, Calendar, IndianRupee, TrendingUp, User } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfDay, endOfDay } from 'date-fns';

const Collections = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));

  useEffect(() => {
    fetchPayments();
  }, [startDate, endDate]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const { data } = await api.get(`/payments?${params}`);
      setPayments(data.data.filter((p) => !p.isReversed));
    } catch (error) {
      toast.error('Failed to fetch collections');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const setToday = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    setStartDate(today);
    setEndDate(today);
  };

  const setThisMonth = () => {
    setStartDate(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
    setEndDate(format(endOfMonth(new Date()), 'yyyy-MM-dd'));
  };

  // Calculate statistics
  const stats = {
    total: payments.reduce((sum, p) => sum + p.amount, 0),
    count: payments.length,
    cash: payments.filter((p) => p.paymentMode === 'cash').reduce((sum, p) => sum + p.amount, 0),
    upi: payments.filter((p) => p.paymentMode === 'upi').reduce((sum, p) => sum + p.amount, 0),
    card: payments.filter((p) => p.paymentMode === 'card').reduce((sum, p) => sum + p.amount, 0),
    bank: payments.filter((p) => p.paymentMode === 'bank_transfer').reduce((sum, p) => sum + p.amount, 0)
  };

  // Group by director
  const directorStats = payments.reduce((acc, payment) => {
    const directorName = payment.collectedBy?.name || 'Unknown';
    if (!acc[directorName]) {
      acc[directorName] = {
        name: directorName,
        count: 0,
        total: 0,
        payments: []
      };
    }
    acc[directorName].count += 1;
    acc[directorName].total += payment.amount;
    acc[directorName].payments.push(payment);
    return acc;
  }, {});

  const directorList = Object.values(directorStats).sort((a, b) => b.total - a.total);

  // Group by student type
  const typeStats = payments.reduce((acc, payment) => {
    const studentType = payment.student?.studentType || 'unknown';
    if (!acc[studentType]) {
      acc[studentType] = { count: 0, total: 0 };
    }
    acc[studentType].count += 1;
    acc[studentType].total += payment.amount;
    return acc;
  }, {});

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
          <h1 className="text-2xl font-bold text-gray-900">Collections Report</h1>
          <p className="text-gray-600 mt-1">View payment collections and analytics</p>
        </div>
        <button onClick={fetchPayments} className="btn btn-secondary">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="label">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="label">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input"
            />
          </div>
          <div className="flex items-end">
            <button onClick={setToday} className="btn btn-secondary w-full">
              Today
            </button>
          </div>
          <div className="flex items-end">
            <button onClick={setThisMonth} className="btn btn-secondary w-full">
              This Month
            </button>
          </div>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-90">Total Collection</div>
              <div className="text-3xl font-bold mt-1">₹{stats.total}</div>
            </div>
            <IndianRupee className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Total Payments</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{stats.count}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Cash</div>
          <div className="text-2xl font-bold text-green-600 mt-1">₹{stats.cash}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">UPI</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">₹{stats.upi}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Card + Bank</div>
          <div className="text-2xl font-bold text-purple-600 mt-1">
            ₹{stats.card + stats.bank}
          </div>
        </div>
      </div>

      {/* Student Type Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">By Student Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(typeStats).map(([type, data]) => (
            <div key={type} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 capitalize">{type}</div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">₹{data.total}</div>
                  <div className="text-xs text-gray-500 mt-1">{data.count} payments</div>
                </div>
                <TrendingUp className={`w-8 h-8 ${type === 'premium' ? 'text-purple-500' : 'text-blue-500'}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Director-wise Collections */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Director-wise Collections</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Director Name</th>
                <th>Total Payments</th>
                <th>Total Amount</th>
                <th>Average per Payment</th>
              </tr>
            </thead>
            <tbody>
              {directorList.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-500">
                    No collections in selected period
                  </td>
                </tr>
              ) : (
                directorList.map((director, index) => (
                  <tr key={index}>
                    <td>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="font-medium">{director.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-blue-100 text-blue-800">{director.count}</span>
                    </td>
                    <td>
                      <span className="font-bold text-green-600">₹{director.total}</span>
                    </td>
                    <td>
                      <span className="text-gray-700">
                        ₹{Math.round(director.total / director.count)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Payments */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Recent Payments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Student</th>
                <th>Amount</th>
                <th>Mode</th>
                <th>Receipt</th>
                <th>Recorded By</th>
              </tr>
            </thead>
            <tbody>
              {payments.slice(0, 10).map((payment) => (
                <tr key={payment._id}>
                  <td>
                    <div className="text-sm">
                      <div>{format(new Date(payment.createdAt), 'dd MMM yyyy')}</div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(payment.createdAt), 'HH:mm')}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div className="font-medium">{payment.student?.name || 'N/A'}</div>
                      <div className="text-xs text-gray-500">{payment.student?.mobile || ''}</div>
                    </div>
                  </td>
                  <td>
                    <span className="font-bold text-green-600">₹{payment.amount}</span>
                  </td>
                  <td>
                    <span className="badge bg-gray-100 text-gray-800 capitalize">
                      {payment.paymentMode}
                    </span>
                  </td>
                  <td>
                    <span className="font-mono text-xs">{payment.receiptNumber}</span>
                  </td>
                  <td>
                    <div className="text-sm">{payment.collectedBy?.name || 'N/A'}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Collections;
